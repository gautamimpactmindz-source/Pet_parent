import Breed from "../../models/breed/breed.model.js";
import Pet from "../../models/pet/pet.model.js";
import generateSlug from "../../utils/helperfunction/generateSlug.js";
import PetProfile from "../../models/pet/pet.profile.model.js";
import mongoose from "mongoose";
import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";
import Activity from "../../models/activity/activity.model.js";

// ADD PET
export const addPet = async (req, res) => {
  const session = await mongoose.startSession();

  let uploadedImages = [];



  try {
    await session.startTransaction();





    let {
      name,
      breed,
      species,
      gender,
      dob,
      weight,

      activityLevel,
      healthConcerns

    } = req.body;

    healthConcerns = healthConcerns
      ? JSON.parse(healthConcerns)
      : { conditions: [], description: "" };

    // 🔎 Basic Validation
    if (!name || !breed || !gender) {
      return res.status(400).json({
        message: "Name, breed and gender are required fields.",
        status: false,
      });
    }

    // 🔎 Check breed exists
    const breedExists = await Breed.findOne({
      slug: breed,
      isActive: true,
    });

    const checkname = await Pet.findOne({
      owner: req.user.id,
      name: name,
    })

    if (checkname) {
      return res.status(409).json({
        message: "You already have an active pet with this name.",
        status: false,
      });
    }

    if (!breedExists) {
      return res.status(400).json({
        message: "Selected breed is invalid or unavailable.",
        status: false,
      });
    }

    // 🐶 Create Pet
    const [createdPet] = await Pet.create(
      [{
        owner: req.user.id,
        ownername: req.user.name,
        name,
        species,
        breed: {
          id: breedExists._id,
          name: breedExists.name,
        },
        gender,
        dob,
      }],
      { session }
    );



    let profileImages = [];

    if (req.files?.length) {

      if (req.files.length > 5) {
        throw new Error("Maximum 5 images allowed.");
      }

      const uploadToCloudinary = (fileBuffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "Pets" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

          streamifier.createReadStream(fileBuffer).pipe(stream);
        });

      const uploadResults = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer))
      );

      profileImages = uploadResults.map(result => ({
        url: result.secure_url,
        key: result.public_id
      }));

      uploadedImages = profileImages;
    }



    await PetProfile.create(
      [{
        pet: createdPet._id,
        profileImages,
        weight: weight,

        activityLevel,
        healthConcerns: {
          conditions: healthConcerns?.conditions || [],
          description: healthConcerns?.description || "",
        }
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Pet added successfully.",
      status: true,
      data: {
        name: createdPet.name,
        slug: createdPet.slug,
      },
    });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    // 🧹 Cleanup Cloudinary if failed
    if (uploadedImages.length) {
      await Promise.all(
        uploadedImages.map(img =>
          cloudinary.uploader.destroy(img.key)
        )
      );
    }



    return res.status(500).json({
      message: error.message || "Unable to add pet at this time.",
      status: false,
    });
  }
};



// GET ALL PETS
export const getMyPets = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const safeLimit = limit > 10 ? 10 : limit;
    const skip = (page - 1) * safeLimit;

    const { search, species } = req.query;

    const userId = req.user.id;
    const ownername = req?.user?.name;


    const matchStage = {
      owner: new mongoose.Types.ObjectId(userId),
      isActive: true,
    };

    // 🔎 Search
    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { "breed.name": { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    // 🐶 Species filter (correct field name)
    if (species) {
      matchStage.Species = species.toLowerCase();
    }

    const aggregationPipeline = [

      { $match: matchStage },

      // 🔥 Lookup PetProfile
      {
        $lookup: {
          from: "petprofiles", // collection name (check actual Mongo collection name)
          localField: "_id",
          foreignField: "pet",
          as: "profile",
        },
      },

      // Flatten profile array
      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true,
        },
      },

      { $sort: { createdAt: -1 } },

      { $skip: skip },
      { $limit: safeLimit },

      // 🎯 Select only required fields
      {
        $project: {
          name: 1,
          slug: 1,
          gender: 1,
          dob: 1,
          Species: 1,
          isActive: 1,
          "breed.name": 1,

          // From PetProfile
          "profile.profileImages": 1,
          "profile.weight": 1,
          "profile.color": 1,
          "profile.activityLevel": 1,
        },
      },
    ];

    const pets = await Pet.aggregate(aggregationPipeline);

    // Count total
    const totalPets = await Pet.countDocuments(matchStage);
    const totalPages = Math.ceil(totalPets / safeLimit);

    if (!pets.length) {
      return res.status(200).json({
        message: "No pets found.",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Pets retrieved successfully.",
      status: true,
      data: pets.map((pet) => ({
        name: pet.name,
        breed: pet.breed?.name,
        ownername,
        gender: pet.gender,
        dob: pet.dob,
        slug: pet.slug,
        species: pet.Species,
        weight: pet.profile?.weight || null,
        color: pet.profile?.color || null,
        activityLevel: pet.profile?.activityLevel || null,
        profileImages: pet.profile?.profileImages || [],
      })),
      pagination: {
        totalPets,
        totalPages,
        currentPage: page,
        limit: safeLimit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });

  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch pets at this time.",
      error: error.message,
      status: false,
    });
  }
};


// GET SINGLE PET
export const getPetDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;

    if (!slug) {
      return res.status(400).json({
        message: "Pet identifier is required.",
        status: false,
      });
    }

    const petDetails = await Pet.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
          slug: slug,
          isActive: true
        }
      },

      // Fetch Pet Profile
      {
        $lookup: {
          from: "petprofiles",
          localField: "_id",
          foreignField: "pet",
          as: "profile"
        }
      },
      {
        $lookup: {
          from: "breeds",
          localField: "breed.id",
          foreignField: "_id",
          as: "breeddetails"
        }
      },


      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$breeddetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          species: 1,
          gender: 1,
          dob: 1,
          slug: 1,



          "profile.profileImages.url": 1,
          "profile.weight": 1,
          "profile.activityLevel": 1,
          "profile.healthConcerns.conditions": 1,
          "profile.healthConcerns.description": 1,

          "breeddetails.excerpt": 1,
          "breeddetails.name": 1,
          "breeddetails.slug": 1
        }
      },



      { $limit: 1 }
    ]);

    if (!petDetails.length) {
      return res.status(404).json({
        message: "Pet not found or access denied.",
        status: false
      });
    }

    return res.status(200).json({
      message: "Pet details retrieved successfully.",
      status: true,
      data: petDetails[0]
    });

  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch pet details.",
      error: error.message,
      status: false
    });
  }
};


export const updatePetFull = async (req, res) => {
  const session = await mongoose.startSession();
  let newUploadedImages = [];
  let oldImages = [];


  try {
    await session.startTransaction();

    const { slug } = req.params;
    const userId = req.user.id;
    const ownername = req.user.name;

    if (!slug) {
      throw new Error("Pet identifier is required.");
    }

    const parseIfString = (field) => {
      if (field && typeof field === "string") {
        try {
          return JSON.parse(field);
        } catch {
          return field;
        }
      }
      return field;
    };

    req.body.weight = parseIfString(req.body.weight);
    req.body.healthConcerns = parseIfString(req.body.healthConcerns);

    // 1️⃣ Find Pet
    const pet = await Pet.findOne({
      slug,
      owner: userId,
      isActive: true,
    }).session(session);

    if (!pet) {
      throw new Error("Pet not found or access denied.");
    }

    // 2️⃣ Update Pet Fields
    if (req.body.name) pet.name = req.body.name;
    if (req.body.gender) pet.gender = req.body.gender;
    if (req.body.dob) pet.dob = req.body.dob;
    if (req.body.species) pet.species = req.body.species;

    // Breed Update
    if (req.body.breed) {
      const breedDoc = await Breed.findOne({
        slug: req.body.breed,
        isActive: true,
      }).session(session);

      if (!breedDoc) {
        throw new Error("Selected breed is invalid.");
      }

      pet.breed = {
        id: breedDoc._id,
        name: breedDoc.name,
      };
    }

    await pet.save({ session });

    // 3️⃣ Profile
    let profile = await PetProfile.findOne({ pet: pet._id }).session(session);
    let profileImages = profile?.profileImages || [];
    oldImages = profileImages;

    // 4️⃣ Image Handling
    if (req.files?.length) {

      if (req.files.length > 5) {
        throw new Error("Maximum 5 images allowed.");
      }

      const uploadToCloudinary = (fileBuffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "Pets" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });

      const uploadResults = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer))
      );

      newUploadedImages = uploadResults.map(result => ({
        url: result.secure_url,
        key: result.public_id,
      }));

      profileImages = newUploadedImages;
    }

    const updateProfileData = {
      profileImages,
      weight: req.body.weight,

      activityLevel: req.body.activityLevel,
      healthConcerns: {
        conditions: req.body.healthConcerns?.conditions || [],
        description: req.body.healthConcerns?.description || "",
      },
    };

    if (!profile) {
      await PetProfile.create(
        [{ pet: pet._id, ...updateProfileData }],
        { session }
      );
    } else {
      await PetProfile.findOneAndUpdate(
        { pet: pet._id },
        updateProfileData,
        { new: true, session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    // ✅ Delete old images AFTER commit (Safe)
    if (newUploadedImages.length && oldImages.length) {
      await Promise.all(
        oldImages.map(img =>
          cloudinary.uploader.destroy(img.key)
        )
      );
    }

    return res.status(200).json({
      message: "Pet & Profile updated successfully.",
      status: true,
      data: {
        name: pet.name,
        slug: pet.slug,
        breed: pet.breed?.name,
        gender: pet.gender,
        dob: pet.dob,
        ownername,
      },
    });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    // Cleanup new images if update fails
    if (newUploadedImages.length) {
      await Promise.all(
        newUploadedImages.map(img =>
          cloudinary.uploader.destroy(img.key)
        )
      );
    }

    return res.status(500).json({
      message: error.message || "Something went wrong.",
      status: false,
    });
  }
};




// DELETE PET
export const deletePet = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const { slug } = req.params;
    const userId = req.user.id;

    // 1️⃣ Find Pet
    const pet = await Pet.findOne({
      slug,
      owner: userId
    }).session(session);

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found.",
        status: false,
      });
    }

    // 2️⃣ Find PetProfile
    const profile = await PetProfile.findOne({
      pet: pet._id
    }).session(session);

    // 3️⃣ Delete Cloudinary Images
    if (profile?.profileImages?.length) {
      await Promise.all(
        profile.profileImages.map((img) =>
          cloudinary.uploader.destroy(img.key)
        )
      );
    }
    const activity = await Activity.find({ "pet.id": pet._id }).session(session);
    if (activity.length > 0) {
      await Activity.deleteMany({ "pet.id": pet._id }).session(session);
    } else {
      await Activity.deleteOne({ "pet.id": pet._id }).session(session);
    }


    // 4️⃣ Delete PetProfile permanently
    if (profile) {
      await PetProfile.deleteOne({ _id: profile._id }).session(session);
    }

    // 5️⃣ Delete Pet permanently
    await Pet.deleteOne({ _id: pet._id }).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Pet permanently deleted.",
      status: true,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      message: "Unable to delete pet.",
      error: error.message,
      status: false,
    });
  }
};

export const getspecies = async (req, res) => {

  try {
    const userid = req.user.id;
    //find pet with species
    const findpet = await Pet.find({ owner: userid }).lean();
    if (findpet.length == 0) {
      return res.status(400).json({ message: "No Species found", status: false })
    }
    const species = findpet.map((item) => item?.species);
    const uniqueSpecies = [...new Set(species)];
    return res.status(200).json({ message: "Successfully reterival", data: uniqueSpecies, status: true })

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error", err, status: false })
  }
}

export const checknameexisting = async (req, res) => {
  try {
    const { name } = req.body;
    const owner = req.user.id;
    const checkexisitngpet = await Pet.findOne({ name: name, owner: owner });
    if (checkexisitngpet) {
      return res.status(200).json({ message: "Pet with this name already exists.", status: false })
    } else {
      return res.status(200).json({ message: "Pet name is available.", status: true })
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message, status: false })
  }
}
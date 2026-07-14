import cloudinary from "../../config/cloudinary.js";

import { BreedDetail } from "../../models/breed/breed_details.js";
import streamifier from "streamifier";

import mongoose from "mongoose";
import Breed from "../../models/breed/breed.model.js";

export const addBreedWithDetails = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let {
      name,
      size,
      energy,
      goodwith,
      excerpt,
      notidealfor,
      heading,
      description,
      lifeExpectancyMin,
      lifeExpectancyMax,
      about,
      temperamentTraits,
      nutritionDiet,
      nutritionNote,
      trainingExercise,
      groomingDetails,
      relatedBreeds
    } = req.body;
    const lifeExpectancy = {
      min: lifeExpectancyMin ? Number(lifeExpectancyMin) : undefined,
      max: lifeExpectancyMax ? Number(lifeExpectancyMax) : undefined,
    };

    if (
      lifeExpectancy.min !== undefined &&
      lifeExpectancy.max !== undefined &&
      lifeExpectancy.min > lifeExpectancy.max
    ) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: "Min life expectancy cannot be greater than max.",
        status: false,
      });
    }

    if (!name || !size || !energy || !goodwith || !excerpt || !notidealfor) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Basic breed fields are required.",
        status: false,
      });
    }

    //check exiting one

    const existingbreed = await Breed.findOne({ name: name });
    if (existingbreed) {
      return res
        .status(409)
        .json({ message: "Breed already Exists", status: false });
    }

    if (typeof goodwith === "string") {
      goodwith = goodwith.split(",").map((i) => i.trim());
    }

    if (typeof notidealfor === "string") {
      notidealfor = notidealfor.split(",").map((i) => i.trim());
    }

    if (typeof temperamentTraits === "string") {
      temperamentTraits = temperamentTraits.split(",").map((i) => i.trim());
    }

// 🔥 Parse relatedBreeds (FormData sends string)
if (typeof relatedBreeds === "string") {
  try {
    relatedBreeds = JSON.parse(relatedBreeds);
  } catch (err) {
    relatedBreeds = [];
  }
}


    // 🔥 Fix for embedded arrays coming as string (FormData issue)
    if (typeof nutritionDiet === "string") {
      try {
        nutritionDiet = JSON.parse(nutritionDiet);
      } catch (err) {
        nutritionDiet = [];
      }
    }

    if (typeof trainingExercise === "string") {
      try {
        trainingExercise = JSON.parse(trainingExercise);
      } catch (err) {
        trainingExercise = [];
      }
    }

    if(typeof groomingDetails==="string"){
      try {
        groomingDetails=JSON.parse(groomingDetails);
      } catch (error) {
        groomingDetails=[];
      }
    }

    let imageData = {};

    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "Breed",

          
          


             },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            },
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();

      imageData = {
        url: result.secure_url,
        key: result.public_id,
      };
    }
    
    const breed = await Breed.create(
      [
        {
          name,
          size,
          energy,
          goodwith,
          excerpt,
          notidealfor,
          BreedImage: imageData,
          relatedBreeds: relatedBreeds || []
        },
      ],
      { session },
    );

  

  const breedDetail = await BreedDetail.create(
      [
        {
          Breed_id: breed[0]._id,
          heading,
          description,
          lifeExpectancy,
          about,
          temperamentTraits,
          nutritionDiet,
          nutritionNote,
          trainingExercise,
          groomingDetails
        
        },
      ],
      { session },
    );



    if (Array.isArray(relatedBreeds) && relatedBreeds.length > 0) {

  // Prevent self reference
  relatedBreeds = relatedBreeds.filter(
    (id) => id.toString() !== breed[0]._id.toString()
  );

  // Update selected breeds to include this new breed
  await Breed.updateMany(
    { _id: { $in: relatedBreeds } },
    { $addToSet: { relatedBreeds: breed[0]._id } },
    { session }
  );
}
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Breed and details created successfully.",
      status: true,
      data: {
        breed: breed[0],
        breedDetail: breedDetail[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.log("Breed Create Error:", error);

    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

// GET ALL BREEDS
export const getAllBreeds = async (req, res) => {
  try {
    const { search="" } = req.query;



    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const safeLimit = limit > 10 ? 10 : limit;
    const skip = (page - 1) * safeLimit;

    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        {size: { $regex: search, $options: "i" } },
        {energy: { $regex: search, $options: "i" } },
        {goodwith: { $regex: search, $options: "i" } },
        
      
      ];
    }

    const breeds = await Breed.find(filter)
      .select("name size energy goodwith excerpt slug BreedImage")
      .sort({ name: 1 })
      .skip(skip)
      .limit(safeLimit)
      .lean();

      
    const total = await Breed.countDocuments(filter);

    return res.status(200).json({
      message: "Breeds retrieved successfully.",
      status: true,
      data: breeds,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / safeLimit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch breeds.",
      status: false,
    });
  }
};
export const getAllPublicBreeds = async (req, res) => {
  try {
    const { search="" } = req.query;
    


    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const safeLimit = limit > 10 ? 10 : limit;
    const skip = (page - 1) * safeLimit;

    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        {name: { $regex: search, $options: "i" } },
        // {slug: { $regex: search, $options: "i" } },
        // {size: { $regex: search, $options: "i" } },
        // {energy: { $regex: search, $options: "i" } },
        // {goodwith: { $regex: search, $options: "i" } },
        
      
      ];
    }

    let breeds = await Breed.find(filter)
      .select("name size energy goodwith excerpt slug BreedImage")
      .sort({ name: 1 })
      .skip(skip)
      .limit(safeLimit)
      .lean();
      breeds = breeds.map((breed) => {
      if (Array.isArray(breed.goodwith) && breed.goodwith.length > 0) {
        const randomIndex = Math.floor(Math.random() * breed.goodwith.length);
        breed.goodwith = breed.goodwith[randomIndex];
      } else {
        breed.goodwith = null;
      }
      return breed;
    });
      
    const total = await Breed.countDocuments(filter);

    return res.status(200).json({
      message: "Breeds retrieved successfully.",
      status: true,
      data: breeds,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / safeLimit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch breeds.",
      status: false,
    });
  }
};

export const singleBreeds = async (req, res) => {
  const { slug } = req.params;

  try {
    const breed = await Breed.findOne({
      slug,
      isActive: true,
    })
    .populate("relatedBreeds", "name slug BreedImage _id excerpt")
    
    .lean();

    if (!breed) {
      return res.status(404).json({
        message: "Breed not found",
        status: false,
      });
    }

    const breedDetail = await BreedDetail.findOne({
      Breed_id: breed._id,
    }).lean();

    return res.status(200).json({
      message: "Breed fetched successfully",
      status: true,
      data: {
        ...breed,
        details: breedDetail || null,
      },
    });
  } catch (err) {
    console.log("err :", err);
    return res.status(500).json({
      message: err.message,
      status: false,
    });
  }
};

// SOFT DELETE BREED
export const softDeleteBreed = async (req, res) => {
  const { slug } = req.params;

  try {
    if (!slug) {
      return res.status(400).json({
        message: "Breed identifier is required.",
        status: false,
      });
    }

    const breed = await Breed.findOneAndUpdate(
      { slug, isActive: true },
      { isActive: false },
      { new: true },
    );

    if (!breed) {
      return res.status(404).json({
        message: "Breed not found or already inactive.",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Breed deactivated successfully.",
      status: true,
      data: breed,
    });
  } catch (err) {
    console.error("Soft Delete Breed Error:", err);
    return res.status(500).json({
      message: "Unable to deactivate breed.",
      status: false,
    });
  }
};

// PERMANENT DELETE BREED
export const Deletebreed = async (req, res) => {
  const slug = req.params.slug;

  try {
    const Breeds = await Breed.findOneAndDelete({ slug });
    //delete also from the breed details
    const breedDetails = await BreedDetail.findOneAndDelete({ Breed_id: Breeds._id });
    if (!Breeds) {
      return res.status(404).json({
        message: "Breed not found.",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Breed deleted permanently.",
      status: true,
    });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({
      message: "Unable to delete breed.",
      status: false,
    });
  }
};

// UPDATE BREED
export const UpdateBreed = async (req, res) => {
  const slug = req.params.slug;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let {
      nutritionDiet,
      trainingExercise,
      groomingDetails,
      lifeExpectancyMin,
      lifeExpectancyMax,
      relatedBreeds,
    } = req.body;

    // 🔥 Find Breed with session
    const existingBreed = await Breed.findOne({ slug }).session(session);

    if (!existingBreed) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        message: "Breed not found.",
        status: false,
      });
    }

    // 🔥 Find BreedDetails with session
    const existingbreedDetails = await BreedDetail.findOne({
      Breed_id: existingBreed._id,
    }).session(session);

    if (!existingbreedDetails) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        message: "Breed details not found.",
        status: false,
      });
    }

    // ================= IMAGE UPDATE =================
    if (req.file) {
      if (existingBreed.BreedImage?.key) {
        await cloudinary.uploader.destroy(existingBreed.BreedImage.key);
      }

      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "Breed" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            },
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();

      existingBreed.BreedImage = {
        url: result.secure_url,
        key: result.public_id,
      };
    }

    // ================= STRING → ARRAY FIX =================
    if (typeof req.body.goodwith === "string") {
      existingBreed.goodwith = req.body.goodwith
        .split(",")
        .map((i) => i.trim());
    }

    if (typeof req.body.notidealfor === "string") {
      existingBreed.notidealfor = req.body.notidealfor
        .split(",")
        .map((i) => i.trim());
    }

    if (typeof req.body.temperamentTraits === "string") {
      existingbreedDetails.temperamentTraits = req.body.temperamentTraits
        .split(",")
        .map((i) => i.trim());
    }

    // ================= PARSE EMBEDDED ARRAYS =================
    if (typeof nutritionDiet === "string") {
      try {
        nutritionDiet = JSON.parse(nutritionDiet);
      } catch {
        nutritionDiet = [];
      }
    }

    if (typeof trainingExercise === "string") {
      try {
        trainingExercise = JSON.parse(trainingExercise);
      } catch {
        trainingExercise = [];
      }
    }

    if(typeof groomingDetails==="string"){
      try {
        groomingDetails=JSON.parse(groomingDetails);
      } catch (error) {
        groomingDetails=[];
      }
    }



//update related breed


// ================= RELATED BREEDS UPDATE WITH SYNC =================

if (typeof relatedBreeds === "string") {
  try {
    relatedBreeds = JSON.parse(relatedBreeds);
  } catch {
    relatedBreeds = [];
  }
}

if (relatedBreeds !== undefined) {

  if (!Array.isArray(relatedBreeds)) {
    relatedBreeds = [];
  }

  // Prevent self reference
  relatedBreeds = relatedBreeds.filter(
    (id) => id.toString() !== existingBreed._id.toString()
  );

  const oldRelated = existingBreed.relatedBreeds.map(id => id.toString());
  const newRelated = relatedBreeds.map(id => id.toString());

  // 🟥 1. Find removed breeds
  const removedBreeds = oldRelated.filter(
    id => !newRelated.includes(id)
  );

  // 🟢 2. Find newly added breeds
  const addedBreeds = newRelated.filter(
    id => !oldRelated.includes(id)
  );

  // 🔁 Remove this breed from removed ones
  if (removedBreeds.length > 0) {
    await Breed.updateMany(
      { _id: { $in: removedBreeds } },
      { $pull: { relatedBreeds: existingBreed._id } },
      { session }
    );
  }

  // 🔁 Add this breed to newly added ones
  if (addedBreeds.length > 0) {
    await Breed.updateMany(
      { _id: { $in: addedBreeds } },
      { $addToSet: { relatedBreeds: existingBreed._id } },
      { session }
    );
  }

  // ✅ Finally update current breed
  existingBreed.relatedBreeds = relatedBreeds;
  existingBreed.markModified("relatedBreeds");
}







    if (lifeExpectancyMin !== undefined || lifeExpectancyMax !== undefined) {
      const min = lifeExpectancyMin ? Number(lifeExpectancyMin) : undefined;
      const max = lifeExpectancyMax ? Number(lifeExpectancyMax) : undefined;

      if (min !== undefined && max !== undefined && min > max) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: "Min life expectancy cannot be greater than max.",
          status: false,
        });
      }

      existingbreedDetails.lifeExpectancy = {
        min: min ?? existingbreedDetails.lifeExpectancy?.min,
        max: max ?? existingbreedDetails.lifeExpectancy?.max,
      };
    }

    // ================= BASIC FIELD UPDATE =================
    existingBreed.name = req.body.name ?? existingBreed.name;
    existingBreed.size = req.body.size ?? existingBreed.size;
    existingBreed.energy = req.body.energy ?? existingBreed.energy;
    existingBreed.excerpt = req.body.excerpt ?? existingBreed.excerpt;
    existingBreed.isActive = req.body.isActive ?? existingBreed.isActive;

    existingbreedDetails.heading =
      req.body.heading ?? existingbreedDetails.heading;
    existingbreedDetails.description =
      req.body.description ?? existingbreedDetails.description;

    existingbreedDetails.about = req.body.about ?? existingbreedDetails.about;
    existingbreedDetails.nutritionNote =
      req.body.nutritionNote ?? existingbreedDetails.nutritionNote;

    // ================= FORCE FULL ARRAY REPLACEMENT =================
    if (nutritionDiet !== undefined) {
      existingbreedDetails.nutritionDiet = [];
      existingbreedDetails.nutritionDiet.push(...nutritionDiet);
      existingbreedDetails.markModified("nutritionDiet");
    }

    if (trainingExercise !== undefined) {
      existingbreedDetails.trainingExercise = [];
      existingbreedDetails.trainingExercise.push(...trainingExercise);
      existingbreedDetails.markModified("trainingExercise");
    }

    if(groomingDetails !== undefined){
      existingbreedDetails.groomingDetails=[];
      existingbreedDetails.groomingDetails.push(...groomingDetails);
      existingbreedDetails.markModified("groomingDetails");
    }

    // 🔥 Save both using session
    await existingBreed.save({ session });
    await existingbreedDetails.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Breed updated successfully.",
      status: true,
      data: {
        breed: existingBreed,
        breedDetail: existingbreedDetails,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.log("Error:", err);

    return res.status(500).json({
      message: "Unable to update breed.",
      status: false,
    });
  }
};

export const getBreeds = async (req, res) => {
  try {
    const breeds = await Breed.find({ isActive: true })
      .select("name slug")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      message: "Breeds retrieved successfully.",
      status: true,
      data: breeds,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch breeds.",
      status: false,
    });
  }
};

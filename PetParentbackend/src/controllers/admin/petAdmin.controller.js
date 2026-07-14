import mongoose from "mongoose";
import Pet from "../../models/pet/pet.model.js";
import PetProfile from "../../models/pet/pet.profile.model.js";
import Activity from "../../models/activity/activity.model.js";


// GET ALL PETS (Grouped by Owner)
export const Getallpet = async (req, res) => {
  let { page = 1, limit = 10, search = "" } = req.query;

  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const safeLimit = limit > 10 ? 10 : limit;
    const skip = (page - 1) * safeLimit;

    const matchStage = {
      ...(search && {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { species: { $regex: search, $options: "i" } },
          { ownername: { $regex: search, $options: "i" } },
          { "breed.name": { $regex: search, $options: "i" } },
        ],
      }),
    };

    const pets = await Pet.aggregate([
      { $match: matchStage },

      // ✅ Lookup Owner
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true,
        },
      },

      // ✅ Lookup Pet Profile
      {
        $lookup: {
          from: "petprofiles",
          localField: "_id",
          foreignField: "pet",
          as: "petprofile",
        },
      },
      {
        $unwind: {
          path: "$petprofile",
          preserveNullAndEmptyArrays: true,
        },
      },

      // ✅ Project Clean Flat Structure
      {
        $project: {
          _id: 1,
          slug: 1,
          name: 1,
          species: 1,
          breed: "$breed.name",
          gender: 1,
          age: 1,
          isActive: 1,
          createdAt: 1,
          ownerName: "$owner.name",
          ownerEmail: "$owner.email",
          profileImage: {
            $arrayElemAt: ["$petprofile.profileImages.url", 0],
          },
        },
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: safeLimit },
    ]);

    const totalPets = await Pet.countDocuments(matchStage);

    return res.status(200).json({
      message: "Pet records retrieved successfully.",
      status: true,
      data: pets,
      pagination: {
        totalPets,
        totalPages: Math.ceil(totalPets / safeLimit),
        currentPage: page,
        limit: safeLimit,
      },
    });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({
      message: "Unable to fetch pet records.",
      status: false,
    });
  }
};



// GET SINGLE PET
export const Singlepet = async (req, res) => {
  const slug = req.params.slug;

  try {
    const pet = await Pet.aggregate([
      {
        $match: { slug: slug }
      },
      {
        $lookup: {
          from: "petprofiles", // collection name (IMPORTANT: MongoDB collection name)
          localField: "_id",
          foreignField: "pet",
          as: "petProfile"
        }
      },
     {
        $lookup:{
          from:"users",
          localField:"owner",
          foreignField:"_id",
          pipeline: [
            {
              $project: {
                
                name: 1,
                email: 1
              }
            }
          ],
          as:"owner"
        }
       },
      {
        $unwind: {
          path: "$petProfile",
          preserveNullAndEmptyArrays: true
        }

      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          __v: 0,
          "petProfile.__v": 0,
          "petProfile.pet": 0
        }
      }
    ]);

    if (!pet.length) {
      return res.status(404).json({
        message: "Pet not found.",
        status: false
      });
    }

    return res.status(200).json({
      message: "Pet details retrieved successfully.",
      status: true,
      data: pet[0]
    });

  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({
      message: "Unable to fetch pet details.",
      status: false
    });
  }
};


export const Deletepet = async (req, res) => {
  const slug = req.params.slug;

  try {
    // 1️⃣ Find the pet first
    const pet = await Pet.findOne({ slug });

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found.",
        status: false,
      });
    }

    // 2️⃣ Delete pet profile using pet _id
    await PetProfile.deleteOne({ pet: pet._id });
    //delete petActivities as well
    const checkactivities = await Activity.find({"pet.id": pet._id});
    if(checkactivities?.length>0){
      await Activity.deleteMany({"pet.id": pet._id});
    }else{
      await Activity.deleteOne({"pet.id": pet._id});
    }
    // 3️⃣ Delete the pet
    await Pet.deleteOne({ _id: pet._id });

    return res.status(200).json({
      message: "Pet deleted successfully.",
      status: true,
    });

  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({
      message: "Unable to delete pet.",
      status: false,
    });
  }
};




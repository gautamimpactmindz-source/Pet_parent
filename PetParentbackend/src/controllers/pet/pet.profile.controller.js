import Pet from "../../models/pet/pet.model.js";
import PetProfile from "../../models/pet/pet.profile.model.js";
import mongoose from "mongoose";


// GET ALL PET PROFILES
export const getAllPetProfile = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Authentication required.",
        status: false,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const safeLimit = limit > 10 ? 10 : limit;
    const skip = (page - 1) * safeLimit;

    const { search } = req.query;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const pipeline = [
      {
        $lookup: {
          from: "Pets",
          localField: "pet",
          foreignField: "_id",
          as: "petData",
        },
      },
      { $unwind: "$petData" },
      {
        $match: {
          "petData.owner": userId,
          isActive: true,
        },
      },
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "petData.name": { $regex: search, $options: "i" } },
            { "petData.breed.name": { $regex: search, $options: "i" } },
            { color: { $regex: search, $options: "i" } },
            { activityLevel: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: safeLimit },
    );

    const profiles = await PetProfile.aggregate(pipeline);

    const totalcountPipeline = [...pipeline];
    totalcountPipeline.pop();
    totalcountPipeline.pop();
    totalcountPipeline.pop();

    const totalProfiles =
      (await PetProfile.aggregate(totalcountPipeline)).length;

    if (profiles.length === 0) {
      return res.status(404).json({
        message: "No pet profiles found.",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Pet profiles retrieved successfully.",
      status: true,
      data: profiles,
      pagination: {
        totalProfiles,
        totalPages: Math.ceil(totalProfiles / safeLimit),
        currentPage: page,
        limit: safeLimit,
        hasNextPage: page * safeLimit < totalProfiles,
        hasPrevPage: page > 1,
      },
    });

  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve pet profiles.",
      error: error.message,
      status: false,
    });
  }
};

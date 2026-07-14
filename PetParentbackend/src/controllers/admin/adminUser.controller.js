import Activity from "../../models/activity/activity.model.js";

import Pet from "../../models/pet/pet.model.js";

import User from "../../models/user/useradmin.model.js";

import mongoose from "mongoose";

export const Getalluser = async (req, res) => {
  let { page = 1, limit = 10, search = "" } = req.query;

  try {
    page = parseInt(page);
    limit = parseInt(limit);

    const safeLimit = limit > 10 ? 10 : limit;
    const skip = (page - 1) * safeLimit;

    const filter = { role: "user" };

    if (search && search.trim() !== "") {
      const normalizedSearch = search.replace(/\s+/g, "");

      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        {
          name: {
            $regex: normalizedSearch.split("").join("\\s*"),
            $options: "i",
          },
        },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select(
        "-password -refreshToken -resetPasswordExpiry -resetPasswordToken -termsAccepted -createdAt -updatedAt -role",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit);

    const totalUsers = await User.countDocuments(filter);

    return res.status(200).json({
      message: "Users retrieved successfully.",
      status: true,
      data: users,
      pagination: {
        totalUsers,
        totalPages: Math.ceil(totalUsers / safeLimit),
        currentPage: page,
        limit: safeLimit,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to fetch users.",
      status: false,
    });
  }
};

// BLOCK / UNBLOCK SINGLE USER
export const updateUserStatus = async (req, res) => {
  const slug = req.params.slug;
  const { status } = req.body || {};

  try {
    const user = await User.findOne({ slug });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        status: false,
      });
    }

    user.isActive = status;

    if (!status) {
      user.refreshToken = null;
    }

    await user.save();

    return res.status(200).json({
      message: status
        ? "User account activated successfully."
        : "User account deactivated successfully.",
      status: true,
    });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({
      message: "Unable to update user status.",
      status: false,
    });
  }
};

// DELETE USER
export const Deleteuser = async (req, res) => {
  const { slug } = req.params;

  try {
    const user = await User.findOne({ slug });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    const pets = await Pet.find({ owner: user._id });
    const petIds = pets.map((p) => p._id);

    await Promise.all([
      Activity.deleteMany({ pet: { $in: petIds } }),
      Pet.deleteMany({ owner: user._id }),
      User.deleteOne({ _id: user._id }),
    ]);

    return res.status(200).json({
      status: true,
      message: "User deleted successfully.",
    });
  } catch (err) {
    console.error("Delete Error:", err);

    return res.status(500).json({
      status: false,
      message: "Deletion failed.",
    });
  }
};



export const Singleuser = async(req,res) => {
  const { slug } = req.params
  try{
    const user = await User.findOne({slug}).select("-password")

    if(!user){
      return res.status(404).json({message:"user not found !",status : false})
    }

    return res.status(200).json({message:"user fetched successfully",status : true , data : user})

  }catch(err){
    console.log("err :",err)
    return res.status(500).json({message : err.message , status : false})
  }
}
import Activity from "../../models/activity/activity.model.js";
import Pet from "../../models/pet/pet.model.js";
import { Otp } from "../../models/user/otp.model.js";
import User from "../../models/user/useradmin.model.js";
import sendEmail from '../../config/sendEmail.js'
import { LoginOtpEmailHtml } from '../../utils/EmailTemplate/otpemail.js'
import PetProfile from "../../models/pet/pet.profile.model.js";

const calculateAge = (dob) => {
  if (!dob) return "N/A";

  const birthDate = new Date(dob);
  const today = new Date();

  if (birthDate > today) return "Invalid DOB";

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  // adjust for days
  if (today.getDate() < birthDate.getDate()) {
    months--;
  }

  // 🐶 better pet-friendly format
  if (years === 0) {
    return `${months} month${months !== 1 ? "s" : ""}`;
  }

  return `${years} year${years !== 1 ? "s" : ""}`;
};
export const getUserInfo = async (req, res) => {
  const { email } = req.body;

  try {
    const checkexisting = await User.findOne({ email: email });
    if (checkexisting) {
      return res.status(200).json({ exists: true, userId: checkexisting?._id });
    } else {
      console.log("not found");
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      messages: [{ text: "Server error." }],
    });
  }
};

export const getpetinfo = async (req, res) => {
  const { email } = req.body;

  try {
    const userdata = await User.findOne({ email: email });
    if (userdata) {
      const petdata = await Pet.find({ owner: userdata._id });
      if (petdata) {
        const petname = petdata.map((pet) => pet.name);
        return res.status(200).json({ exists: true, petdata: petname });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const getpetdetails = async (req, res) => {
  const { email, pet_name } = req.body;

  try {
    const userexisting = await User.findOne({ email: email });
    const query = {
      name: { $regex: `^${pet_name}$`, $options: "i" },
      owner: userexisting._id,
    };
    if (userexisting) {
      const petexisting = await Pet.findOne(query);
      if (petexisting) {
        const petdetails = await PetProfile.findOne({ pet: petexisting._id });

        const message = `Here are the details of your pet:

Name: ${petexisting?.name || "N/A"}
Species: ${petexisting?.species || "N/A"}
Breed: ${petexisting?.breed?.name || "N/A"}
Weight: ${petdetails?.weight || "N/A"} kg
Age: ${calculateAge(petexisting?.dob) || "N/A"} 
Gender:${petexisting?.gender}
Health Concerns: ${petdetails?.healthConcerns?.conditions?.length > 0
            ? petdetails.healthConcerns.conditions.join(", ")
            : "None reported"
          }
Description: ${petdetails?.healthConcerns?.description || "No description provided"}
`;

        return res.status(200).json({ status: true, pet_details: message });
      } else {
        return res.status(200).json({ status: false });
      }
    } else {
      return res.status(200).json({ status: false });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getpetactivity = async (req, res) => {
  const { email, pet_name } = req.body;

  try {
    // Check if user exists
    const userexisting = await User.findOne({ email });

    if (!userexisting) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    // Find pet
    const query = {
      name: { $regex: `^${pet_name}$`, $options: "i" },
      owner: userexisting._id,
    };

    const petexisting = await Pet.findOne(query);

    if (!petexisting) {
      return res.status(404).json({
        message: "Pet not found",
        status: false,
      });
    }

    // Date filter (last 2 days)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Find activities
    const activities = await Activity.find({
      "pet.id": petexisting._id,
    })
      .sort({ activityDate: -1 })
      .limit(5);
    // const activityText = activities
    //   .map((a, i) => `${i + 1}. ${a.description}`)
    //   .join("\n");
    const activityText = activities
      .map((a, i) => {
        const date = new Date(a.activityDate).toLocaleDateString();
        const time = new Date(a.activityDate).toLocaleTimeString();
        return `${i + 1}. ${a.description} on ${date} at ${time}`;
      })
      .join("\n");
    return res.status(200).json({
      message: "Successfully fetched activity",
      status: true,
      activity: activityText,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
      status: false,
    });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    //userexisting
    const userexisting = await User.findOne({ email: email });
    if (userexisting) {
      const otp = Math.floor(1000 + Math.random() * 9000);
      await Otp.deleteMany({ userId: userexisting._id });
      const saveotp = await Otp.create({
        userId: userexisting._id,
        otp: otp,
      });
      if (saveotp) {
        //send otp to email
        sendEmail({
          to: userexisting?.email,
          subject: "OTP Verification",
          html: LoginOtpEmailHtml(userexisting.name, otp),
        });
        return res.status(200).json({
          status: true,
          message: "OTP sent to email",
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};


export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        status: false,
        message: "Email and OTP are required."
      });
    }

    // Check if user exists
    const userExisting = await User.findOne({ email });
    if (!userExisting) {
      return res.status(404).json({
        status: false,
        message: "No account found with this email."
      });
    }

    // Find OTP record
    const otpRecord = await Otp.findOne({
      otp,
      userId: userExisting._id
    });

    if (!otpRecord) {
      return res.status(400).json({
        status: false,
        message: "Invalid OTP. Please try again."
      });
    }

    // Check if OTP is expired (5 minutes)
    const now = new Date();

    const otpAge = (now - new Date(otpRecord.createdAt)) / 1000 / 60;
    if (otpAge > 5) {
      await Otp.deleteOne({ _id: otpRecord._id }); // cleanup
      return res.status(400).json({
        status: false,
        message: "OTP has expired. Please request a new one."
      });
    }

    // Mark user as verified

    // Delete OTP after successful use (one-time use)
    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      status: true,
      message: "Email verified successfully.",
      userId: userExisting._id
    });

  } catch (err) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({
      status: false,
      message: "Something went wrong. Please try again."
    });
  }
};
// https://teeth-values-hughes-london.trycloudflare.com
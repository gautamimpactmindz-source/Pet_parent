import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import PetModel from "../../models/pet/pet.model.js";
import User from "../../models/user/useradmin.model.js";
import Pet from "../../models/pet/pet.model.js";
import Breed from "../../models/breed/breed.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokengenerator/token.js";
import { handleForgotPassword } from "../../utils/forgotPassword/forgot.js";

// ADMIN SIGNUP
export const Adminsign = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        status: false,
      });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({
        message: "An account with this email already exists.",
        status: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      email,
      password: hashedPassword,
      role: "admin",
    });

    return res.status(201).json({
      message: "Administrator account created successfully.",
      status: true,
      data: admin,
    });
  } catch (error) {
    console.log("Admin Signup Error:", error);
    return res.status(500).json({
      message: "Unable to create administrator account.",
      status: false,
    });
  }
};

// ADMIN LOGIN
export const Adminlogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        status: false,
      });
    }

    const Admin = await User.findOne({ email }).select("+password");

    if (!Admin) {
      return res.status(401).json({
        message: "Invalid email or password.",
        status: false,
      });
    }

    const ismatch = await bcrypt.compare(password, Admin.password);

    if (!ismatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
        status: false,
      });
    }

    if (!Admin.role === "Admin") {
      return res.status(403).json({
        message: "Access denied. Administrator privileges required.",
        status: false,
      });
    }

    const accessToken = generateAccessToken(Admin);
    const refreshToken = generateRefreshToken(Admin);

    Admin.refreshToken = refreshToken;
    await Admin.save();
    res.cookie("adminaccessToken", accessToken, {
    httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".impactmindz.com",
      path: "/",
      maxAge: 60 * 60 * 60 * 1000,
    });
    res.cookie("adminrefreshToken", refreshToken, {
     httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".impactmindz.com",
      path: "/",
      maxAge: 60 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Administrator login successful.",
      status: true,
      accessToken,
      role: Admin.role,
    });
  } catch (err) {
    console.log("Admin Login Error:", err);
    return res.status(500).json({
      message: "Login failed. Please try again later.",
      status: false,
    });
  }
};

// REFRESH ACCESS TOKEN
export const refreshaccessToken = async (req, res) => {
  const refreshToken = req.cookies.adminrefreshToken;

  try {
    if (!refreshToken) {
      return res.status(403).json({
        message: "Authentication required. Please log in again.",
        status: false,
      });
    }

    const decode = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const Admin = await User.findById(decode.id);

    if (!Admin || Admin.refreshToken !== refreshToken) {
      return res.status(403).json({
        message: "Session is invalid or has expired.",
        status: false,
      });
    }

    const newAccessToken = generateAccessToken(Admin);
//update
    res.cookie("adminaccessToken", newAccessToken, {
    httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".impactmindz.com",
      path: "/",
      maxAge: 5 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Access token refreshed successfully.",
      token: newAccessToken,
      status: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Unable to refresh access token.",
      status: false,
    });
  }
};

// ADMIN LOGOUT
export const Adminlogout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (refreshToken) {
      const Admin = await User.findOne({ refreshToken });
      if (Admin) {
        Admin.refreshToken = null;
        await Admin.save();
      }
    }
    res.clearCookie("adminaccessToken", {
    httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".impactmindz.com",
      path: "/",
    });
    res.clearCookie("adminrefreshToken", {
   httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".impactmindz.com",
      path: "/",
    });

    return res.json({
      message: "Administrator logged out successfully.",
      status: true,
    });
  } catch (err) {
    console.log("Logout error:", err);
    return res.status(500).json({
      message: "Unable to process logout request.",
      status: false,
    });
  }
};

// ADMIN UPDATE PASSWORD
export const adminUpdate = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required.",
        status: false,
      });
    }

    const Admin = await User.findById(userId).select("+password");

    if (!Admin) {
      return res.status(401).json({
        message: "Invalid credentials.",
        status: false,
      });
    }

    const ismatch = await bcrypt.compare(currentPassword, Admin.password);

    if (!ismatch) {
      return res.status(401).json({
        message: "Current password is incorrect.",
        status: false,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    Admin.password = hashedPassword;
    Admin.refreshToken = null;

    await Admin.save();

    return res.status(200).json({
      message: "Password updated successfully",
      status: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to update password.",
      status: false,
    });
  }
};

// DASHBOARD STATS
export const Getdashbord = async (req, res) => {
  try {
    const totaluser = await User.countDocuments({ role: "user" });
    const totalPets = await Pet.countDocuments();
    const totalbreed = await Breed.countDocuments();

    return res.status(200).json({
      message: "Dashboard statistics retrieved successfully.",
      status: true,
      data: {
        totalUsers: totaluser,
        totalPets: totalPets,
        totalBreeds:totalbreed
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to fetch dashboard statistics.",
      status: false,
    });
  }
};

export const adminforgotpassword = async (req, res) => {

  const { email } = req.body;
 

  try {
    if (!email) {
      return res.status(400).json({
        message: "Email address is required.",
        status: false
      });
    }

    const result = await handleForgotPassword(email);
   
   if(result && result.status){
     return res.status(200).json({
      message: "A password reset link has been sent to the email",
      status: true
    });
   }
    
   else{
    return res.status(404).json({
      message: "No administrator account found with that email.",
      status: false
    })
   }

  } catch (error) {
    return res.status(500).json({
      message: "We were unable to process your password reset request at this time. Please try again later.",
      status: false
    });
  }
};


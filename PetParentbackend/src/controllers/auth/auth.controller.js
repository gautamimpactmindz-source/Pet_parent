import User from "../../models/user/useradmin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken } from "../../utils/tokengenerator/token.js";
import { handleForgotPassword, handleForgotPassworduser} from "../../utils/forgotPassword/forgot.js";
import { Otp } from "../../models/user/otp.model.js";
import sendEmail from "../../config/sendEmail.js";
import { OtpEmailHtml } from "../../utils/EmailTemplate/otpemail.js";

// SIGNUP
export const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All required fields must be provided.",
        status: false,
      });
    }

    let existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({
        message: "An account with this email already exists.",
        status: false,
      });
    }

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);

      existingUser = new User({
        name,
        email,
        password: hashedPassword,
        isVerified: false,
      });

      await existingUser.save();
    }

  
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

   
    
   const generate = await Otp.create({
      userId: existingUser._id,
      otp: generatedOtp,
  
    
    });

    res.cookie("tempUserId", existingUser._id, {
     httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".impactmindz.com",
      path: "/",
      maxAge: 6 * 60 * 1000
    });

    sendEmail({
      to: existingUser.email,
      subject: "OTP Verification",
      html: OtpEmailHtml(existingUser.name, generatedOtp),
    });

    return res.status(200).json({
      message: "OTP sent to your email for verification",
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.message,
      status: false,
    });
  }
};

export const resendOtp = async (req, res) => {
  const{email} = req.body;
  try {

  

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        message: "User does not exist",
        status: false,
      });
    }

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const existingOtp = await Otp.findOne({ userId:existingUser?._id });

    if (existingOtp) {
      existingOtp.otp = generatedOtp;
      existingOtp.createdAt = new Date(); // Reset TTL
      await existingOtp.save();
    } else {
      await Otp.create({
        userId: existingUser._id,
        otp: generatedOtp,
      });
    }

    res.cookie("tempUserId", existingUser._id, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".impactmindz.com",
      path: "/",
      maxAge: 6 * 60 * 1000, // 6 minutes
    });

    sendEmail({
      to: existingUser.email,
      subject: "OTP Verification",
      html: OtpEmailHtml(existingUser.name, generatedOtp),
    });

    return res.status(200).json({
      message: "OTP Send  successfully Please check your email",
      status: true,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Unable to resend OTP. Please try again later.",
      error: err.message,
      status: false,
    });
  }
};

//verifying otp after signup
export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
  

    if (!otp) {
      return res.status(400).json({
        message: "OTP is required",
        status: false,
      });
    }

    const userId = req.cookies.tempUserId;

    if (!userId) {
      return res.status(400).json({
        message: "Verification session expired.Please sign up again",
        status: false,
      });
    }

    const otpRecord = await Otp.findOne({ userId });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP expired",
        status: false,
      });
    }

    if (Date.now() > otpRecord.expiresAt) {
      return res.status(400).json({
        message: "OTP has expired",
        status: false,
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        status: false,
      });
    }

    const user = await User.findById(userId);
    user.isVerified = true;
    await user.save();

    await Otp.deleteOne({ userId });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
   httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".impactmindz.com",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
  httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".impactmindz.com",
      path: "/",
      maxAge: 5 * 60 * 1000,
    });

    // res.clearCookie("tempUserId");
    
    return res.status(200).json({
      message: "Account verified successfully.",
      data: {
        name: user.name,
        isActive: user.isActive,
        role: user.role,
      },
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.message,
      status: false,
    });
  }
};

//google auth LOGIN
export const googleAuth = async (req, res) => {
  const { email, name } = req.body;

  try {
    let user = await User.findOne({ email });
    let isNewUser = false;  

    // If not exists → create
    if (!user) {
      user = await User.create({
        name,
        email,
        isVerified: true,
      });
       isNewUser = true; // 👈 Important flag
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account has been disabled. Please contact support.",
        status: false,

      });
    }
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    user.isVerified =true;
    await user.save();

    // Set cookies
    res.cookie("accessToken", accessToken, {
    httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".impactmindz.com",
      path: "/",
      maxAge: 5 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
 httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".impactmindz.com",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Google authentication successful",
      status: true,
      data: {
        isActive: user.isActive,
        role: user?.role,
        user: user?.name,
        isNewUser
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Please try again later",
      status: false,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        status: false,
      });
    }

    const user = await User.findOne({ email }).select("+password");
   
    if(!user.isVerified){
      return res.status(403).json({
  message:"Please verify your email before logging in",
  code: "EMAIL_NOT_VERIFIED",
  status: false
});
    }
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
        status: false,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
        status: false,
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account has been disabled. Please contact support.",
        status: false,

      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
  httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".impactmindz.com",
      path: "/",

      maxAge: 60 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".impactmindz.com",
      path: "/",

      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login Successful",
      data: {
        accessToken: accessToken,
        isActive: user.isActive,
        name: user.name,
        role: user.role,
      },
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed. Please try again later.",
      error: error.message,
      status: false,
    });
  }
};

// REFRESH TOKEN
export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({
      message: "Authentication required. Please log in again.",
      status: false,
    });
  }

  try {
    const decode = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decode.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        message: "Session is invalid or expired. Please log in again.",
        status: false,
      });
    }

    const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".impactmindz.com",
      maxAge: 5 * 60 * 1000,
    });
    return res.json({
      message: "Access token refreshed successfully.",
      token: newAccessToken,
      status: true,
    });
  } catch (error) {
    return res.status(403).json({
      message: "Session has expired. Please log in again.",
      status: false,
    });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("refreshToken", {
    httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".impactmindz.com",
      path: "/",
    });
    res.clearCookie("accessToken", {
  httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".impactmindz.com",
      path: "/",
    });

    return res.json({
      message: "You have been logged out successfully.",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to process logout request.",
      status: false,
    });
  }
};

// FORGOT PASSWORD
export const userforgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email address is required.",
        success: false
      });
    }

    const result =  await handleForgotPassworduser(email);

    if(result.status){
      return res.status(200).json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
      status: true
    });
    }
    else{
      return res.status(404).json({
      message: result.message,
      status: false
    })
  }
  } catch (error) {
    return res.status(500).json({
      message:
        "We were unable to process your password reset request at this time. Please try again later.",
      success: false
    });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Reset token is required.",
        status: false,
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "New password is required.",
        status: false,
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid or expired reset token.",
        status: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password has been reset successfully. Please log in again.",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to reset password.",
      error: error.message,
      status: false,
    });
  }
};

// UPDATE PASSWORD
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword ,confirmPassword} = req.body;

    if (!currentPassword || !newPassword ||!confirmPassword) {
      return res.status(400).json({
        message: "All Fields are required !!",
        status: false,
      });
    }

    if(newPassword!==confirmPassword){
      return res.status(400).json({
        message:"New Password and confirm password do not match!!",
        status:false
      })
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User account not found.",
        status: false,
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect.",
        status: false,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.refreshToken = null;

    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update password.",
      error: error.message,
      status: false,
    });
  }
};


export const Myprofile = async(req,res) =>{
        try{
          const user = await User.findById(req.user.id).select("-password")
          
          if(!user){
            return res.status(404).json({message :"user not found !", status:false})
          }

          return res.status(200).json({message:"Profile fetched successfully",status : true , data : user})
          
        }catch(err){
          console.log("err :" , err)
          return res.status(500).json({message: err.message , status : false})
        }
}


export const UpdateProfile=async(req,res)=>{
  try {
    const userId=req.user.id;
    const {name}=req.body;
    if(!name){
      return res.status(400).json({
        message:"Name is required",
        status:false
      })
    }

    const user=await User.findByIdAndUpdate(userId,{name},{new:true}).select("name email");

    return res.status(200).json({
      message:"Profile updated successfully!!",
      status:true,
      data:user
    })
    } catch (error) {
    return res.status(500).json({message:error.message,status:false})
  }
}

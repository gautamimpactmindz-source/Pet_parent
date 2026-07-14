import crypto from "crypto";
import { Emailhtml } from "../EmailTemplate/emailhtml.js";
import sendEmail from "../../config/sendEmail.js";
import User from "../../models/user/useradmin.model.js";

export const handleForgotPassword = async (email) => {
 

  if (!email) {
    throw new Error("Email address is required.");
  }

  const user = await User.findOne({ email });


  if (!user) {
    return {
      status: true,
      message: "Email not found"
    };
  }

  if(user.role !== "admin"){
    return {
      status: false,
      message: "No administrator account found with that email."
    }
  }

  
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/admin/reset-password?token=${resetToken}`;
  const emailHTML = Emailhtml(user.name, resetUrl);

  sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html: emailHTML
  }).catch(err => console.error(err));

  return {
    status: true,
    message: "If the email exists, a password reset link has been sent."
  };
};
export const handleForgotPassworduser = async (email) => {
 

  if (!email) {
    throw new Error("Email address is required.");
  }

  const user = await User.findOne({ email });


  if (!user) {
    return {
      status: false,
      message: "Email not found"
    };
  }

 

  
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  const emailHTML = Emailhtml(user.name, resetUrl);

  sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html: emailHTML
  }).catch(err => console.error(err));

  return {
    status: true,
    message: "If the email exists, a password reset link has been sent."
  };
};
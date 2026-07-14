import jwt from "jsonwebtoken";

export const generateAccessToken = user =>
  jwt.sign(
    { id: user._id.toString(), role: user.role,name:user.name },
    process.env.ACCESS_SECRET,
    { expiresIn: "30d" }
  );

export const generateRefreshToken = user =>
  jwt.sign(
    { id: user._id.toString() },
    process.env.REFRESH_SECRET,
    { expiresIn: "30d" }
  );


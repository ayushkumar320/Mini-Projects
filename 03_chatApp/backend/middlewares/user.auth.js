import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;

export async function userAuth(req, res, next) {
  const bearerToken = req.headers.authorization;
  if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided!" });
  }
  const token = bearerToken.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({ msg: "User not found!" });
    }
    req.user = user; 
    next();
  } catch (err) {
    return res.status(401).json({
      msg: "Error authenticating the user!",
    });
  }
}
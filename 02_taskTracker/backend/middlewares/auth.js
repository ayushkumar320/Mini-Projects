import jwt from "jsonwebtoken";
import {User} from "../db/connectDB.js";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.JWT_SECRET;
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if(!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const user = await User.findById(decoded._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export default authMiddleware;
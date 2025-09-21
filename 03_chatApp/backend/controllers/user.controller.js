import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {userAuth} from "../middlewares/user.auth";
import bcrypt from "bcryptjs";
dotenv.config();

const secret = process.env.JWT_SECRET;

export async function registerUser(req, res) {
  const {username, email, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await User.findOne({email});
  if (existingUser) {
    return res.status(400).json({msg: "User already exists!"});
  } else {
    const newUser = new User({username, email, password: hashedPassword});
    await newUser.save();
    return res.status(201).json({msg: "User registered successfully!"});
  }
}

export async function loginUser(req, res) {
  const {username, password} = req.body;
  const user = await User.findOne({username});
  if (!user) {
    return res.status(400).json({msg: "User not found!"});
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({msg: "Invalid password!"});
  }
  const token = jwt.sign({email: user.email}, secret);
  return res.status(200).json({
    token: token,
    msg: "Login successful!"
  });
}

export async function getUserProfile(req, res) {
  const user = req.user;
  if (!user) {
    return res.status(400).json({msg: "User not found!"});
  }
  return res.status(200).json({
    email: user.email,
    username: user.username
  });
}

export async function updateUserProfile(req, res) {
  const user = req.user;
  const {username, password} = req.body;
  if (!user) {
    return res.status(400).json({msg: "User not found!"});
  }
  if (username) {
    user.username = username;
  }
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }
  await user.save();
  return res.status(200).json({msg: "User profile updated successfully!"});
}

export async function sendChatMessage(req, res) {
  const user = req.user;
  const {message} = req.body;
  if (!user) {
    return res.status(400).json({msg: "User not found!"});
  }
  if (!message) {
    return res.status(400).json({msg: "Message cannot be empty!"});
  }
  
}

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {User, Task} from "../db/connectDB.js";
import userMiddleware from "../middlewares/auth.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export async function registerUser(req, res) {
  const {name, email, password} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const existingUser = await User.findOne({email: email});
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists!",
        email: existingUser.email,
      });
    } else {
      await newUser.save();
      return res.json({
        message: "User registered successfully!",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function loginUser(req, res) {
  const {email, password} = req.body;
  try {
    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }
      const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
      return res.json({
        message: "Login successful",
        token: token,
      });
    }
  } catch (err) {
    console.error("Error logging in user:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function addTask(req, res) {
  const {title, description} = req.body;
  try {
    const newTask = new Task({
      title: title,
      description: description,
      user: req.user._id, // Associate task with authenticated user
    });
    await newTask.save();
    return res.json({
      message: "Task added successfully!",
      task: newTask,
    });
  } catch (error) {
    console.error("Error adding task:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function maskAsComplete(req, res) {
  const taskId = req.params.id;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    task.completed = true;
    await task.save();
    return res.json({
      message: "Task marked as complete",
      task: task,
    });
  } catch (error) {
    console.error("Error marking task as complete:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function editTask(req, res) {
  const taskId = req.params.id;
  const {title, description} = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        title: title,
        description: description,
      },
      {new: true}
    );
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    // Verify task belongs to the authenticated user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to edit this task",
      });
    }
    return res.json({
      message: "Task updated successfully",
      task: task,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function deleteTask(req, res) {
  const taskId = req.params.id;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    // Verify task belongs to the authenticated user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this task",
      });
    }
    await Task.findByIdAndDelete(taskId);
    return res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getTasks(req, res) {
  try {
    const tasks = await Task.find({user: req.user._id});
    return res.json({
      message: "Tasks fetched successfully",
      tasks: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../helper/generateToken.js";
import { comparePassword,hashPassword } from "../helper/hashPassword.js";

// =============================
// Register User
// =============================

export const register = async (req, res) => {
  try {

    let { name, email, password,avatar } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar
    });

    // Generate JWT
    const token = generateToken(user._id);

    // Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};



// =============================
// Login User
// =============================

export const login = async (req, res) => {
  try {

    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });
    }

    email = email.trim().toLowerCase();

    // Find User
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist.",
      });
    }

    // Compare Password
    const isPasswordCorrect =  comparePassword(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials.",
      });
    }

    // Generate Token
    const token = generateToken(user._id);

    // Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};



// =============================
// Logout User
// =============================

export const logout = async (req, res) => {

  try {

    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Logout Successful",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};



// =============================
// Get Current Logged In User
// =============================

export const getMe = async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });

    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../helper/generateToken.js";
import { comparePassword, hashPassword } from "../helper/hashPassword.js";
import { sendMail } from "../utils/sendMail.js";
import otpTemplate from "../utils/otpTemplete.js";


// Register User


export const register = async (req, res) => {
  try {
    let { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const hashedPassword = await hashPassword(password);

    await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
      isVerified: false,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

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

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist.",
      });
    }

    if (user.googleId) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google Sign-In. Please login with Google.",
      });
    }

    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials.",
      });
    }

    

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.loginOTP = otp;
    user.loginOTPExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendMail(
      user.email,
      "Login Verification OTP",
      otpTemplate(otp)
    );

    return res.status(200).json({
      success: true,
      requires2FA: true,
      message: "OTP sent successfully.",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.loginOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired. Please login again.",
      });
    }

    if (user.loginOTPExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please login again.",
      });
    }

    if (user.loginOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

  
    user.loginOTP = undefined;
    user.loginOTPExpire = undefined;
    await user.save();

    
    const token = generateToken(user._id);

   
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
        isVerified: user.isVerified,
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

export const sendVerificationOTP = async (req, res) => {
  try {
    const email = (req.body.email || req.user?.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationOTP = otp;
    user.emailVerificationOTPExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendMail(
      user.email,
      "Email Verification OTP",
      otpTemplate(otp)
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = (req.body.email || req.user?.email || "").trim().toLowerCase();

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified.",
      });
    }

    if (!user.emailVerificationOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired. Please try again.",
      });
    }

    if (user.emailVerificationOTPExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    user.isVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpire = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
        isVerified: user.isVerified,
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
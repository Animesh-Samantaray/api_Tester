import mongoose from "mongoose";
import User from "../models/User.model.js";
import History from "../models/History.model.js";
import Collection from "../models/Collection.model.js";
import SavedRequest from "../models/SavedRequest.model.js";
import { comparePassword, hashPassword } from "../helper/hashPassword.js";



export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
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
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const updateProfile = async (req, res) => {
  try {
    const { name, profileImage, avatar } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (profileImage !== undefined) updateData.avatar = profileImage;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both old and new passwords are required.",
      });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

  
    if (user.password) {
      const isMatch = await comparePassword(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Incorrect current password.",
        });
      }
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

  
    const totalRequests = await History.countDocuments({ user: userId });
    const successCount = await History.countDocuments({
      user: userId,
      status: { $gte: 200, $lt: 400 },
    });
    const failCount = totalRequests - successCount;

    const historyItems = await History.find({ user: userId }, "method");
    const methodDistribution = { GET: 0, POST: 0, PUT: 0, DELETE: 0, PATCH: 0 };
    historyItems.forEach((item) => {
      const m = item.method.toUpperCase();
      if (methodDistribution[m] !== undefined) {
        methodDistribution[m]++;
      } else {
        methodDistribution[m] = 1;
      }
    });

    
    const collectionsCount = await Collection.countDocuments({ user: userId });

    
    const userCollections = await Collection.find({ user: userId }, "_id");
    const collectionIds = userCollections.map((c) => c._id);
    const savedRequestsCount = await SavedRequest.countDocuments({
      collectionId: { $in: collectionIds },
    });

   
    const avgResponseTimeResult = await History.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), responseTime: { $exists: true } } },
      { $group: { _id: null, avgTime: { $avg: "$responseTime" } } }
    ]);
    const averageResponseTime = avgResponseTimeResult.length > 0 ? Math.round(avgResponseTimeResult[0].avgTime) : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalRequests,
        successCount,
        failCount,
        methodDistribution,
        collectionsCount,
        savedRequestsCount,
        averageResponseTime,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file.",
      });
    }

    const host = req.get("host");
    const protocol = req.protocol;
    const avatarUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully.",
      avatarUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

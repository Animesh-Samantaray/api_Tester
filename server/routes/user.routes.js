import express from "express";
import multer from "multer";
import path from "path";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  changePassword,
  getStats,
  uploadAvatar,
} from "../controllers/user.controller.js";

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "avatar-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (validTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format. Only PNG, JPG, JPEG, and WEBP are allowed."));
    }
  },
});

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.get("/stats", authMiddleware, getStats);

router.post(
  "/upload-avatar",
  authMiddleware,
  (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  uploadAvatar
);

export default router;

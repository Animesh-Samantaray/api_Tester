import express from "express";
import passport from "../configs/passport.js";
import {
  register,
  login,
  logout,
  getMe,
  verifyLoginOTP,
  sendVerificationOTP,
  verifyEmail,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import generateToken from "../helper/generateToken.js";
import { sendMail } from "../utils/sendMail.js";
import otpTemplate from "../utils/otpTemplete.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-login-otp", verifyLoginOTP);
router.post("/send-verification-otp", sendVerificationOTP);
router.post("/verify-email", verifyEmail);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMe);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login`,
    session: false,
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(
          `${process.env.CLIENT_URL || "http://localhost:5173"}/login`
        );
      }

      if (req.user.is2FAEnabled) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        req.user.loginOTP = otp;
        req.user.loginOTPExpire = Date.now() + 10 * 60 * 1000;
        await req.user.save();

        await sendMail(
          req.user.email,
          "Login Verification OTP",
          otpTemplate(otp)
        );

        return res.redirect(
          `${process.env.CLIENT_URL || "http://localhost:5173"}/otp-verification?email=${req.user.email}&type=login`
        );
      }

      const token = generateToken(req.user._id);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
      });

      return res.redirect(
        `${process.env.CLIENT_URL || "http://localhost:5173"}`
      );
    } catch (error) {
      console.error("Google OAuth Error:", error);

      return res.redirect(
        `${process.env.CLIENT_URL || "http://localhost:5173"}/login`
      );
    }
  }
);

export default router;
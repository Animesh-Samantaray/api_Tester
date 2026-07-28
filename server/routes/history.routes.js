import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";

import {
  getHistory,
  deleteHistory,
  clearHistory,
} from "../controllers/history.controller.js";

const router = express.Router();

// Get all request history of logged-in user
router.get("/", authMiddleware, getHistory);

// Delete a single history item
router.delete("/:id", authMiddleware, deleteHistory);

// Delete all history of logged-in user
router.delete("/", authMiddleware, clearHistory);

export default router;
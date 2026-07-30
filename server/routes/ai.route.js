import express from "express";
import { askToAI } from "../controllers/ai.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();


router.post("/chat",authMiddleware ,  askToAI);

export default router;
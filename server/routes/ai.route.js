import express from "express";
import { askToAI } from "../controllers/ai.controller.js";

const router = express.Router();


router.post("/chat", askToAI);

export default router;
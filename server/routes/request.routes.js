import express from "express";

import { sendRequest } from "../controllers/request.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

import validateJson from "../utils/jsonValidator.js";

const router = express.Router();

router.post(
  "/send",
  authMiddleware,
  validateJson,
  sendRequest
);

export default router;
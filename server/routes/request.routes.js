import express from "express";

import { sendRequest } from "../controllers/request.controller.js";
import {
  getSavedRequest,
  updateSavedRequest,
  deleteSavedRequest,
} from "../controllers/collection.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

import validateJson from "../utils/jsonValidator.js";

const router = express.Router();

router.post(
  "/send",
  authMiddleware,
  validateJson,
  sendRequest
);

router.get("/:requestId", authMiddleware, getSavedRequest);
router.put("/:requestId", authMiddleware, updateSavedRequest);
router.delete("/:requestId", authMiddleware, deleteSavedRequest);

export default router;
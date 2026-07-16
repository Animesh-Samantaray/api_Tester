import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  saveRequestInsideCollection,
  getAllSavedRequests,
} from "../controllers/collection.controller.js";

const router = express.Router();

// Collections
router.post("/", authMiddleware, createCollection);
router.get("/", authMiddleware, getCollections);
router.get("/:collectionId", authMiddleware, getCollectionById);
router.put("/:collectionId", authMiddleware, updateCollection);
router.delete("/:collectionId", authMiddleware, deleteCollection);

// Nested Requests inside collections
router.post("/:collectionId/request", authMiddleware, saveRequestInsideCollection);
router.get("/:collectionId/request", authMiddleware, getAllSavedRequests);

export default router;

import Collection from "../models/Collection.model.js";
import SavedRequest from "../models/SavedRequest.model.js";

// ==========================================
// Collections
// ==========================================

/**
 * Create a new collection folder
 * POST /api/collections
 */
export const createCollection = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Collection name is required.",
      });
    }

    const collection = await Collection.create({
      name: name.trim(),
      description: description?.trim() || "",
      user: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Collection created successfully",
      data: collection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all collections with their saved requests for the logged-in user
 * GET /api/collections
 */
export const getCollections = async (req, res) => {
  try {
    // Find all collections created by the logged-in user
    const collections = await Collection.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();

    // Loop through each collection and fetch its saved requests
    for (const collection of collections) {
      collection.requests = await SavedRequest.find({ collectionId: collection._id }).sort({ createdAt: 1 });
    }

    return res.status(200).json({
      success: true,
      data: collections,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get a single collection by ID and populate its saved requests
 * GET /api/collections/:collectionId
 */
export const getCollectionById = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const collection = await Collection.findOne({ _id: collectionId, user: req.user.id }).lean();
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });
    }

    // Fetch requests belonging to this collection
    collection.requests = await SavedRequest.find({ collectionId: collection._id }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update collection details (name or description)
 * PUT /api/collections/:collectionId
 */
export const updateCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { name, description } = req.body;

    const collection = await Collection.findOne({ _id: collectionId, user: req.user.id });
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });
    }

    if (name !== undefined) collection.name = name.trim();
    if (description !== undefined) collection.description = description.trim();
    await collection.save();

    return res.status(200).json({
      success: true,
      message: "Collection updated successfully.",
      data: collection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete a collection folder and all its saved requests
 * DELETE /api/collections/:collectionId
 */
export const deleteCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;

    const collection = await Collection.findOneAndDelete({ _id: collectionId, user: req.user.id });
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });
    }

    // Delete all saved requests associated with this collection
    await SavedRequest.deleteMany({ collectionId });

    return res.status(200).json({
      success: true,
      message: "Collection and all saved requests deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Saved Requests
// ==========================================

/**
 * Save a new request inside a collection
 * POST /api/collections/:collectionId/request
 */
export const saveRequestInsideCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { name, method, url, headers, params, bodyType, body } = req.body;

    // Verify collection exists and belongs to the user
    const collection = await Collection.findOne({ _id: collectionId, user: req.user.id });
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });
    }

    if (!name || !method || !url) {
      return res.status(400).json({
        success: false,
        message: "Name, method, and URL are required.",
      });
    }

    const savedRequest = await SavedRequest.create({
      collectionId,
      name: name.trim(),
      method: method.toUpperCase(),
      url: url.trim(),
      headers: headers || [],
      params: params || [],
      bodyType: bodyType || "none",
      body: body || "",
    });

    return res.status(201).json({
      success: true,
      message: "Request saved to collection.",
      data: savedRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all saved requests in a collection
 * GET /api/collections/:collectionId/request
 */
export const getAllSavedRequests = async (req, res) => {
  try {
    const { collectionId } = req.params;

    // Verify collection belongs to the logged-in user
    const collection = await Collection.findOne({ _id: collectionId, user: req.user.id });
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });
    }

    const requests = await SavedRequest.find({ collectionId }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get details of a single saved request
 * GET /api/request/:requestId
 */
export const getSavedRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const savedRequest = await SavedRequest.findById(requestId);
    if (!savedRequest) {
      return res.status(404).json({
        success: false,
        message: "Saved request not found.",
      });
    }

    // Verify collection ownership
    const collection = await Collection.findOne({ _id: savedRequest.collectionId, user: req.user.id });
    if (!collection) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      data: savedRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update details of a saved request
 * PUT /api/request/:requestId
 */
export const updateSavedRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const savedRequest = await SavedRequest.findById(requestId);
    if (!savedRequest) {
      return res.status(404).json({
        success: false,
        message: "Saved request not found.",
      });
    }

    // Verify collection ownership
    const collection = await Collection.findOne({ _id: savedRequest.collectionId, user: req.user.id });
    if (!collection) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const { name, method, url, headers, params, bodyType, body } = req.body;
    if (name !== undefined) savedRequest.name = name.trim();
    if (method !== undefined) savedRequest.method = method.toUpperCase();
    if (url !== undefined) savedRequest.url = url.trim();
    if (headers !== undefined) savedRequest.headers = headers;
    if (params !== undefined) savedRequest.params = params;
    if (bodyType !== undefined) savedRequest.bodyType = bodyType;
    if (body !== undefined) savedRequest.body = body;

    await savedRequest.save();

    return res.status(200).json({
      success: true,
      message: "Saved request updated successfully.",
      data: savedRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete a saved request from a collection
 * DELETE /api/request/:requestId
 */
export const deleteSavedRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const savedRequest = await SavedRequest.findById(requestId);
    if (!savedRequest) {
      return res.status(404).json({
        success: false,
        message: "Saved request not found.",
      });
    }

    // Verify collection ownership
    const collection = await Collection.findOne({ _id: savedRequest.collectionId, user: req.user.id });
    if (!collection) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    await SavedRequest.findByIdAndDelete(requestId);

    return res.status(200).json({
      success: true,
      message: "Saved request deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

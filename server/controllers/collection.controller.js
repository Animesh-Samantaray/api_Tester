import Collection from "../models/Collection.model.js";
import SavedRequest from "../models/SavedRequest.model.js";

// ==========================================
// Collections
// ==========================================

/**
 * Create a new collection
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
      description: description ? description.trim() : "",
      user: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Collection created successfully.",
      data: {
        _id: collection._id,
        name: collection.name,
        description: collection.description,
        requests: [],
        createdAt: collection.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all collections with populated saved requests
 * GET /api/collections
 */
export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user.id }).sort({ createdAt: -1 });

    const populated = await Promise.all(
      collections.map(async (col) => {
        const requests = await SavedRequest.find({ collectionId: col._id }).sort({ createdAt: 1 });
        return {
          _id: col._id,
          name: col.name,
          description: col.description,
          requests: requests.map(reqItem => ({
            id: reqItem._id, // frontend maps it
            _id: reqItem._id,
            name: reqItem.name,
            method: reqItem.method,
            url: reqItem.url,
            headers: reqItem.headers || [],
            params: reqItem.params || [],
            bodyType: reqItem.bodyType || "none",
            body: reqItem.body || "",
            createdAt: reqItem.createdAt,
          })),
          createdAt: col.createdAt,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get single collection
 * GET /api/collections/:collectionId
 */
export const getCollectionById = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const collection = await Collection.findOne({ _id: collectionId, user: req.user.id });
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });
    }

    const requests = await SavedRequest.find({ collectionId: collection._id }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: {
        _id: collection._id,
        name: collection.name,
        description: collection.description,
        requests,
        createdAt: collection.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update collection details
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
        message: "Collection not found or access denied.",
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
 * Delete collection and all its requests
 * DELETE /api/collections/:collectionId
 */
export const deleteCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;

    const collection = await Collection.findOne({ _id: collectionId, user: req.user.id });
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found or access denied.",
      });
    }

    // Cascade delete saved requests
    await SavedRequest.deleteMany({ collectionId: collection._id });
    await Collection.findByIdAndDelete(collectionId);

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
 * Save request inside collection
 * POST /api/collections/:collectionId/request
 */
export const saveRequestInsideCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { name, method, url, headers, params, bodyType, body } = req.body;

    const collection = await Collection.findOne({ _id: collectionId, user: req.user.id });
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found or access denied.",
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
    const collection = await Collection.findOne({ _id: collectionId, user: req.user.id });
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found or access denied.",
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
 * Get single saved request details
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

    // Verify ownership via collection parent
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
 * Update saved request configuration
 * PUT /api/request/:requestId
 */
export const updateSavedRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { name, method, url, headers, params, bodyType, body } = req.body;

    const savedRequest = await SavedRequest.findById(requestId);
    if (!savedRequest) {
      return res.status(404).json({
        success: false,
        message: "Saved request not found.",
      });
    }

    // Verify ownership
    const collection = await Collection.findOne({ _id: savedRequest.collectionId, user: req.user.id });
    if (!collection) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

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
 * Delete saved request
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

    // Verify ownership
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

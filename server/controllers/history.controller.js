import HistoryModel from "../models/History.model.js";

/**
 * Get logged-in user's history
 * GET /api/history
 */
export const getHistory = async (req, res) => {
  try {
    const history = await HistoryModel.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete one history item
 * DELETE /api/history/:id
 */
export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await HistoryModel.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History not found",
      });
    }

    await HistoryModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "History deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Clear all history
 * DELETE /api/history
 */
export const clearHistory = async (req, res) => {
  try {
    await HistoryModel.deleteMany({
      user: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "History cleared successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
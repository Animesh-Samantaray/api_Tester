import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    method: {
      type: String,
      required: true,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },

    url: {
      type: String,
      required: true,
    },

    headers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    body: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    auth: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    status: {
      type: Number,
    },

    responseTime: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("History", historySchema);

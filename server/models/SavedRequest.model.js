import mongoose from "mongoose";

const savedRequestSchema = new mongoose.Schema(
  {
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Request name is required"],
      trim: true,
    },
    method: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    headers: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    params: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    bodyType: {
      type: String,
      default: "none",
    },
    body: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SavedRequest", savedRequestSchema);

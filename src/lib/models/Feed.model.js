import mongoose, { Schema } from "mongoose";

const FeedDataSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
    },
    contentType: {
      type: String,
      enum: ["video", "audio"],
      default: "video",
    },
    transcriptText: {
      type: String,
    },
    analysesText: {
      type: String,
    },
    createdBy: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.FeedData ||
  mongoose.model("FeedData", FeedDataSchema);

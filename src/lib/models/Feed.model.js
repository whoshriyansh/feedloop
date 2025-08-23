import mongoose, { Schema } from "mongoose";

// const WordSchema = new Schema(
//   {
//     start: Number,
//     end: Number,
//     text: String,
//     confidence: Number,
//   },
//   { _id: false } // prevents auto-creating `_id` for each word
// );

const UtteranceSchema = new Schema(
  {
    speaker: String,
    text: String,
  },
  { _id: false }
);

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
    utterances: [UtteranceSchema],
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

//for response object look - https://www.assemblyai.com/docs/speech-to-text/pre-recorded-audio/speaker-diarization

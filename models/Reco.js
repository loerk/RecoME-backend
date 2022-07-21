import mongoose from "mongoose";
const { Schema } = mongoose;
const required = true;
const recoSchema = new Schema(
  {
    categories: {
      type: [String],
      required,
    },
    name: {
      type: String,
      required,
    },
    description: {
      type: String,
      required,
    },
    createdBy: String,
    url: String,
    imageUrl: String,
    memberIds: { type: [String], ref: "User" },
    bubbleId: { type: String, ref: "Bubble" },
  },
  { timestamps: true }
);

export default mongoose.model("Reco", recoSchema);

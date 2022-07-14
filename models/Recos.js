import mongoose from "mongoose";
const { Schema } = mongoose;

const recoSchema = new Schema(
  {
    categories: {
      type: [String],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: String,
    id: String,
    imageUrl: String,
    members: [String],
  },
  { timestamps: true }
);

export default mongoose.model("User", recoSchema);

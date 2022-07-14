import mongoose from "mongoose";
const { Schema } = mongoose;

const bubbleSchema = new Schema(
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

export default mongoose.model("User", bubbleSchema);

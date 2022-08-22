import mongoose from "mongoose";
const { Schema } = mongoose;
const required = true;
const bubbleSchema = new Schema(
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
    defaultImg: Boolean,
    createdBy: String,
    imageUrl: String,
    members: [{ type: String, ref: "User", default: null }],
  },
  { timestamps: true }
);

export default mongoose.model("Bubble", bubbleSchema);

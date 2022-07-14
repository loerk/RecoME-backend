import mongoose from "mongoose";
const { Schema, model } = mongoose;

const notificationSchema = new Schema(
  {
    bubbleId: String,
    id: String,
    invitedBy: String,
    invitedByUser: String,
    type: String,
    user: [String],
  },
  { timestamps: true }
);

export default model("Notification", notificationSchema);

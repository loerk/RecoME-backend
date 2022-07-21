import mongoose from "mongoose";
const { Schema, model } = mongoose;

const notificationSchema = new Schema(
  {
    bubbleId: { type: String, ref: "Bubble", default: null },
    invitedBy: { type: String, ref: "User" },
    type: String,
    userIds: { type: [String], ref: "User", default: null },
    recoId: { type: String, ref: "Reco", default: null },
  },
  { timestamps: true }
);

export default model("Notification", notificationSchema);

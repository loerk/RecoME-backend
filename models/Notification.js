import mongoose from "mongoose";
const { Schema, model } = mongoose;

const notificationSchema = new Schema({
  invitedAt: { type: Date, default: new Date() },
  invitedBy: String,
  invitedByUser: String,
  type: String,
  bubbleId: String,
  // reco missing
});

const Notification = model("Notification", notificationSchema);

export default Notification;

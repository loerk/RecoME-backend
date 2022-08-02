import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import Bubble from "../models/Bubble.js";
import Reco from "../models/Reco.js";
import User from "../models/User.js";

export const listNotifications = async (req, res) => {
  try {
    const { id } = req.user;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("no valid id");
    const bubbles = await Bubble.find({ members: id });
    const bubbleIds = bubbles.map((bubble) => bubble._id);
    const notifications = await Notification.find({
      $or: [{ userIds: id }, { bubbleId: { $in: bubbleIds } }],
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
  }
};

export const deleteNotification = async (req, res) => {
  const notificationId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(notificationId))
    return res.status(404).json({ message: "invalid id" });
  try {
    await Notification.findByIdAndDelete(notificationId);
    const remainingNotifications = await listNotifications();
    if (remainingNotifications > 1)
      return res.status(200).json({ remainingNotifications });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const acceptNotification = async (req, res) => {
  const { id } = req.user;
  const notificationId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(notificationId))
    return res.status(404).json({ message: "invalid id" });

  try {
    const notification = await Notification.findById(notificationId);
    if (notification.type === "INVITATION_TO_BUBBLE") {
      const bubble = await Bubble.findByIdAndUpdate(
        notification.bubbleId,
        { $addToSet: { members: id } },
        { new: true }
      );
      // update Friend
      await User.findByIdAndUpdate(
        notification.invitedBy,
        { $addToSet: { friends: id } },
        { new: true }
      );
      const currentUser = await User.findByIdAndUpdate(
        id,
        { $addToSet: { friends: notification.invitedBy } },
        { new: true }
      );
      await Notification.findByIdAndDelete(notificationId);
      return res.status(200).json({
        updatedBubble: bubble,
        updatedCurrentUser: currentUser,
      });
    }
    if (notification.type === "INVITATION_TO_RECO") {
      const reco = await Reco.findByIdAndUpdate(
        notification.recoId,
        { $addToSet: { userIds: id } },
        { new: true }
      );
      await Notification.findByIdAndDelete(notificationId);
      return res.status(200).json({ reco, message: "deleted notification" });
    }
    if (notification.type === "NOTIFICATION_ABOUT_RECO_IN_BUBBLE") {
      const notification = await Notification.findById(notificationId);
      if (notification.userIds.length > 1) {
        await Notification.updateOne(
          { _id: notificationId },
          { $pull: { userIds: id } }
        );
        return res
          .status(205)
          .json({ message: "removed user from notification" });
      }
      await Notification.findByIdAndDelete(notificationId);
      return res.status(205).json({ message: "deleted notification" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

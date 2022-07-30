import Bubble from "../models/Bubble.js";
import Notification from "../models/Notification.js";
import Reco from "../models/Reco.js";

export const addNotification = async (data) => {
  const { id, bubbleId, type, userIds, recoId } = data;
  if (type === "INVITATION_TO_BUBBLE") {
    const bubbles = await Bubble.find({ members: id });
    const bubbleIds = bubbles.map((bubble) => bubble._id);
    const bubbleNotifications = await Notification.find({
      $and: [{ userIds: id }, { bubbleId: { $in: bubbleIds } }],
    });
    console.log(bubbleNotifications);
    if (bubbleNotifications.length !== 0)
      throw new Error("user is already invited to this bubble");
  }
  if (type === "INVITATION_TO_RECO") {
    const recos = await Reco.find({ membersIds: id });
    const recoIds = recos.map((reco) => reco._id);
    const recoNotifications = await Notification.find({
      $and: [{ userIds: id }, { recoId: { $in: recoIds } }],
    });
    console.log(recoNotifications);
    if (recoNotifications.length !== 0)
      throw new Error("user is already invited to this reco");
  }
  try {
    const notification = await Notification.create({
      bubbleId,
      invitedBy: id,
      type,
      userIds,
      recoId,
    });
    return notification;
  } catch (error) {
    return error;
  }
};

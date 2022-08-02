import Bubble from "../models/Bubble.js";
import Notification from "../models/Notification.js";
import Reco from "../models/Reco.js";

export const addNotification = async (data) => {
  const { id, bubbleId, type, userIds, recoId } = data;

  let filteredUserIds;
  if (type === "INVITATION_TO_BUBBLE") {
    const bubbleNotifications = await Notification.find({
      $and: [{ userIds: { $in: userIds } }, { bubbleId: bubbleId }],
    });
    if (bubbleNotifications.length !== 0) {
      const invitedUserIds = bubbleNotifications
        .map((notification) => notification.userIds)
        .flat();

      filteredUserIds = userIds.filter((userId) => {
        if (invitedUserIds.includes(userId)) return false;
        return true;
      });
      if (filteredUserIds.length === 0) {
        throw new Error("users are already invited to this bubble");
      }
    }
  }
  if (type === "INVITATION_TO_RECO") {
    const recos = await Reco.find({ userIds: { $in: userIds } });
    console.log({ recos });
    const recoIds = recos.map((reco) => reco._id);
    console.log({ recoIds });
    if (recoIds.includes(recoId)) throw new Error("user already has this reco");
    const recoNotifications = await Notification.find({
      $and: [{ userIds: id }, { recoId: { $in: recoIds } }],
    });

    if (recoNotifications.length !== 0)
      throw new Error("user is already invited to this reco");
  }

  try {
    const notification = await Notification.create({
      bubbleId,
      invitedBy: id,
      type,
      userIds: filteredUserIds || userIds,
      recoId,
    });
    return notification;
  } catch (error) {
    return error;
  }
};

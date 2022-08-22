import Notification from "../models/Notification.js";
import Reco from "../models/Reco.js";

export const addNotification = async (data) => {
  const { _id, bubbleId, type, userIds, recoId } = data;
  let filteredUserIds;

  if (type === "INVITATION_TO_BUBBLE") {
    // collect all notifications for this bubble
    const bubbleNotifications = await Notification.find({
      $and: [
        { userIds: { $in: userIds } },
        { bubbleId: bubbleId },
        { type: "INVITATION_TO_BUBBLE" },
      ],
    });

    if (bubbleNotifications.length !== 0) {
      // get an array of all the invited userIds
      const invitedUserIds = bubbleNotifications
        .map((notification) => notification.userIds)
        .flat();
      // filter the userIds to only include uninvited users
      filteredUserIds = userIds.filter((userId) => {
        if (invitedUserIds.includes(userId)) return false;
        return true;
      });

      if (filteredUserIds.length === 0) {
        throw new Error("users are already invited to this bubble");
      }
    } else {
      filteredUserIds = userIds;
    }
  }

  if (type === "INVITATION_TO_RECO") {
    const recos = await Reco.find({ userIds: { $in: userIds } });
    const recoIds = recos.map((reco) => reco._id);
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
      invitedBy: _id,
      type,
      userIds: filteredUserIds || userIds,
      recoId,
    });
    return notification;
  } catch (error) {
    console.log(error);
    return error;
  }
};

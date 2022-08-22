import mongoose from "mongoose";
import { addNotification } from "../helpers/addNotification.js";
import Bubble from "../models/Bubble.js";
import Notification from "../models/Notification.js";
import Reco from "../models/Reco.js";

export const listRecos = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).send("no valid id");

    const recos = await Reco.find({
      $or: [{ userIds: _id }, { createdBy: _id }],
    }).populate([
      { path: "createdBy", select: "_id avatarUrl" },
      { path: "bubbleId", select: " _id name imageUrl" },
      { path: "userIds", select: "_id avatarUrl" },
    ]);

    res.status(200).json({ recos });
  } catch (error) {
    console.log(error);
  }
};

export const addReco = async (req, res) => {
  const { _id } = req.user;
  const { categories, title, description, recoUrl, userIds, bubbleId } =
    req.body;

  try {
    const reco = await Reco.create({
      userIds,
      bubbleId: bubbleId,
      createdBy: _id,
      categories: categories.split(","),
      title,
      description,
      recoUrl,
    });

    if (!bubbleId && reco) {
      const notification = await addNotification({
        _id,
        recoId: reco._id,
        type: "INVITATION_TO_RECO",
        userIds,
      });
      if (!notification)
        return res
          .status(400)
          .json({ message: "could not create notification" });
    } else {
      const filteredUserIds = userIds.filter((userId) => userId._id !== _id);
      const notification = await addNotification({
        _id,
        bubbleId,
        recoId: reco._id,
        type: "NOTIFICATION_ABOUT_RECO_IN_BUBBLE",
        userIds: filteredUserIds,
      });

      if (!notification)
        return res
          .status(400)
          .json({ message: "could not create notification" });
    }

    res.status(201).json(reco);
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

export const listBubbleRecos = async (req, res) => {
  const { _id } = req.user;
  const { id: bubbleId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(bubbleId))
      return res.status(404).json({ message: "invalid bubbleId" });

    const bubbleRecos = await Reco.find({ bubbleId: bubbleId }).populate(
      "createdBy",
      "_id avatarUrl"
    );
    const filteredBubbleRecos = bubbleRecos.filter((bubbleReco) => {
      if (!bubbleReco.userIds.includes(_id)) return false;
      return true;
    });

    res.status(200).json({ bubbleRecos: filteredBubbleRecos });
  } catch (error) {
    console.log(error);
  }
};

export const updateReco = async (req, res) => {
  const { id: recoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(recoId))
    return res.status(404).send("no reco with that id");
  try {
    const reco = await Reco.findByIdAndUpdate({ id: recoId }, req.body, {
      new: true,
    });
    res.status(202).json(reco);
  } catch (error) {
    console.log(error);
    res.status(203).json({ message: "not authorized" });
  }
};

export const ignoreReco = async (req, res) => {
  const { _id } = req.user;
  const recoId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(recoId))
    return res.status(404).send("no reco with that id");

  try {
    const reco = await Reco.findById(recoId);
    if (reco.userIds.length > 1) {
      const updatedReco = await Reco.findByIdAndUpdate(recoId, {
        $pull: { userIds: _id },
      });

      if (updatedReco) {
        return res.status(200).json({ message: "removed User successfully" });
      }
    } else {
      await Reco.findByIdAndDelete(recoId);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteReco = async (req, res) => {
  const { _id } = req.user;
  const recoId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(recoId))
    return res.status(404).send("no reco with that id");

  try {
    const reco = await Reco.findById(recoId);
    if (!reco.userIds?.includes(_id)) {
      const bubble = await Bubble.findById(reco.bubbleId);
      if (!bubble.members.includes(_id))
        return res.status(403).send("not authorized to delete");
    }

    const deletedReco = await Reco.findByIdAndDelete(recoId);
    if (deletedReco) {
      await Notification.findOneAndDelete({ recoId });
      res.status(205).json({ message: "deleted reco" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

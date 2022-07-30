import mongoose from "mongoose";
import { addNotification } from "../helpers/addNotification.js";
import Bubble from "../models/Bubble.js";
import Reco from "../models/Reco.js";
import { findBubbleById } from "./bubbleController.js";

export const listRecos = async (req, res) => {
  try {
    const { id } = req.user;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("no valid id");

    const bubbles = await Bubble.find({ members: id });
    const bubbleIds = bubbles.map((bubble) => bubble._id);

    const recos = await Reco.find({
      $or: [{ memberIds: id }, { bubbleId: { $in: bubbleIds } }],
    });

    res.status(200).json(recos);
  } catch (error) {
    console.log(error);
  }
};

export const addReco = async (req, res) => {
  const { id } = req.user;
  const { categories, name, description, imageUrl, userIds, bubbleId } =
    req.body;
  try {
    const reco = await Reco.create({
      userIds,
      bubbleId: bubbleId,
      createdBy: id,
      categories,
      name,
      description,
      imageUrl,
    });
    if (!bubbleId) {
      const notification = await addNotification({
        id,
        recoId: reco._id,
        type: "INVITATION_TO_RECO",
        userIds,
      });
      if (!notification)
        return res
          .status(400)
          .json({ message: "could not create notification" });
    } else {
      const notification = await addNotification({
        id,
        bubbleId,
        type: "NOTIFICATION_ABOUT_RECO_IN_BUBBLE",
        userIds,
      });
      if (!notification)
        return res
          .status(400)
          .json({ message: "could not create notification" });
    }

    res.status(201).json(reco);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateReco = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("no reco with that id");
  try {
    const reco = await Reco.findByIdAndUpdate({ id }, req.body, {
      new: true,
    });
    res.status(202).json(reco);
  } catch (error) {
    console.log(error);
    res.status(203).json({ message: "not authorized" });
  }
};

export const deleteReco = async (req, res) => {
  const { id } = req.user;
  const { recoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(recoId))
    return res.status(404).send("no bubble with that id");

  try {
    const reco = await findRecoById(recoId);
    if (!reco.memberIds?.includes(id)) {
      const bubble = findBubbleById(reco.bubbleId);
      if (!bubble.members.includes(id))
        return res.status(403).send("not authorized to delete");
    }
    await Reco.findByIdAndDelete(id);
    res.status(205).json({ message: "deleted reco" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

import mongoose from "mongoose";
import { addNotification } from "../helpers/addNotification.js";

import Bubble from "../models/Bubble.js";

export const addBubble = async (req, res) => {
  const { id } = req.user;
  const { categories, name, description, createdBy, imageUrl, members } =
    req.body;

  try {
    const bubble = await Bubble.create({
      categories: categories.split(" "),
      name,
      description,
      createdBy,
      imageUrl,
      members: [id],
    });

    res.status(201).json(bubble);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const updateBubble = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "invalid bubbleId" });
  try {
    const updatedBubble = await Bubble.findByIdAndUpdate({ id }, req.body, {
      new: true,
    });
    res.status(202).json(updatedBubble);
  } catch (error) {
    console.log(error);
    res.status(203).json({ message: "not authorized" });
  }
};

export const deleteBubble = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "invalid bubbleId" });
  try {
    await Bubble.findByIdAndDelete({ id });
    res.status(205).json({ message: "deleted bubble" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const listBubbles = async (req, res) => {
  try {
    const { id } = req.user;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ message: "invalid bubbleId" });

    const userBubbles = await Bubble.find({ members: id }).populate(
      "members",
      "_id username avatarUrl"
    );
    res.status(200).json(userBubbles);
  } catch (error) {
    console.log(error);
  }
};

export const findBubbleById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid)
    return res.status(404).json({ message: "invalid bubbleId" });
  try {
    const foundBubble = await Bubble.findById({ id });
    res.status(200).json(foundBubble);
  } catch (error) {
    console.log(error);
  }
};
export const inviteUser = async (req, res) => {
  const { id } = req.user;
  const bubbleId = req.params.bubbleId;
  const { userId } = req.body;

  try {
    const currentBubble = await Bubble.findById(bubbleId);
    if (currentBubble.members.includes(userId))
      return res.status(409).json({ message: "user is already member" });
    const notification = await addNotification({
      id,
      bubbleId,
      type: "INVITATION_TO_BUBBLE",
      userIds: [userId],
    });
    if (!notification)
      return res
        .status(400)
        .json({ message: "could not create invitation notification" });
    res.status(200).json({ currentBubble });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "something went wrong" });
  }
};
export const leaveBubble = async (req, res) => {
  const { id } = req.user;
  const bubbleId = req.params.bubbleId;
  try {
    const currentBubble = await Bubble.findById(bubbleId);
    if (currentBubble.members.length === 1) {
      await deleteBubble(bubbleId);
    } else {
      currentBubble.members = currentBubble.members.filter(
        (memberId) => memberId !== id
      );
      await currentBubble.save();
    }
    res.status(200).json({ message: "successfully left bubble" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "something went wrong" });
  }
};

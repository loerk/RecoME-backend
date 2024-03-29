import mongoose from "mongoose";
import { addNotification } from "../helpers/addNotification.js";

import Bubble from "../models/Bubble.js";
import User from "../models/User.js";

export const addBubble = async (req, res) => {
  const { _id } = req.user;
  const { categories, name, description, imageUrl, defaultImg } = req.body;

  try {
    const bubble = await Bubble.create({
      categories: categories.split(","),
      name,
      description,
      createdBy: _id,
      imageUrl,
      members: [_id],
      defaultImg,
    });

    res.status(201).json(bubble);
  } catch (error) {
    console.log(error);
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
    await Bubble.findByIdAndDelete(id);
    res.status(205).json({ message: "deleted bubble" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
export const listBubbles = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).json({ message: "invalid bubbleId" });

    const userBubbles = await Bubble.find({ members: _id }).populate(
      "members",
      "_id username avatarUrl"
    );
    res.status(200).json({ userBubbles });
  } catch (error) {
    console.log(error);
  }
};

export const findBubbleById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "invalid bubbleId" });
  try {
    const bubble = await Bubble.findById(id).populate(
      "members",
      "_id username avatarUrl"
    );
    res.status(200).json({ bubble });
  } catch (error) {
    console.log(error);
  }
};

export const inviteUsers = async (req, res) => {
  const { _id } = req.user;
  const bubbleId = req.params.bubbleId;
  const { userIds, email } = req.body;

  if (!mongoose.Types.ObjectId.isValid(bubbleId))
    return res.status(404).json({ message: "invalid bubbleId" });
  try {
    const currentBubble = await Bubble.findById(bubbleId);
    let filteredUserIds;
    if (email) {
      const user = await User.findOne({ email });
      const _id = user._id.toString();
      if (currentBubble.members.includes(_id))
        return res.status(409).json({ message: "user is already member" });
      filteredUserIds = [_id];
    }
    if (userIds) {
      // collect the users who are not yet member
      filteredUserIds = userIds.filter((userId) => {
        if (currentBubble.members.includes(userId)) return false;
        return true;
      });

      if (filteredUserIds.length === 0)
        return res
          .status(409)
          .json({ message: "all invited users are already member" });
    }

    const notification = await addNotification({
      _id,
      bubbleId,
      type: "INVITATION_TO_BUBBLE",
      userIds: filteredUserIds,
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
  const { _id } = req.user;
  const bubbleId = req.params.bubbleId;

  try {
    const currentBubble = await Bubble.findById(bubbleId);
    if (currentBubble.members.length === 1) {
      await Bubble.findByIdAndDelete(bubbleId);
    } else {
      currentBubble.members = currentBubble.members.filter(
        (memberId) => memberId !== _id
      );
      await currentBubble.save();
    }
    res.status(200).json({ message: "successfully left bubble" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "something went wrong" });
  }
};

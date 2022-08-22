import User from "../models/User.js";

export const findUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundUser = await User.findById(id).populate(
      "friends",
      "_id username avatarUrl"
    );
    res.status(200).json({ foundUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = req.body;

    const newUser = await User.findByIdAndUpdate(id, updatedUser, {
      new: true,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const unfriendUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const friendId = req.params.id;
    const updatedCurrentUser = await User.findByIdAndUpdate(
      _id,
      { $pull: { friends: friendId } },
      { new: true }
    );
    await User.findByIdAndUpdate(
      friendId,
      { $pull: { friends: _id } },
      { new: true }
    );
    if (updatedCurrentUser) return res.status(200).json({ updatedCurrentUser });
  } catch (error) {
    console.log(error);
    res
      .status(409)
      .json({ message: "something went wrong while unfriend User" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id: _id } = req.params;
    await User.findByIdAndDelete(_id);
    res.status(205).json({ message: "deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import User from "../models/User.js";

export const findUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundUser = await User.findById(id);
    res.status(200).json(foundUser);
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
};

export const findUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const foundUser = await User.findOne(email);
    res.status(200).json(foundUser);
  } catch (error) {
    res.status(400).json({ message: err.message });
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
    res.status(400).json({ message: err.message });
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

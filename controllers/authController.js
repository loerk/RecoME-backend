import bcrypt from "bcryptjs";

import User from "../models/User.js";
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ "profile.email": email });
    if (!foundUser) throw new Error("password or  incorrect");
    const isValidUser = await bcrypt.compare(
      password,
      foundUser.profile.password
    );
    if (!isValidUser) throw new Error("password or email is incorrect");

    foundUser.lastLogin = new Date();
    await foundUser.save();
    res.status(200).json({ message: "successfully logged in" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { profile } = req.body;
    profile.password = await bcrypt.hash(profile.password, 10);
    const newUser = await User.create({
      profile,
      avatarUrl: `https://api.multiavatar.com/${profile.username}.png`,
    });
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

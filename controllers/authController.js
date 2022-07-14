import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../helpers/generateToken.js";
import { sendVerificationEmail } from "../helpers/sendVerificationEmail.js";
import { isEmailTokenValid } from "../helpers/verifyEmail.js";

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) throw new Error("password or Email is incorrect");

    const isValidUser = await bcrypt.compare(password, existingUser.password);
    if (!isValidUser) throw new Error("password or email is incorrect");

    if (!existingUser.verified)
      res.json({ message: "please confirm your email first" });
    const { username, id } = existingUser;

    const payload = {
      username,
      id,
    };

    const token = generateToken(payload);

    existingUser.lastLogin = new Date();
    await existingUser.save();
    res.status(200).json({ message: "successfully logged in", token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export const signup = async (req, res) => {
  try {
    const { email, password, passwordConfirm, username } = req.body;

    const emailToken = generateToken({ email });
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "email already exists" });

    if (password !== passwordConfirm)
      return res.status(400).json({ message: "passwords do not match" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = (await User.find()).length + 1;
    await User.create({
      username,
      email,
      password: hashedPassword,
      id,
      avatarUrl: `https://api.multiavatar.com/${username}.png`,
      emailToken,
    });

    sendVerificationEmail(emailToken, email, username);

    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
export const verifyEmailToken = (req, res) => {
  const token = req.params.token;

  const tokenIsVerified = isEmailTokenValid(token);
  // what if success
  console.log(tokenIsVerified);
  if (!tokenIsVerified)
    res.status(400).json({ message: "no valid email token" });
  User.findOneAndUpdate({ token }, { verified: true }, (err) => {
    if (err) res.json(err.message);
    res
      .status(200)
      .json({ message: "you have successfully verified your email" });
  });
};

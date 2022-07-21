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

    const refreshToken = generateToken(payload, "REFRESH"); // 5 days
    const accessToken = generateToken(payload, "ACCESS"); // 3 hrs

    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    res.cookie("accessToken", accessToken, { httpOnly: true });

    existingUser.lastLogin = new Date();
    await existingUser.save();

    res.status(200).json({
      message: "successfully logged in",
      existingUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * creates a Request and Response instance and returns the Response (res.)
 * @param {Request} req
 * @param {Response} res
 * @returns {Response}
 * @desc registration request controller
 */
export const signup = async (req, res) => {
  try {
    const { email, password, passwordConfirm, username } = req.body;
    console.log(email);
    const emailToken = generateToken({ email }, "EMAIL");
    const existingUser = await User.findOne({ email });
    console.log(emailToken);
    if (existingUser)
      return res.status(409).json({ message: "email already exists" });

    if (password !== passwordConfirm)
      return res.status(403).json({ message: "passwords do not match" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatarUrl: `https://api.multiavatar.com/${username}.png`,
      emailToken,
    });

    sendVerificationEmail(emailToken, email, username);

    res.status(201).json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
export const verifyEmailToken = (req, res) => {
  const emailToken = req.params.token;

  const tokenIsVerified = isEmailTokenValid(emailToken);
  console.log("token", tokenIsVerified);
  if (!tokenIsVerified)
    res.status(400).json({ message: "no valid email token" });

  User.findOneAndUpdate({ emailToken }, { verified: true }, (err) => {
    if (err) res.status(400).json(err.message);
    res.status(200).redirect("http://localhost:3000/login");
  });
};

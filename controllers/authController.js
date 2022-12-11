import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateToken } from '../helpers/generateToken.js';
import { sendVerificationEmail } from '../helpers/sendVerificationEmail.js';
import { isEmailTokenValid } from '../helpers/verifyEmail.js';
import { hashPassword } from '../helpers/hashPassword.js';

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email }).populate(
      'friends',
      '_id avatarUrl username'
    );

    if (!existingUser) throw new Error('Wrong email or password');

    const isValidUser = await bcrypt.compare(password, existingUser.password);

    if (!isValidUser) throw new Error('Wrong email or password');

    if (!existingUser.verified)
      res.json({ message: 'please confirm your email first' });

    const { username, _id } = existingUser;
    const payload = {
      username,
      _id,
    };

    const refreshToken = generateToken(payload, 'REFRESH'); // 5 days
    const accessToken = generateToken(payload, 'ACCESS'); // 3 hrs
    const accessTokenDecoded = jwt.decode(accessToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });

    existingUser.lastLogin = new Date();
    await existingUser.save();

    res.status(200).json({
      message: 'successfully logged in',
      expiresAt: accessTokenDecoded.exp,
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
  console.log(req.body);
  try {
    const { email, password, passwordConfirm, username } = req.body;
    const emailToken = generateToken({ email }, 'EMAIL');
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser)
      return res.status(409).json({ message: 'email already exists' });

    if (password !== passwordConfirm)
      return res.status(403).json({ message: 'passwords do not match' });

    const hashedPassword = await hashPassword(password);
    await User.create({
      username,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      avatarUrl: `https://api.multiavatar.com/${username}.png`,
      emailToken,
    });

    const errorSendingEmail = sendVerificationEmail(
      emailToken,
      email,
      username
    );
    if (errorSendingEmail) throw new Error(errorSendingEmail);
    res.status(201).json({ message: 'successfully registered account' });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: 'there was a problem creating your account' });
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
  if (!tokenIsVerified)
    res.status(400).json({ message: 'no valid email token' });

  User.findOneAndUpdate({ emailToken }, { verified: true }, (error) => {
    if (error) res.status(400).json(error.message);
    res.status(200).redirect('https://recomenow.netlify.app/login');
  });
};

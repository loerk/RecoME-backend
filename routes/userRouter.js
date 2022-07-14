import { Router } from "express";
import { check } from "express-validator";
import { getUserById } from "../controllers/userControllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import User from "../models/User.js";
const userRouter = Router();

userRouter.post("/findUser", verifyToken, getUserById);

export default userRouter;

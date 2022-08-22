import { Router } from "express";
import { check } from "express-validator";
import {
  findUserById,
  unfriendUser,
  deleteUser,
} from "../controllers/userController.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";

const userRouter = Router();

userRouter.get("/:id", verifyAccessToken, findUserById);
userRouter.put("/:id", verifyAccessToken, unfriendUser);
userRouter.delete("/:id", verifyAccessToken, deleteUser);

export default userRouter;

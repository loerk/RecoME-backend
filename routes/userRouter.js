import { Router } from "express";
import { check } from "express-validator";
import {
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";

const userRouter = Router();

userRouter.get("/:id", verifyAccessToken, findUserById);
userRouter.get("/:email", verifyAccessToken, findUserByEmail);
userRouter.put("/:id", verifyAccessToken, updateUser);
userRouter.delete("/:id", verifyAccessToken, deleteUser);

export default userRouter;

import { Router } from "express";
import { check } from "express-validator";
import {
  addBubble,
  inviteUsers,
  deleteBubble,
  findBubbleById,
  listBubbles,
  leaveBubble,
  updateBubble,
} from "../controllers/bubbleController.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";

const bubbleRouter = Router();
bubbleRouter.post("/", verifyAccessToken, addBubble);
bubbleRouter.put("/:id", verifyAccessToken, updateBubble);
bubbleRouter.delete("/:id", verifyAccessToken, deleteBubble);
bubbleRouter.get("/", verifyAccessToken, listBubbles);
bubbleRouter.get("/:id", verifyAccessToken, findBubbleById);
bubbleRouter.put("/:bubbleId/inviteUsers", verifyAccessToken, inviteUsers);
bubbleRouter.put("/:bubbleId/leave", verifyAccessToken, leaveBubble);
export default bubbleRouter;

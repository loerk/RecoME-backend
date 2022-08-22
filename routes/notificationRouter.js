import { Router } from "express";
import { check } from "express-validator";
import {
  acceptNotification,
  deleteNotification,
  listNotifications,
} from "../controllers/notificationController.js";

import verifyAccessToken from "../middlewares/verifyAccessToken.js";

const notificationRouter = Router();
notificationRouter.get("/", verifyAccessToken, listNotifications);
notificationRouter.put("/:id", verifyAccessToken, acceptNotification);
notificationRouter.delete("/:id", verifyAccessToken, deleteNotification);

export default notificationRouter;

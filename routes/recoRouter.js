import { Router } from "express";
import { check } from "express-validator";
import {
  listRecos,
  addReco,
  deleteReco,
  updateReco,
  listBubbleRecos,
  ignoreReco,
} from "../controllers/recoController.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";

const recoRouter = Router();
recoRouter.get("/", verifyAccessToken, listRecos);
recoRouter.get("/:id", verifyAccessToken, listBubbleRecos);
recoRouter.post("/", verifyAccessToken, addReco);
recoRouter.put("/:id", verifyAccessToken, updateReco);
recoRouter.put("/:id/ignore", verifyAccessToken, ignoreReco);
recoRouter.delete("/:id", verifyAccessToken, deleteReco);

export default recoRouter;

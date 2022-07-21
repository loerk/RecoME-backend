import { Router } from "express";
import { check } from "express-validator";
import {
  listRecos,
  addReco,
  deleteReco,
  updateReco,
} from "../controllers/recoController.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";

const recoRouter = Router();
recoRouter.get("/", verifyAccessToken, listRecos);
recoRouter.post("/", verifyAccessToken, addReco);
recoRouter.put("/:id", verifyAccessToken, updateReco);
recoRouter.delete("/:id", verifyAccessToken, deleteReco);

export default recoRouter;
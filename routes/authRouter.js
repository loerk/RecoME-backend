import { Router } from "express";
const router = Router();
import {
  signup,
  signin,
  verifyEmailToken,
} from "../controllers/authController.js";

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/verify/:token", verifyEmailToken);
export default router;

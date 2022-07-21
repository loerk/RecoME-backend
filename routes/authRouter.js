import { Router } from "express";

import {
  signup,
  signin,
  verifyEmailToken,
} from "../controllers/authController.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
//router.post("/refreshToken", refreshAuth, tokenController);
// middleware checks the refresh token and read the data of the body maybe id
// provide an code to the email address and the body needs to
// controller
router.get("/verifyEmail/:token", verifyEmailToken);
export default router;

import { Router } from "express";
import { registerUser, loginUser, sendOtp, logoutUser, refreshAccessToken, changePassword } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.route("/sendOtp").post(sendOtp)
router.route("/signup").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/refresh-token").post(refreshAccessToken)

export default router
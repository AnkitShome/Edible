import { Router } from "express";
import { registerUser, loginUser, sendOtp, logoutUser, refreshAccessToken, changePassword, updateUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middleware/auth.js";
import { forgotPassword, resetPassword } from "../controllers/password.controllers.js";

const router = Router();

router.route("/sendOtp").post(sendOtp)
router.route("/signup").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/update").post(verifyJWT, updateUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password").post(resetPassword)


export default router
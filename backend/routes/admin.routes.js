import { Router } from "express";
import { loginUser, sendOtp, logoutUser, refreshAccessToken, changePassword, updateUser } from "../controllers/user.controllers.js";
import { registerAdmin } from "../controllers/admin.controllers.js";
import { verifyJWT, isAdmin } from "../middleware/auth.js";
import { forgotPassword, resetPassword } from "../controllers/password.controllers.js";

const router = Router()

router.route("/sendOtp").post(sendOtp)
router.route("/signup").post(registerAdmin)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, isAdmin, logoutUser)
router.route("/change-password").post(verifyJWT, isAdmin, changePassword)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/update").post(verifyJWT, isAdmin, updateUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password").post(resetPassword)

export default router
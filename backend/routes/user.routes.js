import { Router } from "express";
import { registerUser, login, sendOtp } from "../controllers/user.controllers.js";

const router = Router();

router.post("/sendOtp", sendOtp)
router.post("/signup", registerUser)
router.post("/login", login)

export default router
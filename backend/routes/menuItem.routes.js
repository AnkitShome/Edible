import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { isAdmin, verifyJWT } from "../middleware/auth.js";
import { addItem, removeItem } from "../controllers/menuItem.controller.js";

const router = Router()
router.route("/add").post(verifyJWT, isAdmin, addItem)
router.route("/remove").post(verifyJWT, isAdmin, removeItem)

export default router
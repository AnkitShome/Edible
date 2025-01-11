import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { isAdmin, verifyJWT } from "../middleware/auth.js";
import { addItem, editItem, removeItem } from "../controllers/menuItem.controller.js";

const router = Router()
router.route("/add").post(verifyJWT, isAdmin, upload.single('image'), addItem)
// router.route("/add").post(verifyJWT, isAdmin, upload.single('image'), addItem)
router.route("/remove").post(verifyJWT, isAdmin, removeItem)
router.route("/edit").post(verifyJWT, isAdmin, upload.single('image'), editItem)

export default router
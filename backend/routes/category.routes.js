import { Router } from "express";
import { upload } from "../middleware/multer.js";

import { isAdmin, verifyJWT } from "../middleware/auth.js";
import { addCategory, deleteCategory } from "../controllers/category.controllers.js";


const router = Router()
router.route("/add").post(verifyJWT, isAdmin, addCategory)
router.route("/remove").post(verifyJWT, isAdmin, deleteCategory)

export default router
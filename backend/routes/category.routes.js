import { Router } from "express";
import { isAdmin, verifyJWT } from "../middleware/auth.js";
import { addCategory, deleteCategory, editCategory } from "../controllers/category.controllers.js";


const router = Router()
router.route("/add").post(verifyJWT, isAdmin, addCategory)
router.route("/remove").post(verifyJWT, isAdmin, deleteCategory)
router.route("/edit").post(verifyJWT, isAdmin, editCategory)

export default router
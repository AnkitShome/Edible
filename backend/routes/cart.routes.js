import { Router } from "express";
import { verifyJWT } from "../middleware/auth.js";
import { addToCart, deleteCart, editAmount } from "../controllers/cart.controllers.js";

const router = Router()

router.route("/add").post(verifyJWT, addToCart)
router.route("/edit").post(verifyJWT, editAmount)
router.route("/remove").post(verifyJWT, deleteCart)

export default router
import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { addRestaurant } from "../controllers/restaurant.controllers.js";
import { isAdmin, verifyJWT } from "../middleware/auth.js";


const router = Router()

router.route("/add").post(verifyJWT, isAdmin, upload.single('image'), addRestaurant)

// router.route("/add").post(verifyJWT, isAdmin, upload.none(), addRestaurant)

export default router
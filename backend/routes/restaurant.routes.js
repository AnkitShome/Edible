import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { addRestaurant, deleteRestaurant, getAllRestaurants, getRestaurant } from "../controllers/restaurant.controllers.js";
import { isAdmin, verifyJWT } from "../middleware/auth.js";


const router = Router()

router.route("/add").post(verifyJWT, isAdmin, upload.single('image'), addRestaurant)
router.route("/get-all").get(verifyJWT, getAllRestaurants)
router.route("/get").get(verifyJWT, getRestaurant)
router.route("/delete").post(verifyJWT, isAdmin, deleteRestaurant)

export default router
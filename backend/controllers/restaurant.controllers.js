import { Restaurant } from "../models/restaurant.models.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const addRestaurant = async (req, res) => {
   try {
      const { name, description, address, open, close, image } = req.body

      if (!name || !description || !address) {
         return res.status(400)
            .json({
               success: false,
               msg: "Enter required fields"
            })
      }
      const createRestaurant = {
         name,
         description,
         location: { address },
      }

      if (openingHours.open && openingHours.close) {
         createRestaurant.openingHours = { open, close }
      }

      if (image) {
         const imageResponse = uploadOnCloudinary(image)
         createRestaurant.image = imageResponse.secure_url
      }

      const restaurant = await Restaurant.create(createRestaurant)

      return res.status(200)
         .json({
            success: true,
            msg: "Restaurant added"
         })

   } catch (error) {
      console.log(error)
      return res.status(500)
         .json({
            success: false,
            msg: "An error occured while adding the restaurant"
         })
   }

}
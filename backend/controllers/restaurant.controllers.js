import { Restaurant } from "../models/restaurant.models.js";
import { MenuItem } from "../models/menuItem.models.js";
import { Category } from "../models/category.models.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const addRestaurant = async (req, res) => {
   try {
      const { name, description, address, lat, lon, slots } = req.body

      const image = req.file?.path;

      if (!name || !description || !address || !lat || !lon || !image || !slots) {

         return res.status(400)
            .json({
               success: false,
               msg: "Enter all required fields"
            })
      }

      const uploadImage = await uploadOnCloudinary(image)

      if (!uploadImage) {
         return res.status(400)
            .json({
               success: false,
               msg: "Could not update image on cloudinary"
            })
      }

      const image_url = uploadImage.secure_url



      const isValidSlot = slots.every((slot) => {
         return slot.open && slot.close && typeof slot.open === "string" && typeof slot.close === "string"
      });

      if (!isValidSlot) {
         return res.status(400)
            .json({
               success: false,
               msg: "Invalid slots entered"
            })
      }

      const timingsMap = new Map();

      const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


      for (let i = 0; i < 7; i++) {
         timingsMap.set(daysOfWeek[i], slots)
      }

      const restaurant = await Restaurant.create({
         name,
         description,
         address,
         coordinates: { lat, lon },
         image: image_url,
         timings: timingsMap
      })

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
            msg: "Error while uploading restaurant"
         })
   }
}

const getAllRestaurants = async (req, res) => {

   try {
      const restaurants = await Restaurant.find()
         .select("name description image address")

      if (restaurants.length === 0 || !restaurants) {
         return res.status(400)
            .json({
               success: false,
               msg: "No restaurants found"
            })
      }

      return res.status(200)
         .json({
            success: true,
            data: restaurants
         })

   } catch (error) {
      console.log(error)
      return res.status(500)
         .json({
            success: false,
            msg: "Error while fetching restaurants"
         })
   }
}

const getRestaurant = async (req, res) => {
   try {
      const resId = req.body._id

      const restaurant = await Restaurant.findById(resId)
         .populate({
            path: "categories",
            polpulate: {
               path: "items"
            }
         })

      if (!restaurant) {
         return res.status(400).json({
            success: false,
            msg: "Restaurant not found"
         })
      }

      return res.status(200)
         .json({
            success: true,
            msg: "Restaurant found",
            restaurant
         })
   }
   catch (error) {
      console.log(error)
      return res.status(200).json({
         success: false,
         msg: "An error occured while fetching restaurant"
      })
   }
}


const deleteRestaurant = async (req, res) => {
   const resId = req.body._id


}

export { addRestaurant, getAllRestaurants, getRestaurant, deleteRestaurant }
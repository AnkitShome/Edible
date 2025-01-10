import { Restaurant } from "../models/restaurant.models.js";
import { MenuItem } from "../models/menuItem.models.js";
import { Category } from "../models/category.models.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const addItem = async (req, res) => {
   try {

      const { restaurantId, categoryId, name, description, price } = req.body
      const image = req.file?.path

      if (!restaurantId || !categoryId || !name || !description || !price) {
         return res.status(400)
            .json({
               success: false,
               msg: "All fields are required"
            })
      }

      const restaurant = await Restaurant.findById(restaurantId)

      if (!restaurant) {
         return res.status(404)
            .json({
               success: false,
               msg: "Restaurant not found"
            })
      }

      const categoryExists = restaurant.categories.some(
         (cat) => cat.toString() === categoryId
      );

      if (!categoryExists) {
         return res.status(404)
            .json({
               success: false,
               msg: "Category doesn't exist"
            })
      }

      const uploadImage = await uploadOnCloudinary(image)

      if (!uploadImage) {
         return res.status(400)
            .json({
               success: false,
               msg: "Image cannot be uploaded"
            })
      }

      const image_url = uploadImage.secure_url

      const newItem = await MenuItem.create({
         name,
         image: image_url,
         price,
         description
      })

      const updatedCategory = await Category.findByIdAndUpdate(
         { _id: categoryId },
         { $push: { item: newItem._id } },
         { new: true }
      )

      return res.status(200)
         .json({
            success: true,
            data: newItem,
            msg: "new item added to the menu"
         });

   } catch (error) {
      console.log(error)
      return res.status(500)
         .json({
            success: false,
            msg: "New item could not be created"
         })
   }
}

const removeItem = async (req, res) => {
   try {
      const { restaurantId, categoryId, itemId } = req.body

      if (!restaurantId || !categoryId || !itemId) {
         return res.status(400)
            .json({
               success: false,
               msg: "All details required"
            })
      }

      const restaurant = await Restaurant.findById(restaurantId)

      if (!restaurant) {
         return res.status(404)
            .json({
               success: false,
               msg: "Restaurant not found"
            })
      }

      const category = await Category.findById(categoryId)

      if (!category) {
         return res.status(400)
            .json({
               success: false,
               msg: "Category does not exist"
            })
      }

      const categoryExist = restaurant.categories.some(
         (cat) => cat.toString() === categoryId
      )

      if (!categoryExist) {
         return res.status(400)
            .json({
               success: false,
               msg: "Category does not belong to the restaurant"
            })
      }

      const updatedCategory = await Category.findByIdAndUpdate(
         { _id: categoryId },
         { $pull: { items: itemId } },
         { new: true }
      )

      const menuItem = await MenuItem.findByIdAndDelete({ _id: itemId })

      return res.status(200)
         .json({
            success: true,
            msg: "Menu item removed"
         })
   } catch (error) {
      console.log(error)
      return res.status(500)
         .json({
            success: false,
            msg: "Item cannot be removed"
         })
   }
}

export { addItem, removeItem }
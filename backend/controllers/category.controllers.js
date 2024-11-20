import { Restaurant } from "../models/restaurant.models.js";
import { MenuItem } from "../models/menuItem.models.js";
import { Category } from "../models/category.models.js";

const addCategory = async (req, res) => {

   try {
      const { restaurantId, name } = req.body

      const createCategory = await Category.create({
         name,
      })


      const updatedRestaurant = await Restaurant.findOneAndUpdate(
         { _id: restaurantId },
         { $push: { categories: createCategory._id } },
         { new: true }
      )

      if (!updatedRestaurant) {

         await Category.findByIdAndDelete(createCategory._id)

         return res.status(400)
            .json({
               success: false,
               msg: "Restaurant not found"
            })
      }

      return res.status(200)
         .json({
            success: true,
            msg: `New category added to restaurant ${updatedRestaurant.name}`
         })


   } catch (error) {
      return res.status(500)
         .json({
            success: false,
            msg: "An error occurred while adding category",
            error: error.message
         })
   }
}

export { addCategory }
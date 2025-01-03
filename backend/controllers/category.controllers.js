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

const deleteCategory = async (req, res) => {

   try {
      const { restaurantId, name } = req.body

      if (!restaurantId || !name) {
         return res.status(400)
            .json({
               success: false,
               msg: "Enter restaurant Id and name"
            })
      }
      const category = await Category.findOne({ name })

      if (!category) {
         return res.status(400)
            .json({
               success: false,
               msg: "Category not found"
            })
      }

      const restaurant = await Restaurant.findById(restaurantId)

      if (!restaurant) {
         return res.status(400)
            .json({
               success: false,
               msg: "Restaurant not found"
            })
      }

      const categoryExists = restaurant.categories.some(
         (catId) => catId.toString() === category._id.toString()
      );

      if (!categoryExists) {
         return res.status(400).json({
            success: false,
            msg: "category doesn't exist"
         })
      }

      const menuItems = category.items

      const menuItem = await MenuItem.deleteMany({ _id: { $in: menuItems } })

      restaurant.updateOne({
         $pull: { categories: category._id }
      })

      await Category.findByIdAndDelete(category._id)
  
      return res.status(200).json({
         success: true,
         msg: "Category deleted successfully",
      });

   } catch (error) {
      console.error(error);
      return res.status(500).json({
         success: false,
         msg: "An error occurred while removing the category",
      });
   }


}

export { addCategory }
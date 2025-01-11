import { Restaurant } from "../models/restaurant.models.js";
import { MenuItem } from "../models/menuItem.models.js";
import { Category } from "../models/category.models.js";

const addCategory = async (req, res) => {

   try {
      const { restaurantId, name } = req.body

      if (!restaurantId || !name) {
         return res.status(400)
            .json({
               success: false,
               msg: "Enter all fields"
            })
      }

      const createCategory = await Category.create({
         name,
      })

      //push the category to restaurant
      const updatedRestaurant = await Restaurant.findOneAndUpdate(
         { _id: restaurantId },
         { $push: { categories: createCategory._id } },
         { new: true }
      )

      //if restaurant is not already present
      //delete category
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
      const { restaurantId, categoryId } = req.body

      if (!restaurantId || !categoryId) {
         return res.status(400)
            .json({
               success: false,
               msg: "Enter all fields"
            })
      }
      const category = await Category.findById(categoryId)

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

      //check category in restaurant and provided category are same
      const categoryExists = restaurant.categories.some(
         (catId) => catId.toString() === category._id.toString()
      );

      if (!categoryExists) {
         return res.status(400).json({
            success: false,
            msg: "category doesn't exist"
         })
      }

      //menu items present in a category
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

const editCategory = async (req, res) => {
   try {
      const { restaurantId, categoryId, name } = req.body

      if (!restaurantId || !categoryId || !name) {
         return res.status(400)
            .json({
               success: false,
               msg: "All fields are required"
            })
      }

      const updates = {}
      if (name) updates.name = name

      const restaurant = await Restaurant.findById(restaurantId)

      if (!restaurant) {
         return res.status(400)
            .json({
               success: false,
               msg: "Restaurant not found"
            })
      }

      const categoryExists = restaurant.categories.some(
         (cat) => cat.toString() === categoryId
      )

      if (!categoryExists) {
         return res.status(400)
            .json({
               success: false,
               msg: "Category does not exist in restaurant"
            })
      }

      const category = await Category.findByIdAndUpdate(
         { _id: categoryId },
         { $set: updates },
         { new: true }
      )

      if (!category) {
         return res.status(400)
            .json({
               success: false,
               msg: "Category does not exist"
            })
      }

      return res.status(200)
         .json({
            success: true,
            category,
            msg: "Category successfully updated"
         })

   } catch (error) {
      console.log(error)
      return res.status(500)
         .json({
            success: false,
            msg: "An error occured while updating category ,please try again"
         })
   }
}

export { addCategory, deleteCategory, editCategory }
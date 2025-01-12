import { Restaurant } from "../models/restaurant.models.js";
import { MenuItem } from "../models/menuItem.models.js";
import { Category } from "../models/category.models.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const addItem = async (req, res) => {
   try {
      const { restaurantId, categoryId, name, description, price } = req.body;
      const image = req.file?.path;

      // Validate input
      if (!restaurantId || !categoryId || !name || !price || !description || !image) {
         return res.status(400).json({
            success: false,
            msg: "Enter all fields",
         });
      }

      // Check if restaurant exists
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
         return res.status(400).json({
            success: false,
            msg: "Restaurant does not exist",
         });
      }

      // Check if category exists and belongs to the restaurant
      const category = await Category.findById(categoryId);
      if (!category || !restaurant.categories.includes(categoryId)) {
         return res.status(400).json({
            success: false,
            msg: "Invalid category for the given restaurant",
         });
      }

      // Upload image to Cloudinary
      const uploadImage = await uploadOnCloudinary(image);
      if (!uploadImage) {
         return res.status(400).json({
            success: false,
            msg: "Could not update image on Cloudinary",
         });
      }

      const image_url = uploadImage.secure_url;

      // Create menu item
      const item = await MenuItem.create({
         name,
         description,
         price,
         image: image_url,
         restaurant: restaurantId
      });

      // Link the item to the category
      const updatedCategory = await Category.findByIdAndUpdate(
         categoryId,
         { $push: { items: item._id } },
         { new: true }
      );

      console.log("updated category:", updatedCategory)

      if (!updatedCategory) {
         // Rollback item creation if category update fails
         await MenuItem.findByIdAndDelete(item._id);
         return res.status(400).json({
            success: false,
            msg: "Failed to link item to category",
         });
      }

      return res.status(200).json({
         success: true,
         msg: `New item added to category ${updatedCategory.name}`,
         item,
         updatedCategory,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         success: false,
         msg: "An error occurred while adding the item",
         error: error.message,
      });
   }
};


// const addItem = async (req, res) => {
//    try {
//       console.log(req.body);
//       const { restaurantId, categoryId, name, description, price } = req.body;

//       const image = req.file?.path;

//       // Validate required fields
//       if (!restaurantId || !categoryId || !name || !description || !price) {
//          return res.status(400).json({
//             success: false,
//             msg: "All fields are required",
//          });
//       }

//       // Check if the restaurant exists
//       const restaurant = await Restaurant.findById(restaurantId);
//       if (!restaurant) {
//          return res.status(404).json({
//             success: false,
//             msg: "Restaurant not found",
//          });
//       }

//       // Check if the category exists in the restaurant
//       const categoryExists = restaurant.categories.some(
//          (cat) => cat.toString() === categoryId
//       );

//       if (!categoryExists) {
//          return res.status(404).json({
//             success: false,
//             msg: "Category doesn't exist",
//          });
//       }

//       // Initialize the item creation object
//       let creation = { name, description, price };

//       // Handle image upload if provided
//       if (image) {
//          console.log("Image path:", image);
//          const uploadImage = await uploadOnCloudinary(image);

//          if (!uploadImage) {
//             return res.status(400).json({
//                success: false,
//                msg: "Image cannot be uploaded",
//             });
//          }

//          const image_url = uploadImage.secure_url;
//          creation.image = image_url;
//       }

//       // Add category reference to the menu item
//       creation.category = categoryId;

//       // Create the menu item and save it
//       const newItem = await MenuItem.create(creation);

//       // Link the menu item to the category
//       const updatedCategory = await Category.findByIdAndUpdate(
//          categoryId,
//          { $push: { items: newItem._id } }, // Push the item ID into the category's items array
//          { new: true }
//       );

//       if (!updatedCategory) {
//          return res.status(404).json({
//             success: false,
//             msg: "Failed to link item to category",
//          });
//       }

//       return res.status(200).json({
//          success: true,
//          newItem,
//          updatedCategory,
//          msg: "New item added to the menu and linked to category",
//       });
//    } catch (error) {
//       console.error("Error:", error);
//       return res.status(500).json({
//          success: false,
//          msg: "New item could not be created",
//       });
//    }
// };


const removeItem = async (req, res) => {
   try {
      const { restaurantId, categoryId, itemId } = req.body;

      // Validate input
      if (!restaurantId || !categoryId || !itemId) {
         return res.status(400).json({
            success: false,
            msg: "All details are required",
         });
      }

      // Validate restaurant
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
         return res.status(404).json({
            success: false,
            msg: "Restaurant not found",
         });
      }

      // Validate category
      const category = await Category.findById(categoryId);
      if (!category) {
         return res.status(400).json({
            success: false,
            msg: "Category does not exist",
         });
      }

      // Check if the category belongs to the restaurant
      const categoryExists = restaurant.categories.some(
         (cat) => cat.toString() === categoryId
      );
      if (!categoryExists) {
         return res.status(400).json({
            success: false,
            msg: "Category does not belong to the restaurant",
         });
      }

      // Check if the item exists in the category
      const itemExists = category.items.some(
         (item) => item.toString() === itemId
      );
      if (!itemExists) {
         return res.status(404).json({
            success: false,
            msg: "Item does not exist in the category",
         });
      }

      // Remove the item from the category
      const updatedCategory = await Category.findByIdAndUpdate(
         categoryId,
         { $pull: { items: itemId } },
         { new: true }
      );

      // Delete the item from the database
      await MenuItem.findByIdAndDelete(itemId);

      return res.status(200).json({
         success: true,
         msg: "Menu item removed successfully",
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         success: false,
         msg: "An error occurred while removing the item",
      });
   }
};

const editItem = async (req, res) => {
   try {
      const { restaurantId, categoryId, itemId, name, description, price, image } = req.body

      if (!restaurantId || !categoryId || !itemId || !name) {
         return res.status(400)
            .json({
               success: false,
               msg: "All fields are required"
            })
      }

      const updates = {}
      if (name) updates.name = name
      if (description) updates.description = description
      if (price) updates.price = price
      if (image) {
         const uploadImage = await uploadOnCloudinary(image)

         if (!uploadImage) {
            return res.status(400)
               .json({
                  success: false,
                  msg: "Image could not be uploaded on cloudinary"
               })
         }

         const image_url = uploadImage.secure_url
         updates.image = image_url
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
         (cat) => cat.toString() === categoryId
      )

      if (!categoryExists) {
         return res.status(400)
            .json({
               success: false,
               msg: "Category does not exist in restaurant"
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

      const itemExists = category.items.some(
         (item) => item.toString() === itemId
      );
      if (!itemExists) {
         return res.status(404).json({
            success: false,
            msg: "Item does not exist in the category",
         });
      }

      const item = await MenuItem.findByIdAndUpdate(
         { _id: itemId },
         { $set: updates },
         { new: true }
      )

      if (!item) {
         return res.status(400)
            .json({
               success: false,
               msg: "Menu item does not exist"
            })
      }

      return res.status(200)
         .json({
            success: true,
            item,
            msg: "Menu item updated successfully"
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

export { addItem, removeItem, editItem }
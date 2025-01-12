import { Restaurant } from "../models/restaurant.models.js";
import { MenuItem } from "../models/menuItem.models.js";
import { Category } from "../models/category.models.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const validateAMPMTimeFormat = (time) => {
   const regex = /^(0[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/;
   return regex.test(time);
};

const convertTo24Hour = (time) => {
   const [hourMin, period] = time.split(" ");
   let [hour, minute] = hourMin.split(":");

   hour = parseInt(hour);
   if (period === "AM" && hour === 12) hour = 0; // Midnight
   if (period === "PM" && hour !== 12) hour += 12; // PM, add 12 to hour

   return `${hour.toString().padStart(2, "0")}:${minute}`;
};


const addRestaurant = async (req, res) => {
   try {

      const { name, description, address, lat, lon, open, close } = req.body

      const image = req.file?.path;

      if (!name || !description || !address || !lat || !lon || !image || !open || !close) {

         return res.status(400)
            .json({
               success: false,
               msg: "Enter all required fields"
            })
      }

      if (!validateAMPMTimeFormat(open) || !validateAMPMTimeFormat(close)) {
         return res.status(400).json({
            success: false,
            msg: "Invalid time format. Use HH:mm AM/PM."
         });
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


      const restaurant = await Restaurant.create({
         name,
         description,
         address,
         coordinates: { lat, lon },
         image: image_url,
         timings: { open, close }
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
      const { resId } = req.body

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
      return res.status(500).json({
         success: false,
         msg: "An error occured while fetching restaurant"
      })
   }
}


const deleteRestaurant = async (req, res) => {
   try {
      const { restaurantId } = req.body;

      if (!restaurantId) {
         return res.status(400)
            .json({
               success: false,
               msg: "Enter required field"
            })
      }

      // Find the restaurant by ID
      const restaurant = await Restaurant.findById(restaurantId);

      if (!restaurant) {
         return res.status(404).json({
            success: false,
            msg: "Restaurant not found",
         });
      }

      // Delete related menu items and categories
      const categories = restaurant.categories;

      // Using Promise.all to handle multiple deletions concurrently
      await Promise.all(
         categories.map(async (categoryId) => {
            const category = await Category.findById(categoryId);

            if (category) {
               const menuItems = category.items;

               // Delete all menu items associated with the category
               await MenuItem.deleteMany({ _id: { $in: menuItems } });
            }

            // Delete the category
            await Category.findByIdAndDelete(categoryId);
         })
      );

      // Delete the restaurant itself
      await Restaurant.findByIdAndDelete(restaurantId);

      return res.status(200).json({
         success: true,
         restaurant,
         msg: "Restaurant deleted successfully",
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         success: false,
         msg: "An error occurred while removing the restaurant",
      });
   }
};

const editRestaurant = async (req, res) => {
   try {
      const { restaurantId, name, description, address, image } = req.body;

      if (!restaurantId) {
         return res.status(400).json({
            success: false,
            msg: "Restaurant ID is required",
         });
      }

      const updates = {};
      if (name) updates.name = name;
      if (description) updates.description = description;
      if (address) updates.address = address;

      if (image) {
         const uploadImage = await uploadOnCloudinary(image);
         if (!uploadImage) {
            return res.status(400).json({
               success: false,
               msg: "Image upload failed",
            });
         }
         updates.image = uploadImage.secure_url;
      }

      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
         restaurantId,
         { $set: updates },
         { new: true, runValidators: true }
      );

      if (!updatedRestaurant) {
         return res.status(404).json({
            success: false,
            msg: "Restaurant not found",
         });
      }

      return res.status(200).json({
         success: true,
         updatedRestaurant,
         msg: "Restaurant updated successfully",
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         success: false,
         msg: "Error updating restaurant",
      });
   }
};

export { addRestaurant, getAllRestaurants, getRestaurant, deleteRestaurant, editRestaurant }
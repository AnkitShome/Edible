import { Cart } from "../models/cart.models.js";
import { MenuItem } from "../models/menuItem.models.js"
import { Restaurant } from "../models/restaurant.models.js"

const addToCart = async (req, res) => {
   try {
      const userId = req.user._id;
      const { restaurantId, itemId, amount = 1 } = req.body;

      if (!restaurantId || !itemId) {
         return res.status(400).json({
            success: false,
            msg: "All fields required",
         });
      }

      if (amount < 1 || !Number.isInteger(amount)) {
         return res.status(400).json({
            success: false,
            msg: "Amount must be a positive integer",
         });
      }

      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
         return res.status(400).json({
            success: false,
            msg: "Restaurant not found",
         });
      }

      const item = await MenuItem.findById(itemId);
      if (!item) {
         return res.status(400).json({
            success: false,
            msg: "Item not found",
         });
      }

      if (item.restaurant.toString() !== restaurantId) {
         return res.status(400).json({
            success: false,
            msg: "Item does not belong to the specified restaurant",
         });
      }

      let cart = await Cart.findOne({ user: userId, restaurant: restaurantId });
      if (!cart) {
         cart = await Cart.create({
            user: userId,
            restaurant: restaurantId,
            cartItems: [],
         });
      }

      const existingItem = cart.cartItems.find(
         (cartItem) => cartItem.product.toString() === itemId
      );

      if (existingItem) {
         existingItem.quantity += amount;
         existingItem.totalPrice = existingItem.quantity * item.price;
      } else {
         cart.cartItems.push({
            product: itemId,
            quantity: amount,
            totalPrice: amount * item.price,
         });
      }

      await cart.save();

      return res.status(200).json({
         success: true,
         cart,
         msg: "Item added to cart",
      });
   } catch (error) {
      console.error("Error adding to cart:", error);
      return res.status(500).json({
         success: false,
         msg: "An error occurred while adding item to the cart. Please try again later",
      });
   }
};

// const editAmount = async (req, res) => {
//    try {
//       const userId = req.user._id
//       const { cartId, restaurantId, itemId, increase } = req.body

//       if (!cartId || !restaurantId || increase === undefined || !itemId) {
//          return res.status(400)
//             .json({
//                success: false,
//                msg: "Enter all fields"
//             })
//       }

//       const restaurant = await Restaurant.findById(restaurantId)

//       if (!restaurant) {
//          return res.status(400)
//             .json({
//                success: false,
//                msg: "Restaurant does not exist"
//             })
//       }

//       const cart = await Cart.findById(cartId)

//       if (!cart) {
//          return res.status(400)
//             .json({
//                success: false,
//                msg: "cart not found"
//             })
//       }

//       const item = await MenuItem.findById(itemId)

//       if (!item) {
//          return res.status(400)
//             .json({
//                success: false,
//                msg: "Item not found"
//             })
//       }

//       const existingItem = cart.cartItems.find(
//          (cartItem) => cartItem.product.equals(itemId)
//       )

//       if (!existingItem) {
//          return res.status(400)
//             .json({
//                success: false,
//                msg: "Item not found in cart"
//             })
//       }

//       if (increase === 1) {
//          existingItem.quantity += 1
//          existingItem.totalPrice = existingItem.quantity * item.price
//       }
//       else if (existingItem.quantity === 1) {
//          cart.cartItems = cart.cartItems.filter(
//             (cartItem) => !cartItem.product.equals(itemId)
//          );
//       }
//       else {
//          existingItem.quantity -= 1
//          existingItem.totalPrice = existingItem.quantity * item.price
//       }

//       if (cart.cartItems.length === 0) {
//          await Cart.findByIdAndDelete(cartId)
//       }

//       cart.totalAmount = cart.cartItems.reduce(
//          (total, cartItem) => total + cartItem.totalPrice, 0
//       )

//       await cart.save()

//       return res.status(200)
//          .json({
//             success: true,
//             cart,
//             msg: "Cart updated"
//          })
//    } catch (error) {
//       return res.status(500)
//          .json({
//             success: false,
//             msg: "An error occured while updating cart. Please try again"
//          })
//    }
// }

const deleteCart = async (req, res) => {
   try {
      const userId = req.user._id;
      const { restaurantId } = req.body;

      if (!restaurantId) {
         return res.status(400).json({
            success: false,
            msg: "Restaurant ID is required",
         });
      }

      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
         return res.status(404).json({
            success: false,
            msg: "Restaurant does not exist",
         });
      }

      const cart = await Cart.findOneAndDelete({ user: userId, restaurant: restaurantId });
      if (!cart) {
         return res.status(404).json({
            success: false,
            msg: "Cart not found",
         });
      }

      return res.status(200).json({
         success: true,
         msg: "Cart removed successfully",
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         success: false,
         msg: "An error occurred while removing the cart. Please try again later.",
      });
   }
};

const editAmount = async (req, res) => {
   try {
      const userId = req.user._id;
      const { cartId, restaurantId, itemId, increase } = req.body;

      // console.log("Received data:", { cartId, restaurantId, itemId, increase });

      if (!cartId || !restaurantId || increase === undefined || !itemId) {
         return res.status(400).json({
            success: false,
            msg: "Enter all fields",
         });
      }

      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
         return res.status(400).json({
            success: false,
            msg: "Restaurant does not exist",
         });
      }

      const cart = await Cart.findById(cartId);
      if (!cart) {
         return res.status(400).json({
            success: false,
            msg: "Cart not found",
         });
      }

      const item = await MenuItem.findById(itemId);
      if (!item) {
         return res.status(400).json({
            success: false,
            msg: "Item not found",
         });
      }

      const existingItem = cart.cartItems.find((cartItem) =>
         cartItem.product.equals(itemId)
      );

      // console.log("Existing item:", existingItem);

      if (!existingItem) {
         return res.status(400).json({
            success: false,
            msg: "Item not found in cart",
         });
      }

      if (increase === '1') {
         existingItem.quantity += 1;
         existingItem.totalPrice = existingItem.quantity * item.price;
      } else if (existingItem.quantity === 1) {
         cart.cartItems = cart.cartItems.filter(
            (cartItem) => !cartItem.product.equals(itemId)
         );
      } else {
         existingItem.quantity -= 1;
         existingItem.totalPrice = existingItem.quantity * item.price;
      }

      // console.log("Updated cart items:", cart.cartItems);

      if (cart.cartItems.length === 0) {
         // console.log("Cart is empty, deleting...");
         await Cart.findByIdAndDelete(cartId);
         return res.status(200).json({
            success: true,
            msg: "Cart deleted as it became empty",
         });
      }

      cart.totalAmount = cart.cartItems.reduce(
         (total, cartItem) => total + cartItem.totalPrice,
         0
      );

      console.log("Cart total amount:", cart.totalAmount);

      await cart.save();

      return res.status(200).json({
         success: true,
         cart,
         msg: "Cart updated",
      });
   } catch (error) {
      console.error("Error in editAmount:", error);
      return res.status(500).json({
         success: false,
         msg: "An error occurred while updating cart. Please try again",
      });
   }
};


export { addToCart, editAmount, deleteCart }
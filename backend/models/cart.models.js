import mongoose from "mongoose";

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
   product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
   },
   quantity: {
      type: Number,
      default: 1,
      min: 1,
   },
   totalPrice: {
      type: Number,
      required: true,
   },
});

// Cart Schema
const cartSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      restaurant: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Restaurant",
         required: true,
      },
      cartItems: [cartItemSchema],
      totalAmount: {
         type: Number,
         required: true,
         default: 0,
      },
      createdAt: {
         type: Date,
         default: Date.now,
      },
   },
   { timestamps: true }
);

// Method to update total amount
cartSchema.methods.updateTotalAmount = function () {
   this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.totalPrice,
      0
   );
   return this.totalAmount;
};

// Pre-save hook to update total amount
cartSchema.pre("save", function (next) {
   this.updateTotalAmount();
   next();
});

// Export Cart Model
export const Cart = mongoose.model("Cart", cartSchema);

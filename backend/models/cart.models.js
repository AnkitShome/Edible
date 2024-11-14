import mongoose, { mongo } from "mongoose";

const cartItemSchema = mongoose.Schema({
   product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true
   },
   quantity: {
      type: Number,
      default: 1,
      min: 1
   },
   totalPrice: {
      type: Number,
      required: true
   }
})

const cartSchema = mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   restaurant: {
      type: mongoose.Schema.Types.ObjetcId,
      ref: "Restaurant"
   },
   cartItems: [cartItemSchema],
   totalAmount: {
      type: Number,
      required: true
   },
   createdAt: {
      type: Date,
      default: date.now()
   }
}, { Timestamp: true })

cartSchema.methods.updateTotalAmount = function () {
   this.totalAmount = cartItem.reduce((total, item) => total + this.totalPrice, 0)
   return this.totalAmount
}

cartSchema.pre("save", function (next) {
   this.updateTotalAmount()
   next()
})

export const Cart = mongoose.model("Cart", cartSchema);
import mongoose, { Schema } from "mongoose";

const orderItemSchema = Schema({
   product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem"
   },
   quantity: {
      type: Number,
      required: true
   }
})

const orderSchema = Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   },
   Restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant"
   },
   totalPrice: {
      type: Number,
      required: true
   },
   item: [orderItemSchema],
   status: {
      type: String,
      enum: ["Pending", "Accepted", "Delivered", "Out for delivery", "Cancelled"],
      default: "Pending"
   },
   paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending"
   },
   paymentMethod: {
      type: String,
      enum: ["UPI", "Card", "Cash"]
   },
   deliveryAddress: {
      type: String,
      required: true
   },
   orderedAt: {
      type: Date,
      default: date.now,
      required: true
   }
}, { Timestamps: true })

export const Order = mongoose.model("Order", orderSchema);
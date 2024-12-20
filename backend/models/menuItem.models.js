import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   ratings: {
      type: Number,
      default: 0
   },
   isOpen: {
      type: Boolean,
      default: false
   }
}, { timestamps: true })

export const MenuItem = mongoose.model("MenuItem", menuItemSchema);
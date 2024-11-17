import mongoose from "mongoose";

const timeSlotsSchema = new mongoose.Schema({
   open: { type: String, required: true },
   close: { type: String, required: true }
});

// Restaurant schema with timings as an object where the key is the day
const restaurantSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true
   },
   description: {
      type: String,
   },
   address: {
      type: String,
      required: true
   },
   coordinates: {
      lat: { type: Number },
      lon: { type: Number }
   },
   image: {
      type: String,
      required: true
   },
   rating: {
      type: Number,
      default: 0
   },
   reviews: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Reviews"
      }
   ],
   category: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Category"
      }
   ],
   timings: {
      type: Map,
      of: [timeSlotsSchema]
   },
   isOpen: {
      type: Boolean,
      default: false
   },
   isFeatured: {
      type: Boolean,
      default: false
   }

}, { timestamps: true });

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);

import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true
   },
   description: {
      type: String,
   },
   location: {
      address: {
         type: String,
         required: true
      },
      coordinates: {
         lat: { type: Number },
         lon: { type: Number }
      }
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
   menu: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "MenuItem"
      }
   ],
   openingHours: {
      open: {
         type: String,
         required: true
      },
      close: {
         type: String,
         required: true
      }
   },
   isFeatured: {
      type: Boolean,
      default: false
   }

}, { timestamps: true })

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
import mongoose, { Schema } from "mongoose";

const addressSchema = new mongoose.Schema({
   type: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home"
   },
   description: {
      type: String,
      trim: true
   },
   coordinates: {
      lat: {
         type: Number,
         min: -90,
         max: 90,
      },
      lon: {
         type: Number,
         min: -180,
         max: 180,
      }
   }
})

const profileSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   firstName: {
      type: String,
      required: true
   },
   lastName: {
      type: String,
      required: true
   },
   phoneNumber: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   avatar: {
      type: String
   },
   orderHistory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
   },
   address: {
      addressSchema
   }

}, { timestamps: true })

export const Profile = mongoose.model("Profile", profileSchema);
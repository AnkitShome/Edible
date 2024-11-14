import mongoose, { Schema } from "mongoose";

const reviewSchema = Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant"
   },
   rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
   },
   comments: {
      type: String
   }
}, { Timestamps: true })

export const Review = mongoose.model("Review", reviewSchema);
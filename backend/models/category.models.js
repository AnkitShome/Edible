import mongoose, { Schema } from "mongoose"
import { Restaurant } from "./restaurant.models"

const categorySchema = Schema({
   restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
   },
   name: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   }
}, { timestsamps: true })

export const Category = mongoose.model("Category", categorySchema)
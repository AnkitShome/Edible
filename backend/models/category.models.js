import mongoose, { Schema } from "mongoose"

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
   items: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "MenuItem"
      }
   ],
   description: {
      type: String,
      required: true
   }
}, { timestamps: true })

export const Category = mongoose.model("Category", categorySchema)
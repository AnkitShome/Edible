import mongoose, { Schema } from "mongoose"

const categorySchema = Schema({
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
}, { timestamps: true })

export const Category = mongoose.model("Category", categorySchema)
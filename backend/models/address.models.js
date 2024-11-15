import mongoose from "mongoose"

const addressSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true
   },
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
}, { timestamps: true }
)

export const Address = mongoose.model("Address", addressSchema);
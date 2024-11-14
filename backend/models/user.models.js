import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

const Address = mongoose.model("Address", addressSchema);

const userSchema = new mongoose.Schema(
   {
      username: {
         type: String,
         required: true,
         trim: true,
      },
      email: {
         type: String,
         required: true,
         trim: true,
         match: [/.+\@.+\..+/]
      },
      password: {
         type: String,
         required: true,
         trim: true,
      },
      firstName: {
         type: String,
         required: true,
      },
      lastName: {
         type: String,
         required: true,
      },
      phoneNumber: {
         type: String,
         required: true,
         match: [/^\+?[0-9\s-]{7,15}$/]
      },
      address: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Address"
      },
      cartDetails: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Cart"
      },
      refreshToken: {
         type: String,
         default: null
      },
   }
   , { timestamps: true }
)

userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) next()
   this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.createAccessToken = function () {
   return jwt.sign(
      {
         _id: this._id,
         username: this.username,
         email: this.email
      },
      process.env.ACCESS_TOKEN_SECRET,
   )
}

userSchema.methods.createRefreshToken = function () {
   return jwt.sign(
      {
         _id: this._id
      },
      process.env.REFRESH_TOKEN_SECRET
   )
}

export const User = mongoose.model("User", userSchema);
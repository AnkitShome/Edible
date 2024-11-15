import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"
import { OTP } from "../models/OTP.models.js";

const registerAdmin = async (req, res) => {
   try {
      const { adminPassword, firstName, lastName, username, email, password, phoneNumber, otp } = req.body

      const requiredFields = ["adminPassword", "username", "email", "password", "firstName", "lastName", "phoneNumber", "otp"];

      if (!requiredFields.every(field => req.body[field])) {
         return res.status(400).json({
            success: false,
            message: "All fields are required"
         })
      }

      if (adminPassword !== process.env.ADMIN_PASS) {
         return res.status(401).json({
            success: false,
            message: "Admin password is incorrect"
         })
      }

      const user = await User.findOne({ $or: [{ email }, { username }] });

      if (user) {
         return res.status(409).json({
            success: false,
            message: "User is already registered"
         });
      }

      const latestOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

      if (latestOtp.length === 0) {
         return res.status(400).json({
            success: false,
            msg: "No OTP found for this email"
         });
      }

      if (otp !== latestOtp[0].otp) {
         return res.status(401).json({
            success: false,
            msg: "Incorrect OTP entered"
         });
      }


      const newUser = await User.create({
         firstName,
         lastName,
         username,
         email,
         password,
         phoneNumber,
         role: "admin"
      });

      const newuser = await User.findById(newUser._id).select("-password -refreshToken");

      return res.status(201).json({
         success: true,
         newuser,
         message: "Admin created successfully"
      });

   } catch (error) {
      console.log(error);
      return res.status(500).json({
         success: false,
         message: "User cannot be registered. Please try again later"
      });
   }
};

export { registerAdmin };

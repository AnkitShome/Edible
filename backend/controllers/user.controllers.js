import bcrypt from "bcrypt"
import otpGenerator from "otp-generator"
import { otpTemplate } from "../utils/emailTemplate.js";
import { User } from "../models/user.models.js";
import { OTP } from "../models/otp.models.js";
import jwt from "jsonwebtoken"
import { mailSender } from "../utils/mailSender.utils.js";

const generateRefreshAndAccessToken = async (userId) => {
   try {
      const user = await User.findById(userId)

      const accessToken = user.createAccessToken();
      const refreshToken = user.createRefreshToken();

      user.refreshToken = refreshToken

      await user.save({ validateBeforeSave: false })

      return { accessToken, refreshToken }
   } catch (error) {
      return res.status(500).json({
         success: false,
         msg: "Something went wrong while generating referesh and access token"
      })
   }
}

const sendOtp = async (req, res) => {
   try {
      //take email
      const { email } = req.body

      //check user present
      const existingUser = await User.findOne({ email })

      if (existingUser) {
         return res.status(400).json({
            success: false,
            msg: "User is already present, can't send otp"
         })
      }

      //generate otp
      let otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })

      //check otp already present or not
      while (await OTP.findOne({ otp })) {
         otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
      }

      const code = await OTP.create({
         otp,
         email
      })

      try {
         await mailSender(email, "Verification Email from EDIBLE", otpTemplate(otp));
         console.log("Email sent successfully");
      }

      catch (emailError) {
         console.error("Error while sending email:", emailError);
         // Rollback OTP creation if email fails
         await OTP.deleteOne({ _id: code._id });
         return res.status(500).json({
            success: false,
            msg: "Failed to send OTP email. Please try again.",
         });
      }

      return res.status(201).json({
         success: true,
         code,    //otp data for debugging
         msg: "OTP sent"
      })

   }
   catch (error) {
      return res.status(500).json({
         success: false,
         msg: "Error sending OTP, try again"
      })
   }

}



const registerUser = async (req, res) => {
   try {
      const { firstName, lastName, username, email, password, phoneNumber, otp } = req.body

      const requiredFields = ["username", "email", "password", "firstName", "lastName", "phoneNumber", "otp"];

      if (!requiredFields.every(field => req.body[field])) {
         return res.status(400).json({
            success: false,
            message: "All fields are required"
         })
      }

      //check if user is present 
      const user = await User.findOne({ $or: [{ email }, { username }] })

      if (user) {
         return res.status(404).json({
            success: false,
            message: "User is already registered"
         })
      }

      //search for otp
      const latestOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)

      if (latestOtp.length === 0) {
         return res.status(400).json({
            success: false,
            msg: "No otp found for this email"
         })
      }

      //otp provided is same in db
      if (otp !== latestOtp[0].otp) {
         return res.status(401).json({
            success: false,
            msg: "Incorrect otp entered"
         })
      }

      //create user
      const newUser = await User.create({
         firstName,
         lastName,
         username,
         email,
         password,
         phoneNumber
      })

      const newuser = await User.findById(newUser._id).select("-password -refreshToken")

      await OTP.deleteMany({ email });

      return res.status(201).json({
         success: true,
         newuser,
         message: "Account has been created"
      })

   } catch (error) {
      console.log(error)
      return res.status(500).json({
         success: false,
         message: "User cannot be registered. Please try again later"
      })
   }
}



const loginUser = async (req, res) => {
   try {
      const { email, password } = req.body

      // console.log(req.protocol) //debug

      if (!email || !password) {
         return res.status(401).json({
            success: false,
            msg: "Email and password required"
         })
      }

      const user = await User.findOne({ email });

      if (!user) {
         return res.status(400).json({
            success: false,
            message: "No User found"
         })
      }

      if (!(await bcrypt.compare(password, user.password))) {
         console.log(password)
         console.log(user.password)
         return res.status(400).json({
            success: false,
            message: "Invalid password entered"
         })
      }

      const accessToken = user.createAccessToken();
      const refreshToken = user.createRefreshToken();

      user.refreshToken = refreshToken

      await user.save({ validateBeforeSave: false })

      const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

      const options = {
         httpOnly: true,
         secure: false
         // secure: true,
         // secure: process.env.NODE_ENV === "production",
      }

      return res
         .status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", refreshToken, options)
         .json({
            success: true,
            data: loggedInUser, refreshToken, accessToken,
            message: "User logged in"
         })


   } catch (error) {
      console.log(error)   //for debugging
      return res.status(500).json({
         success: false,
         message: "Cannot Log in. Please try again."
      })
   }
}



const logoutUser = async (req, res) => {
   try {
      await User.findByIdAndUpdate(
         req.user._id,
         {
            $set: {
               refreshToken: undefined
            }
         },
         { new: true }
      )

      const options = {
         httpOnly: true,
         secure: false,
         // secure: true,
         // secure: process.env.NODE_ENV === "production",
      }



      return res.status(200)
         .clearCookie("accessToken", options)
         .clearCookie("refreshToken", options)
         .json({
            success: true,
            msg: "User logged out"
         })

   }
   catch (error) {
      return res.status(500)
         .json({
            success: false,
            msg: "User cannot be logged out. Please try again later"
         })
   }
}

const refreshAccessToken = async (req, res) => {
   try {
      const incomingRefreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");
      // console.log("Incoming Refresh Token:", incomingRefreshToken, "\n");

      if (!incomingRefreshToken) {
         return res.status(401).json({
            success: false,
            msg: "Unauthorized request",
         });
      }

      const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

      const user = await User.findById(decodedToken?._id);

      if (!user) {
         return res.status(401).json({
            success: false,
            msg: "Refresh token is expired or invalid",
         });
      }

      const options = {
         httpOnly: true,
         secure: false
         // secure: process.env.NODE_ENV === "production",
      };


      const { accessToken, refreshToken: newRefreshToken } = await generateRefreshAndAccessToken(user._id);
      // console.log("New Refresh Token:", newRefreshToken, "\n");

      res.status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", newRefreshToken, options)
         .json({
            success: true,
            accessToken,
            refreshToken: newRefreshToken,
            msg: "Access token and refresh token renewed",
         });
   } catch (error) {
      console.log("Error in refreshAccessToken:", error);
      return res.status(500).json({
         success: false,
         msg: "Tokens cannot be generated. Please try again later",
      });
   }
};


const changePassword = async (req, res) => {

   try {
      const { oldPassword, newPassword, confirmPassword } = req.body

      if (!(oldPassword || newPassword || confirmPassword)) {
         return res.status(400)
            .json({
               success: false,
               msg: "Enter all fields"
            })
      }

      const user = await User.findById(req.user._id)

      if (!(await bcrypt.compare(oldPassword, user.password))) {
         return res.status(401)
            .json({
               success: false,
               msg: "Password entered is incorrect"
            })
      }

      if (oldPassword === newPassword) {
         return res.status(401)
            .json({
               success: false,
               msg: "New password should be different"
            })
      }

      if (newPassword !== confirmPassword) {
         return res.status(401)
            .json({
               success: false,
               msg: "Confirm your password"
            })
      }

      user.password = newPassword
      await user.save({ validateBeforeSave: false })

      return res.status(200)
         .json({
            success: true,
            msg: "Password  changed"
         })

   } catch (error) {
      console.log(error)
      return res.status(500)
         .json({
            success: false,
            msg: "An error occured while changing password"
         })
   }
}

const updateUser = async (req, res) => {
   try {
      const { password, phoneNumber, username, firstName, lastName, address } = req.body

      if (!password) {
         return res.status(401)
            .json({
               success: false,
               msg: "Enter password"
            })
      }

      const user = await User.findById(req.user._id)

      if (!(await bcrypt.compare(password, user.password) || !user)) {
         return res.status(401)
            .json({
               success: false,
               msg: "Enter correct password"
            })
      }

      if (phoneNumber) user.phoneNumber = phoneNumber
      if (username) user.username = username
      if (firstName) user.firstName = firstName
      if (lastName) user.lastName = lastName
      if (address) user.address = address

      await user.save({ validateBeforeSave: false })

      return res.status(200)
         .json({
            success: true,
            msg: "User details updated"
         })

   } catch (error) {
      console.log(error)
      return res.status(500)
         .json({
            success: false,
            msg: "An error occured while updating user details"
         })

   }
}



export { registerUser, loginUser, sendOtp, logoutUser, refreshAccessToken, changePassword, updateUser }
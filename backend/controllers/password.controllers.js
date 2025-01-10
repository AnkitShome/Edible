import crypto from "crypto";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import { User } from "../models/user.models.js";
import { OTP } from "../models/OTP.models.js";
import { mailSender } from "../utils/mailSender.utils.js";
import { otpTemplate } from "../utils/emailTemplate.js";

// Forgot Password Function
const forgotPassword = async (req, res) => {
   try {
      const { email } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(404).json({
            success: false,
            msg: "User not found",
         });
      }

      // Generate OTP
      let otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

      // Ensure OTP uniqueness
      while (await OTP.findOne({ otp })) {
         otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
      }

      // Save OTP with expiration time (e.g., 15 minutes)
      const otpRecord = await OTP.create({
         otp,
         email
      });

      console.log(otpRecord)

      try {
         // Send OTP email
         await mailSender(email, "Reset Password mail from EDIBLE", otpTemplate(otp));
         console.log("Email sent successfully");

      }
      catch (emailError) {
         console.error("Error while sending email:", emailError);

         // Delete OTP record if email fails
         await OTP.deleteOne({ _id: otpRecord._id });

         return res.status(500).json({
            success: false,
            msg: "Failed to send OTP email. Please try again.",
         });
      }

      return res.status(201).json({
         success: true,
         otpRecord,
         msg: "Reset password OTP sent successfully",
      });

   } catch (error) {
      console.error("Error in forgotPassword:", error);

      return res.status(500).json({
         success: false,
         msg: "An error occurred. Please try again later.",
      });
   }
};

// Reset Password Function
const resetPassword = async (req, res) => {
   try {
      const { email, otp, password } = req.body;

      if (!email || !otp || !password) {
         return res.status(400).json({
            success: false,
            msg: "All fields are required",
         });
      }

      // Find the user
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(404).json({
            success: false,
            msg: "User not found",
         });
      }

      // Find the latest OTP for the given email
      const otpRecord = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

      if (!otpRecord) {
         return res.status(400).json({
            success: false,
            msg: "OTP not found",
         });
      }

      console.log(otpRecord)
      // Validate OTP (check if it is correct and not expired)
      if (otp !== otpRecord[0].otp) {
         return res.status(400).json({
            success: false,
            msg: "Incorrect OTP",
         });
      }
      console.log(password)

      user.password = password;

      await user.save({ validateBeforeSave: false });

      // Delete all OTP records for the user after password reset
      await OTP.deleteMany({ email });

      return res.status(200).json({
         success: true,
         msg: "Password reset successfully",
      });
   } catch (error) {
      console.error("Error in resetPassword:", error);

      return res.status(500).json({
         success: false,
         msg: "Failed to reset password. Please try again later.",
      });
   }
};

export { forgotPassword, resetPassword };

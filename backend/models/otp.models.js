import mongoose from "mongoose";
import { mailSender } from "../utils/mailSender.utils.js";
import { otpTemplate } from "../utils/emailTemplate.js";

const OTPSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
   },
   otp: {
      type: String,
      required: true,
   },
   createdAt: {
      type: Date,
      default: Date.now(),
   },
});

OTPSchema.methods.sendVerificationEmail = async function () {
   try {
      const response = await mailSender(
         this.email,
         "Verification Email from EDIBLE",
         otpTemplate(this.otp)
      )
      console.log("Email sent successfully ", response);
   } catch (error) {
      console.log("error while sending email: ", error);
      throw error;
   }
}

OTPSchema.pre("save", async function (next) {
   if (!this.isNew) next();
   await this.sendVerificationEmail()
   next();
})

export const OTP = mongoose.model("OTP", OTPSchema);
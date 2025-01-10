import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
   {
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
         default: () => Date.now(), // Use high-resolution time
         expires: 900, // Optional: TTL (time-to-live) index to auto-delete after 15 minutes
      },
   },
   {
      timestamps: true,
   }
);

const OTP = mongoose.model("OTP", otpSchema);
export { OTP };

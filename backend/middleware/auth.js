import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"

const verifyJWT = async (req, res) => {
   try {
      //get the token
      //decode the token
      //check for user in database
      //if present req.user

      const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", "")

      if (!token) {
         return res.status(400).json({
            success: false,
            message: "Token verification failed"
         })
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

      const user = await User.findbById(decodedToken._id).select("-password -refreeshToken")

      if (!user) {
         return res.status(400).json({
            success: false,
            message: "User not found"
         })
      }

      req.user = user

      return res.status(201).json({
         success: true,
         msg: "Token verified successfully"
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Token access failed. Please try again"
      })
   }
}

export { verifyJWT }
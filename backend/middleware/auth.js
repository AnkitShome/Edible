import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"

const auth = async (req, res) => {
   try {
      //get the token
      //decode the token
      //check for user in database
      //if present req.user

      const token = req.cookie?.accessToken || req.header("Authorization").replace("Bearer ", "")

      if (!token) {
         return res.status(400).json({
            success: false,
            message: "Token verification failed"
         })
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

      const user = User.findbyId(decodedToken._id)

      if (!user) {
         return res.status(400).json({
            success: false,
            message: "User not found"
         })
      }

      req.user = user

      return res.status(201).json({
         success: ture
      })

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Token access failed. Please try again"
      })
   }
}
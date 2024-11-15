import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const verifyJWT = async (req, res, next) => {
   try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
         return res.status(401).json({
            success: false,
            message: "Token verification failed: No token provided"
         });
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decodedToken._id).select("-password -refreshToken");

      if (!user) {
         return res.status(400).json({
            success: false,
            message: "Invalid Access Token: User not found"
         });
      }

      req.user = user;
      next();

   } catch (error) {
      console.error(error); // For debugging purposes
      return res.status(500).json({
         success: false,
         message: "Token access failed. Please try again."
      });
   }
};

const isAdmin = async (req, res, next) => {
   try {
      if (req.user.role !== "admin") {
         return res.status(403)
            .json({
               success: false,
               message: "Admin access only"
            })
      }

      next();
   } catch (error) {
      console.log(error)
      res.status(500)
         .json({
            success: false,
            message: "An error occured while verifying admin"
         })
   }
}

export { verifyJWT, isAdmin };

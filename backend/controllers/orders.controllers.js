// import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"
// import { Order } from "../models/order.models.js";
// import { User } from "../models/user.models.js";

// const getPreviousOrders = async (req, res) => {
//    try {
//       const user = await User.findById(req.user._id)

//       if (!user) {
//          return res.status(400)
//             .json({
//                success: false,
//                msg: "No user found"
//             })
//       }

//       const userId = user.id

//       const orders = await Order.find(
//          { $and: [{ user: userId }, { status: "Delivered" }] }
//       )
//          .sort({ createdAt: -1 })
//          .populate("user")

//       if (orders.length === 0) {
//          return res.status(200)
//             .json({
//                success: true,
//                orders: [],
//                msg: "No orders yet"
//             })
//       }

//       return res.status(200)
//          .json({
//             success: true,
//             orders,
//             msg: "Order details fetched"
//          })

//    } catch (error) {
//       console.log(error)
//       return res.status(500)
//          .json({
//             success: false,
//             msg: "Error occured. Please try again"
//          })
//    }
// }

// export { getPreviousOrders }
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import 'dotenv/config'
import connectDB from "./config/mongodb.js"

//App config
const app = express()
const port = 4000

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(cors())
app.use(cookieParser())
connectDB()

import userRouter from "./routes/user.routes.js"
import restaurantRouter from './routes/restaurant.routes.js'
import adminRouter from './routes/admin.routes.js'
import categoryRouter from './routes/category.routes.js'
import itemRouter from "./routes/menuItem.routes.js"

app.use("/api/register", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/restaurant", restaurantRouter)
app.use("/api/category", categoryRouter)
app.use("/api/item", itemRouter)

app.get('/', (req, res) => {
   res.send("API Working")
})

app.listen(port, () => console.log(`Server is running on port: ${port}`))

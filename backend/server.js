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

app.use("/api/register", userRouter)

app.get('/', (req, res) => {
   res.send("API Working")
})

app.listen(port, () => console.log(`Server is running on port: ${port}`))

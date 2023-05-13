import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import fileUpload from "express-fileupload"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import cookieSession from "cookie-session"
// import routers
import userRouter from "./routes/userRouter.js"
import categoryRouter from "./routes/categoryRouter.js"
import brandRouter from "./routes/brandRouter.js"
import uploadRouter from "./routes/upload.js"
import productRouter from "./routes/productRouter.js"
import reviewRouter from "./routes/reviewRouter.js"
import paymentRouter from "./routes/paymentRouter.js"

dotenv.config()
const app = express()
app.use(express.json())
app.use(cookieParser())

const corsOptions = {
 origin: true,
 credentials: true, //access-control-allow-credentials:true
 optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(
 fileUpload({
  useTempFiles: true,
 })
)

const PORT = process.env.PORT || 5000
const URI = process.env.MONGODB_URL

// connect to mongodb
mongoose.connect(
 URI,
 {
  useNewUrlParser: true,
  useUnifiedTopology: true,
 },
 (err) => {
  if (err) throw err
  console.log("Connected to MongoDB")
 }
)

app.use("/user", userRouter)
app.use("/api", categoryRouter)
app.use("/api", brandRouter)
app.use("/api", uploadRouter)
app.use("/api", productRouter)
app.use("/api", reviewRouter)
app.use("/api", paymentRouter)
app.listen(PORT, async () => {
 console.log(`Running at ${PORT}`)
})

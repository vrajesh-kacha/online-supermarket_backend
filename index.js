import express from "express";
import dotenv from "dotenv";
import { connectiondb } from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import cloudinary from "cloudinary";
import Razorpay from "razorpay";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
dotenv.config();

app.use(
  cors({
    origin: process.env.DOMAIN,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_ID,
  key_secret: process.env.RAZORPAY_API_SECRET,
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


connectiondb();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(3000,()=>{
  console.log("api running")
})

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", categoryRoutes);
app.use("/api/v1/products", productRoutes);


export default app;

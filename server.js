import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from  "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controller/clerkWebhooks.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";

connectDB();
connectCloudinary();
const app = express()
app.use(cors()) //enable cross-origin resourse sharing


// middlewares
app.use(express.json()) // to parse json data in request body
app.use(clerkMiddleware())

// api to listen clerk webhooks
app.use("/api/clerk" , clerkWebhooks);

app.get('/' ,(req , res)=> res.send("API is working "))
app.use('/api/user' , userRouter);
app.use('/api/hotels' , hotelRouter);
app.use('/api/rooms' , roomRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT , () => console.log(`Server running on port ${PORT}`));
import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from  "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controller/clerkWebhooks.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import userRouter from "./routes/userRoutes.js";

connectDB();
connectCloudinary();
const app = express()
app.use(cors()) //enable cross-origin resourse sharing


// middlewares
// middlewares
app.use(express.json());
app.use(cors());

// public routes (no Clerk auth)
app.get("/", (req, res) => res.send("API is working"));

// Clerk webhook (no auth)
app.use("/api/clerk", clerkWebhooks);

// PROTECTED routes (Clerk required)
app.use("/api/user", clerkMiddleware(), userRouter);
app.use("/api/bookings", clerkMiddleware(), bookingRouter);

// PUBLIC routes
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT , () => console.log(`Server running on port ${PORT}`)); 
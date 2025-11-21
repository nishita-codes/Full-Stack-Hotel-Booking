import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { checkAvailabilityAPI, createBooking, getOwnerBookings, getUserBooking } from "../controller/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability' , checkAvailabilityAPI);
bookingRouter.post('/book' , protect , createBooking);
bookingRouter.get('/user' , protect , getUserBooking);
bookingRouter.get('/hotel' , protect , getOwnerBookings);

export default bookingRouter;
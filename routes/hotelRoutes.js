import express from "express";
import { registerHotel } from "../controller/hotelController";
import { protect } from "../middleware/authMiddleware";

const  hotelRouter =  express.Router();

hotelRouter.post('/' , protect , registerHotel);

export default hotelRouter;
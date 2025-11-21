import express from 'express';
import { getUserData, storeUserSearchCities } from '../controller/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/' , protect , getUserData);
userRouter.post('/store-recent-search' , protect , storeUserSearchCities);

export default userRouter;
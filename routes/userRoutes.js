import express from 'express';
import { storeUserSearchCities } from '../controller/userController';

const userRouter = express.Router();

userRouter.get('/' , protect , getUserData);
userRouter.post('/store-recent-search' , protect , storeUserSearchCities);

export default userRouter;
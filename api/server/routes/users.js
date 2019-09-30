/* eslint-disable linebreak-style */
import { Router } from 'express';
import userValidation from '../middlewares/userValidation';
import userController from '../controllers/users';
import Authorization from '../middlewares/Authorization';

const userRoute = Router();

userRoute.patch('/:email/verify', Authorization.verifyAdmin, userValidation.verifyUserValidation, userController.verifyAUser);

export default userRoute;

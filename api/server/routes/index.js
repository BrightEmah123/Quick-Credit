/* eslint-disable linebreak-style */
import express from 'express';
import authRoute from './auth';
import userRoute from './users';
import loanRoute from './loans';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/loans', loanRoute);
router.use('/users', userRoute);

export default router;

import express from 'express';
import { googleAuth, Login, logout, Myprofile, refreshAccessToken, resendOtp, resetPassword, Signup, updatePassword, UpdateProfile, userforgotPassword, verifyOtp } from '../../controllers/auth/auth.controller.js';
import { Auth } from '../../middlewares/auth.middleware.js';
import { validateUser,handleValidationErrors } from '../../middlewares/userValidation.js';
const router=express.Router();

router.post('/auth/signup',  validateUser,handleValidationErrors,Signup);

router.post('/auth/verify',verifyOtp);

router.post('/auth/login',Login);
router.post('/auth/googleAuth',googleAuth)

router.post('/auth/refreshToken',refreshAccessToken);
router.post('/auth/logout',logout);

router.post('/auth/forgotPassword',userforgotPassword);

router.post('/auth/resetPassword/:token',resetPassword);
router.post('/auth/resendOtp',resendOtp);

router.patch('/auth/update-password',Auth,updatePassword);

router.get("/auth/me",Auth , Myprofile);

router.patch("/auth/update",Auth,UpdateProfile);

export default router;
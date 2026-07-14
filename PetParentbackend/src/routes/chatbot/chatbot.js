import express from 'express';
import { getpetactivity, getpetdetails, getpetinfo, getUserInfo, sendOtp, verifyOtp } from '../../controllers/chatbot/chatbot.js';
export const chatRouter = express.Router();


chatRouter.post('/userinfo',getUserInfo)
chatRouter.post('/getpetinfo',getpetinfo)
chatRouter.post('/getpetdetails',getpetdetails)
chatRouter.post("/getactivity",getpetactivity)
chatRouter.post("/sendOtp",sendOtp)
chatRouter.post("/verifyOtp",verifyOtp)
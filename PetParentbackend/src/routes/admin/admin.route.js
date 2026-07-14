import express from 'express'
import { adminforgotpassword, Adminlogin, Adminlogout, Adminsign, adminUpdate, Getdashbord, refreshaccessToken } from '../../controllers/admin/adminAuth.controller.js';
import { adminAuth, Auth } from '../../middlewares/auth.middleware.js';
import { adminOnly } from '../../middlewares/admin.middleware.js';


const adminrouter = express.Router();


adminrouter.post("/admin/signup",Adminsign )
adminrouter.post("/admin/forgotPassword",adminforgotpassword)
adminrouter.post("/admin/login" , Adminlogin)
adminrouter.post("/admin/refreshToken" , refreshaccessToken)
adminrouter.post("/admin/logout" , Adminlogout)
adminrouter.patch("/admin/update-password" , adminAuth , adminUpdate)
adminrouter.get("/admin/dashboard" , adminAuth ,adminOnly , Getdashbord)

export default adminrouter;
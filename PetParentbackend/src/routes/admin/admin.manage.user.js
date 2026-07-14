import express from 'express'
import { adminAuth, Auth } from '../../middlewares/auth.middleware.js'
import { adminOnly } from '../../middlewares/admin.middleware.js'
import { Deleteuser, Getalluser, Singleuser, updateUserStatus } from '../../controllers/admin/adminUser.controller.js'
// import { updateUserStatus, Deleteuser, Getalluser } from '../../controllers/admin/adminUser.controller.js'

const userRouter = express.Router()


userRouter.get("/admin/users" , adminAuth , adminOnly , Getalluser)
userRouter.patch("/admin/users/status/:slug" , adminAuth , adminOnly , updateUserStatus
)
userRouter.get("/admin/user/:slug",adminAuth,adminOnly,Singleuser)
userRouter.delete("/admin/users/delete/:slug" , adminAuth ,adminOnly , Deleteuser)



export default userRouter;
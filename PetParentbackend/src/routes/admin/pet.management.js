import express from 'express'
import { adminAuth, Auth } from '../../middlewares/auth.middleware.js'
import { adminOnly } from '../../middlewares/admin.middleware.js'
//import { Getallpet, Singlepet, softdelete } from '../../controllers/admin/petadmin.controller.js'
import { Deletepet, Getallpet, Singlepet } from '../../controllers/admin/petAdmin.controller.js'


const Adminpet = express.Router()


Adminpet.get("/admin/pet" , adminAuth, adminOnly , Getallpet)
Adminpet.get("/admin/pet/get/:slug" ,adminAuth , adminOnly , Singlepet);
Adminpet.delete("/admin/pet/delete/:slug" , adminAuth , adminOnly , Deletepet)


export default Adminpet
import express from'express';
import { adminAuth, Auth } from '../../middlewares/auth.middleware.js';
import { adminOnly } from '../../middlewares/admin.middleware.js';
import { allcontent, contentdelete, contentUpdate, createContent, detailedcontent, Getallcontent, singleGet } from '../../controllers/admin/adminContent.controller.js';
import upload from '../../utils/helperfunction/multer.js';

const ContentRouter  = express.Router()



ContentRouter.post(
  "/admin/content/create",
  upload.single("ContentImage"),
  adminAuth,
  adminOnly,
  createContent
);
ContentRouter.get("/admin/content/get" , adminAuth , adminOnly , Getallcontent)
ContentRouter.get("/admin/content/get/:slug",adminAuth , adminOnly , singleGet)
ContentRouter.delete("/admin/content/remove/:slug", adminAuth , adminOnly , contentdelete)
ContentRouter.patch("/admin/content/edit/:slug",upload.single("ContentImage"),adminAuth , adminOnly ,contentUpdate)
ContentRouter.get("/content/get",allcontent)
ContentRouter.get("/content/detail/:slug",detailedcontent)
export default ContentRouter;
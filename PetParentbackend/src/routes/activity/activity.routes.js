import express from 'express';
import { addActivity, deleteActivity, getActivitiesByPet, getActivityById, getallactivity, updateActivity } from '../../controllers/activity/activity.controller.js';
import {Auth} from '../../middlewares/auth.middleware.js';
const router=express.Router();

router.post('/pet/addActivity/:slug',Auth,addActivity);

router.get("/pet/getallactivity",Auth,getallactivity );

router.get('/pet/getActivities/:petId',Auth,getActivitiesByPet);

router.get('/pet/getActivityById/:id',Auth,getActivityById);

router.patch('/pet/updateActivity/:id',Auth,updateActivity);

router.delete('/pet/deleteActivity/:id',Auth,deleteActivity);
export default router;
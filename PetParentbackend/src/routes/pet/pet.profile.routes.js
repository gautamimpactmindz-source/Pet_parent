import express from 'express';
import { Auth } from '../../middlewares/auth.middleware.js';
import { getAllPetProfile } from '../../controllers/pet/pet.profile.controller.js';
import upload from '../../utils/helperfunction/multer.js';

const router=express.Router();



router.get('/pets/profile',Auth,getAllPetProfile);

export default router;
import express from 'express';
import { addPet, deletePet, getMyPets, getPetDetail, updatePetFull,getspecies, checknameexisting } from '../../controllers/pet/pet.controller.js';
import {Auth} from '../../middlewares/auth.middleware.js'
// import { handleValidationErrors, validatePet } from '../../middlewares/userValidation.js';
import upload from '../../utils/helperfunction/multer.js';
const router=express.Router();

router.post('/pet/addPet',Auth,upload.array('images',6),addPet);

router.get('/pet/getMyPets',Auth,getMyPets);

router.get('/pet/getPetDetail/:slug',Auth,getPetDetail);

router.patch('/pet/updatePet/:slug',Auth,upload.array('images',6),updatePetFull);

router.delete('/pet/deletePet/:slug',Auth,deletePet);

router.get('/pet/getspecies',Auth,getspecies)

router.post('/pet/checkname',Auth,checknameexisting)



export default router; 
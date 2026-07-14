import express from 'express';
// import { addBreed, getAllBreeds } from '../../controllers/breed/breed.controller.js';

import { addBreedWithDetails, Deletebreed, getAllBreeds, getAllPublicBreeds, getBreeds, singleBreeds, softDeleteBreed, UpdateBreed} from '../../controllers/admin/breed.controller.js';
import upload from '../../utils/helperfunction/multer.js';
import { adminAuth } from '../../middlewares/auth.middleware.js';
import { adminOnly } from '../../middlewares/admin.middleware.js';
const Breedrouter=express.Router();

Breedrouter.post('/admin/addBreed',upload.single("BreedImage"),adminAuth,adminOnly,addBreedWithDetails);

Breedrouter.get('/admin/getAllBreeds',adminAuth,adminOnly,getAllBreeds);
Breedrouter.get('/AllBreeds',getAllPublicBreeds);
// Breedrouter.post('/admin/breed/detail/:slug',Auth,adminOnly,addBreeddetails)
Breedrouter.get('/admin/breed/:slug',singleBreeds)


Breedrouter.patch('/admin/breed/remove/:slug',adminAuth,adminOnly,softDeleteBreed)
Breedrouter.delete('/admin/breed/delete/:slug',adminAuth , adminOnly , Deletebreed)
Breedrouter.patch('/admin/breed/update/:slug',upload.single("BreedImage"),adminAuth , adminOnly , UpdateBreed)
//for welcome dropdown
Breedrouter.get('/getBreeds',getBreeds);

export default Breedrouter;
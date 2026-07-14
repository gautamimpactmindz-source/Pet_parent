import dotenv from 'dotenv';
dotenv.config();
import{createRequire} from 'module'
import swaggerUi from 'swagger-ui-express'
const require = createRequire(import.meta.url);

import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/user/auth.routes.js';
import {getpetinfo, getUserInfo} from './controllers/chatbot/chatbot.js';
import activityRoutes from './routes/activity/activity.routes.js'
import petRoutes from './routes/pet/pet.basic.routes.js';
import petProfileRoutes from './routes/pet/pet.profile.routes.js'
import adminrouter from './routes/admin/admin.route.js';
import userRouter from './routes/admin/admin.manage.user.js';
import Adminpet from './routes/admin/pet.management.js';
import Breedrouter from './routes/admin/breed.routes.js';
import ContentRouter from './routes/admin/content.manage.js';
import contactRouter from './routes/contact/contact.route.js';
import { chatRouter } from './routes/chatbot/chatbot.js';

const app = express();
const swaggerDocument = require('../swagger-output.json')

app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
  })
);


app.use(cookieParser());




app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
  res.send("hello")
})
app.use('/api/chatbot',chatRouter);

app.use('/api',authRoutes, petRoutes ,activityRoutes, adminrouter ,userRouter , Adminpet,Breedrouter ,ContentRouter,petProfileRoutes,contactRouter);
app.use('/api',petRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
export default app;



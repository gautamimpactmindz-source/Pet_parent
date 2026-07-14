import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import './src/config/db.js'
import { connectDB } from './src/config/db.js';

const PORT=process.env.PORT||3001;
//update
await connectDB()
app.listen(PORT,()=>{console.log(`Server connected to PORT: ${PORT}`)})

import mongoose from 'mongoose';



// mongoose.connect(process.env.MONGO_URL)
// .then(()=>{console.log(`MongoDB Connected !!`)})
// .catch((err)=>{console.error(err)});

export const connectDB= async()=>{
    
    try{
       const connect = await mongoose.connect(`${process.env.MONGO_URL}`);
       if(connect){
        console.log('Mongodb connected')
       }
       else{
        console.log("Something went wrong")
       }
    }catch(err){
        console.log(err)
    }
}

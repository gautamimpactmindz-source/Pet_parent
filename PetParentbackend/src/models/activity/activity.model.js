import mongoose from 'mongoose';

const ActivitySchema=new mongoose.Schema({
    pet:{
        id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Pet',
        required:true
    },
    slug:{
        type:String,
        
    }
    },
   
   
    description:{
        type:String,
        trim:true
    },
   activityDate:{
        type:Date,
        default:Date.now
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

const Activity=mongoose.model('Activity',ActivitySchema);

export default Activity;
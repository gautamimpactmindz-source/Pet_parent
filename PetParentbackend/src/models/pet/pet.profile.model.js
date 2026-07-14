import mongoose from 'mongoose';

const PetProfileSchema=new mongoose.Schema({
    pet:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Pet',
        required:true,
    
        index:true
    },
    profileImages:[{
        url:{
            type:String,
            trim:true
        },
        key:{
            type:String,
            trim:true
        }
    }],
    weight:{
        type:Number
    },
   
    activityLevel:{
        type:String,
        enum:['Low','Medium','High']
    },
    healthConcerns:{
      conditions: {
      type: [String],   // Array of selected checkboxes
    
    default: []
  },
  description: {
    type: String,
    trim: true
  }
}

},{timestamps:true});

const PetProfile=mongoose.model('PetProfile',PetProfileSchema);

export default PetProfile;
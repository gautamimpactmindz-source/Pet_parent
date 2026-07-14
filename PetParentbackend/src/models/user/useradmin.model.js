import mongoose from 'mongoose';
import generateSlug from '../../utils/helperfunction/generateSlug.js';


const UserAdminSchema=new mongoose.Schema({
    name:{
        type:String,
       
        trim:true,
 
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
      
    },
    password:{
        type:String,
        
        select:false
    },
    slug:{
        type:String,
        trim:true,
        lowercase:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    },
     termsAccepted: {
    type: Boolean,
    default: true
  },
    resetPasswordToken:{
        type:String,
    },
    resetPasswordExpiry:{
      type:Date
    
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

UserAdminSchema.index(
    {slug:1},
    {
        unique:true,
        partialFilterExpression:{isActive:true}
    }

)

UserAdminSchema.pre("save", async function () {

  // 🔥 Slug generation
  if (this.isModified("name")) {
    const baseSlug = generateSlug(this.name);
    let slug = baseSlug;
    let counter = 1;

    while (
      await this.constructor.exists({
        slug,
        _id: { $ne: this._id }
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }


});

const User=mongoose.model('User',UserAdminSchema);

export default User;
import mongoose from "mongoose";
import slugify from "slugify";


const contentSchema = new mongoose.Schema({
 
    title: {
      type: String,
      required: true,
      trim:true
    },
    excerpt: {
      type: String,
      required: true,
      trim:true
    },
    body: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    metaTitle: {
      type: String,
      trim: true
    },
    metaDescription: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },
    isActive: {
      type: Boolean,
      default: true
    },
     ContentImage:{
        url:{
            type:String,
            trim:true
        },
        key:{
            type:String,
            trim:true
        }
    }
   
  


},{timestamps : true})


contentSchema.index(
    {slug:1},
    {
        unique:true,
        partialFilterExpression:{isActive:true}
    }

)

contentSchema.pre("save", async function () {
  if (!this.isModified("title")) return;

  const baseSlug = slugify(this.title, {
    lower: true,
    strict: true
  });

  let slug = baseSlug;
  let counter = 1;

  const ContentModel = mongoose.model("Content");

  while (
    await ContentModel.exists({
      slug,
      _id: { $ne: this._id }
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = slug;

  

});




export const Content = mongoose.model("Content" , contentSchema)
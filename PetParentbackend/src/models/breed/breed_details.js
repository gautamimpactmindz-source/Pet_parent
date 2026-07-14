import mongoose from "mongoose";

const breedDetailSchema = new mongoose.Schema(
  {
    Breed_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Breed",
      required: true,
    },

    heading: {
      type: String,
      trim: true,
      required: true,
    },

    description: {
      type: String,
      trim: true,
      required: true,
    },

    lifeExpectancy:{
      min:Number,
      max:Number
    },

    about: String,

    temperamentTraits: [String],

    nutritionDiet: [
      {
        title: String,
        body: String,
      },
    ],

    nutritionNote: String,

    trainingExercise: [
      {
        title: String,
        body: String,
      },
    ],

    groomingDetails:[
      {
        title:String,
        body:String
      }
    ],

 
  },
  
  { timestamps: true },
);

export const BreedDetail =mongoose.model("BreedDetail", breedDetailSchema);

import mongoose from 'mongoose';
import generateSlug from '../../utils/helperfunction/generateSlug.js';

const PetSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownername: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,


  },
  slug: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true
  },

  species: {
    type: String,
    trim: true,
    lowercase: true
  },


  breed: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Breed',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
  },
  dob: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true
  },



}, { timestamps: true });





PetSchema.pre("save", async function () {

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





const Pet = mongoose.model('Pet', PetSchema);

export default Pet;
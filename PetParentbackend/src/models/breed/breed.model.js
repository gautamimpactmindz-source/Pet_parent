import mongoose from "mongoose";
import generateSlug from "../../utils/helperfunction/generateSlug.js";

const BreedSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique:true
    },

    slug: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true   
    },

    size: {
      type: String,
      required: true,
    },

    energy: {
      type: String,
      trim: true,
    },

    goodwith: [String],

    excerpt: {
      type: String,
      trim: true,
    },

    notidealfor: [String],

    isActive: {
      type: Boolean,
      default: true,
    },

    BreedImage: {
      url: {
        type: String,
        trim: true,
      },
      key: {
        type: String,
        trim: true,
      }
    },
       relatedBreeds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Breed",
      },
    ],
  },
  { timestamps: true }
);

// Unique index
BreedSchema.index({ name: 1 });

// ✅ Modern Pre Save (NO next)


BreedSchema.pre("save", async function () {

  if (!this.isModified("name")) return;

  const baseSlug = generateSlug(this.name);
  let slug = baseSlug;
  let counter = 1;

  const BreedModel = mongoose.model("Breed");

  while (
    await BreedModel.exists({
      slug,
      _id: { $ne: this._id }
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = slug;
});

const Breed = mongoose.model("Breed", BreedSchema);

export default Breed;

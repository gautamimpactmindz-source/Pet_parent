"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./BreedForm.css";
import { toast } from "react-toastify";
import { useAddBreedMutation, useUpdateBreedMutation } from "@/apis/adminApi";
import { useFieldArray, useForm } from "react-hook-form";
import { breedFormValidation } from "@/validations/form-validation";
import { yupResolver } from "@hookform/resolvers/yup";

export default function BreedForm({ edit = false, editData, slug }) {
  const [preview, setPreview] = useState(null);
  const router = useRouter();
  const [addBreed, { isLoading: isAddLoading }] = useAddBreedMutation();
  const [updateBreed, { isLoading: isUpdateLoading }] =
    useUpdateBreedMutation();
  const isSubmitting = edit ? isUpdateLoading : isAddLoading;

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(breedFormValidation),
    defaultValues: {
      name: "",
      size: "",
      energy: "",
      goodwith: "",
      excerpt: "",
      notidealfor: "",
      heading: "",
      description: "",
      lifeExpectancy: "",
      about: "",
      temperamentTraits: "",
      nutritionDiet: [{ title: "", body: "" }],
      nutritionNote: "",
      trainingExercise: [{ title: "", body: "" }],
      image: null,
    },
  });

  const { fields: nutritionFields, append: appendNutrition } = useFieldArray({
    control,
    name: "nutritionDiet",
  });

  const { fields: trainingFields, append: appendTraining } = useFieldArray({
    control,
    name: "trainingExercise",
  });

  useEffect(() => {
    if (edit && editData) {
      reset({
        name: editData.name || "",
        size: editData.size || "",
        energy: editData.energy || "",
        goodwith: editData.goodwith?.join(", ") || "",
        excerpt: editData.excerpt || "",
        notidealfor: editData.notidealfor?.join(", ") || "",

        heading: editData.details?.heading || "",
        description: editData.details?.description || "",
        lifeExpectancy: editData.details?.lifeExpectancy || "",
        about: editData.details?.about || "",
        temperamentTraits:
          editData.details?.temperamentTraits?.join(", ") || "",

        nutritionDiet: editData.details?.nutritionDiet || [
          { title: "", body: "" },
        ],

        nutritionNote: editData.details?.nutritionNote || "",

        trainingExercise: editData.details?.trainingExercise || [
          { title: "", body: "" },
        ],
      });
      if (editData.BreedImage?.url) {
        setPreview(editData.BreedImage.url);
      }
    }
  }, [editData, edit, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("size", data.size);
      formData.append("energy", data.energy);
      formData.append("goodwith", data.goodwith);
      formData.append("excerpt", data.excerpt);
      formData.append("notidealfor", data.notidealfor);

      formData.append("heading", data.heading);
      formData.append("description", data.description);
      formData.append("lifeExpectancy", data.lifeExpectancy);
      formData.append("about", data.about);
      formData.append("temperamentTraits", data.temperamentTraits);
      formData.append("nutritionNote", data.nutritionNote);

      // arrays must be stringified
      formData.append("nutritionDiet", JSON.stringify(data.nutritionDiet));
      formData.append(
        "trainingExercise",
        JSON.stringify(data.trainingExercise),
      );

      // image
      if (data.image && data.image[0]) {
        formData.append("BreedImage", data.image[0]);
      }

      if (edit) {
        await updateBreed({ slug, credentials: formData }).unwrap();
        toast.success("Breed Updated Successfully");
      } else {
        await addBreed(formData).unwrap();
        toast.success("Breed Created Successfully");
      }

      router.push("/admin/breed");
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to save breed");
    }
  };

  return (
    <div className="breed-form-container">
      <div className="breed-form-header">
        <h1>{edit ? "Edit Breed" : "Create Breed"}</h1>
        <p>
          {edit
            ? "Update existing breed details."
            : "Add new breed profile with detailed information."}
        </p>
      </div>

      <form className="breed-form-card" onSubmit={handleSubmit(onSubmit)}>
        {/* BASIC FIELDS */}

        <h3>Basic Information</h3>

        <input {...register("name")} placeholder="Breed Name" />
        {errors.name && (
          <small className="text-danger">{errors.name?.message}</small>
        )}

        <div className="image-upload-group">
          <label>Breed Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            onChange={(e) => {
              if (e.target.files[0]) {
                setPreview(URL.createObjectURL(e.target.files[0]));
              }
            }}
          />
          {preview && (
            <img src={preview} alt="Preview" className="image-preview" />
          )}
        </div>

        <input {...register("size")} placeholder="Size (Small/Medium/Large)" />
        {errors.size && (
          <small className="text-danger">{errors.size?.message}</small>
        )}

        <input {...register("energy")} placeholder="Energy Level" />
        {errors.energy && (
          <small className="text-danger">{errors.energy?.message}</small>
        )}

        <input {...register("goodwith")} placeholder="Good With" />
        {errors.goodwith && (
          <small className="text-danger">{errors.goodwith?.message}</small>
        )}

        <textarea {...register("excerpt")} placeholder="Short Excerpt" />
        {errors.excerpt && (
          <small className="text-danger">{errors.excerpt?.message}</small>
        )}

        <input {...register("notidealfor")} placeholder="Not Ideal For " />
        {errors.notidealfor && (
          <small className="text-danger">{errors.notidealfor?.message}</small>
        )}

        {/* DETAILS */}

        <h3>Breed Details</h3>

        <input {...register("heading")} placeholder="Heading" />
        {errors.heading && (
          <small className="text-danger">{errors.heading?.message}</small>
        )}

        <textarea {...register("description")} placeholder="Description" />
        {errors.description && (
          <small className="text-danger">{errors.description?.message}</small>
        )}

        <input {...register("lifeExpectancy")} placeholder="Life Expectancy" />

        <textarea {...register("about")} placeholder="About Breed" />
        <input
          {...register("temperamentTraits")}
          placeholder="Temperament Traits "
        />

        {/* Nutrition Diet */}

        <h4>Nutrition Diet</h4>
        {nutritionFields.map((field, index) => (
          <div key={field.id} className="array-group">
            <input
              placeholder="Title"
              {...register(`nutritionDiet.${index}.title`)}
            />
            <textarea
              placeholder="Body"
              {...register(`nutritionDiet.${index}.body`)}
            />
          </div>
        ))}

        <button
          className="btn-add-section"
          type="button"
          onClick={() => appendNutrition({ title: "", body: "" })}
        >
          + Add Nutrition Section
        </button>

        <textarea {...register("nutritionNote")} placeholder="Nutrition Note" />

        {/* Training Exercise */}

        <h4>Training & Exercise</h4>
        {trainingFields.map((field, index) => (
          <div key={field.id} className="array-group">
            <input
              placeholder="Title"
              {...register(`trainingExercise.${index}.title`)}
            />
            <textarea
              placeholder="Body"
              {...register(`trainingExercise.${index}.body`)}
            />
          </div>
        ))}

        <button
          type="button"
          className="btn-add-section"
          onClick={() => appendTraining({ title: "", body: "" })}
        >
          + Add Training Section
        </button>

        <button className="btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : edit ? "Update Breed" : "Create Breed"}
        </button>
      </form>
    </div>
  );
}

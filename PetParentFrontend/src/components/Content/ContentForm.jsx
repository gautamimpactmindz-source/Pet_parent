"use client";
import dynamic from "next/dynamic";
import { yupResolver } from "@hookform/resolvers/yup";
import { contentValidation } from "@/validations/form-validation";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import "./Content.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCreateContentMutation, useUpdateContentMutation } from "@/apis/adminContentApi";

const QuillEditor = dynamic(() => import("@/components/Editor/QuillEditor"), {
  ssr: false,
});

export default function ContentForm({ edit, editData, slug }) {
  console.log(edit)
  const router = useRouter();
  const [preview, setPreview] = useState(null);

  const [createContent, { isLoading }] = useCreateContentMutation();
  const [updateContent] = useUpdateContentMutation();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(contentValidation),
    defaultValues: {
      title: "",
      body: "",
      metaTitle: "",
      metaDescription: "",
      status: "draft",
      image: null,
    },
  });

  const bodyValue = watch("body");

  useEffect(() => {
    if (edit && editData) {
      reset({
        title: editData.title || "",
        body: editData.body || "",
        metaTitle: editData.metaTitle || "",
        metaDescription: editData.metaDescription || "",
        status: editData.status || "draft",
      });

      if (editData.image?.url) {
        setPreview(editData.image.url);
      }
    }
  }, [editData, edit]);


  const onSubmit = async (data) => {
    try {
      if (edit) {
        console.log(data)
        const res = await updateContent({ slug, credentials: data }).unwrap();
        console.log(res);
        toast.success("Content updated successfully!!")
      }
      else {
        await createContent(data).unwrap();
        toast.success("Content created successfully");
      }

      router.push("/admin/content");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="content-container">
      <div className="content-header">
        <h1>{edit ? "Edit Content" : "Create Content"}</h1>
        <p>
          {edit
            ? "Update your existing content."
            : "Add new content to the platform."}
        </p>
      </div>

      <form className="content-form-card" onSubmit={handleSubmit(onSubmit)}>
        {/* TITLE */}
        <div className="form-group">
          <label>Title</label>
          <input {...register("title")} placeholder="Enter title" />
          {errors.title && (
            <small className="text-danger">{errors.title.message}</small>
          )}
        </div>

        {/* IMAGE UPLOAD */}
        <div className="form-group">
          <label>Featured Image</label>
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

        {/* BODY */}
        <div className="form-group">
          <label>Content Body</label>
          <QuillEditor
            key={editData?._id || "new"} // 🔥 VERY IMPORTANT
            value={bodyValue}
            onChange={(content) =>
              setValue("body", content, { shouldDirty: true })
            }
          />
          {errors.body && <small className="text-danger">{errors.body.message}</small>}

        </div>

        {/* META TITLE */}
        <div className="form-group">
          <label>Meta Title</label>
          <input
            name="metaTitle"
            {...register("metaTitle")}
            placeholder="SEO meta title"
          />
          {errors.metaTitle && <small className="text-danger">{errors.metaTitle.message}</small>}

        </div>

        {/* META DESCRIPTION */}
        <div className="form-group">
          <label>Meta Description</label>
          <textarea
            rows={3}
            {...register("metaDescription")}
            placeholder="SEO meta description"
          />
          {errors.metaDescription && <small className="text-danger">{errors.metaDescription.message}</small>}

        </div>

        {/* STATUS */}
        <div className="form-group">
          <label>Status</label>
          <select {...register("status")}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          {errors.status && <small className="text-danger">{errors.status.message}</small>}

        </div>

        <button
          type="submit"
          className="btn-primary full-width"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : edit ? "Update Content" : "Create Content"}
        </button>
      </form>
    </div>
  );
}

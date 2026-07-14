"use client";

import { useGetSingleBreedQuery } from "@/apis/adminApi";
import BreedForm from "@/components/Breed/BreedForm";
import { useParams } from "next/navigation";

export default function EditBreedPage() {
  const { slug } = useParams();

  const { data, isLoading } = useGetSingleBreedQuery(slug);

  if (isLoading) return <p>Loading...</p>;

  return (
    <BreedForm
      edit={true}
      editData={data?.data}
      slug={slug}
    />
  );
}

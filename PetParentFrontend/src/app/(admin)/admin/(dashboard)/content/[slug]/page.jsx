"use client";

import { useParams } from "next/navigation";

import ContentForm from "@/components/Content/ContentForm";
import { useGetSingleContentQuery } from "@/apis/adminContentApi";


export default function EditContentPage() {
  const { slug } = useParams();
  const { data, isLoading } = useGetSingleContentQuery(slug);

  if (isLoading) return <p>Loading...</p>;

   if (!data?.data) return <p>Content not found</p>;
  return (
    <ContentForm
      edit={true}
      editData={data?.data}
      slug={slug}
    />
  );
}

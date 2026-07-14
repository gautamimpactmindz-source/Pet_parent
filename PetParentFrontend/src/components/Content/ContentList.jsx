"use client";

import { useDeleteContentMutation, useGetAllContentQuery } from "@/apis/adminContentApi";
import "./Content.css";
import Link from "next/link";

export default function ContentList() {
  const { data, isLoading, isError } = useGetAllContentQuery();
  const [deleteContent] = useDeleteContentMutation();
  const contents = data?.data || [];

  const handleDelete = async (slug) => {
    try {
      await deleteContent(slug);
    } catch (error) {
      toast.error("Failed to remove content", error);
    }
  };
  return (
    <div className="content-container">
      <div className="content-header">
        <div>
          <h1>Content Management</h1>
          <p>Manage all platform content from here.</p>
        </div>

        <Link href="/admin/content/add">
          <button className="btn-primary">+ Add Content</button>
        </Link>
      </div>

      <div className="content-card">
        <div className="content-table-header">
          <span>Image</span>
          <span>Title</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {isLoading && <p>Loading Content...</p>}

        {isError && <p style={{ color: "red" }}>Failed to load Content...</p>}

        {!isLoading &&
          contents.map((item) => (
            <div className="content-row" key={item._id}>
              <div className="content-image-wrapper">
                {item.ContentImage?.url ? (
                  <img
                    src={item.ContentImage.url}
                    alt={item.title}
                    className="content-image"
                  />
                ) : (
                  <div className="content-placeholder">
                    {item.title?.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="title">{item.title}</div>
                <div className="meta">{item.metaTitle}</div>
              </div>

              <div>
                <span className={`status-badge ${item.status}`}>
                  {item.status}
                </span>
              </div>

              <div className="action-buttons">
                <Link href={`/admin/content/${item.slug}`}>
                  <button className="btn-outline">Edit</button>
                </Link>
                <button
                  className="btn-delete"
                  onClick={() => {
                    handleDelete({ slug: item.slug });
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

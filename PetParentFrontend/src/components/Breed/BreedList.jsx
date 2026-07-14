"use client";
import "./Breed.css";
import Link from "next/link";
import { useGetAllBreedsQuery, useDeleteBreedMutation } from "@/apis/adminApi";
import { toast } from "react-toastify";

export default function BreedList() {
  const { data, isLoading, isError } = useGetAllBreedsQuery();
  const [deleteBreed] = useDeleteBreedMutation();

  const breeds = data?.data || [];

  const handleDelete = async (slug) => {
    try {
      await deleteBreed(slug).unwrap();
      toast.success("Breed deleted successfully");
    } catch (error) {
      toast.error("Failed to remove breed");
    }
  };

  return (
    <div className="breed-container">

      <div className="breed-header">
        <div>
          <h1>Breed Management</h1>
          <p>Manage all breed profiles from here.</p>
        </div>

        <Link href="/admin/breed/add">
          <button className="btn-add-breed">+ Add Breed</button>
        </Link>
      </div>

      {isLoading && <p>Loading Breeds...</p>}
      {isError && <p style={{ color: "red" }}>Failed to load breeds</p>}

      {!isLoading && !isError && (
        <div className="breed-table-wrapper">
          <table className="breed-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Size</th>
                <th>Energy</th>
                <th>Good With</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {breeds.map((breed) => (
                <tr key={breed._id}>
                  <td>
                    {breed.BreedImage?.url ? (
                      <img
                        src={breed.BreedImage.url}
                        alt={breed.name}
                        className="table-image"
                      />
                    ) : (
                      <div className="table-placeholder">
                        {breed.name?.charAt(0)}
                      </div>
                    )}
                  </td>

                  <td>{breed.name}</td>
                  <td>{breed.size}</td>
                  <td>{breed.energy}</td>

                  <td>
                    {breed.goodwith?.join(", ")}
                  </td>

                 

                  <td className="table-actions">
                    <Link href={`/admin/breed/view/${breed.slug}`}>
                      <button className="btn-view">View</button>
                    </Link>

                    <Link href={`/admin/breed/${breed.slug}`}>
                      <button className="btn-edit">Edit</button>
                    </Link>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(breed.slug)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}

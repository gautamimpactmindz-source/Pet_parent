"use client";

import { useGetAllPetsQuery } from "@/apis/adminPetApi";
import "./PetsManagement.css";

export default function PetsManagement() {
  const { data, isLoading, isError } = useGetAllPetsQuery();

  const pets = data?.data ?
    data.data.flatMap(user =>
      user.pets.map(pet => ({
        ...pet,
        ownerName: user.name
      }))
    )
    : [];


  return (
    <div className="pets-container">

      <div className="pets-header">
        <h1>Pets Management</h1>
        <p>Manage all registered pets from here.</p>
      </div>

      <div className="pets-search">
        <input type="text" placeholder="Search pets..." />
      </div>

      <div className="pets-table-card">

        <div className="pets-table-header">
          <div>Pet</div>
          <div>Breed</div>
          <div>Owner</div>
          <div>Actions</div>
        </div>
        {isLoading && <p>Loading Pets...</p>}
        {isError && (
          <p style={{ color: "red" }}>Failed to load pets</p>
        )}
        {!isLoading && pets.map((pet) => (
          <div key={pet._id} className="pets-table-row">

            <div className="pet-info">
              <img src={pet.image} alt={pet.name} />
              <div className="pet-name">{pet.name}</div>
            </div>

            <div className="pet-breed">{pet.breed?.name}</div>

            <div>{pet.ownerName}</div>

            <div className="pet-actions">
              <button className="view-btn">View</button>
              <button className="delete-btn">Delete</button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

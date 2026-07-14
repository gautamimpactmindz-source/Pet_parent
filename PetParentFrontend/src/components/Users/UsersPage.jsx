"use client";
import "./UsersPage.css";
import UserRow from "./UserRow";
import { useState } from "react";
import { useGetAllUsersQuery } from "@/apis/adminUserApi";


export default function UsersPage() {

  const { data, isLoading, isError } = useGetAllUsersQuery();
  const users = data?.data || [];

  return (
    <div className="users-container">

      <div className="users-header">
        <h1>Users Management</h1>
        <p>Manage all platform users from here.</p>
      </div>

      {/* Actions */}
      <div className="users-actions">
        <div className="search-box">
          <span>🔍</span>
          <input placeholder="Search users..." />
        </div>

      </div>

      {/* Table Card */}
      <div className="users-card">

        <div className="users-table-header">
          <span>Name</span>
          <span>Email</span>
          {/* <span>Role</span> */}
          <span>Status</span>
          <span>Actions</span>
        </div>

        {isLoading && <p>Loading Users...</p>}

        {isError && <p style={{ color: "red" }}>Failed to load users</p>}

        {!isLoading && users.map(user => (
          <UserRow
            key={user._id}
            user={user}
          />
        ))}

      </div>

    </div>
  );
}

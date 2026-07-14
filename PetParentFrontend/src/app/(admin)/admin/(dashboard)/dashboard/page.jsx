"use client"
import StatCard from "../../../../../components/StatCard/StatCard";
import UsersTable from "../../../../../components/UsersTable/UsersTable";
import PetsTable from "../../../../../components/PetsTable/PetsTable";
import './page.css';
import { useGetCountQuery } from "@/apis/adminAuthApi";
export default function DashboardPage() {
  const { data, isLoading, isError } = useGetCountQuery();

  const totalUsers = data?.data?.totalUsers || 0;;
  const totalPets = data?.data?.totalPets || 0;



  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <span className="welcome-badge">✨ Welcome back, Alice</span>
        <h1>Overview Dashboard</h1>
        <p>
          Here's what's happening with your community today. You have{" "}
          <b>{isLoading ? "..." : totalUsers}</b>users and{" "} <b>{isLoading ? "..." : totalPets}</b>pets active.
        </p>
      </div>

      {/* Error Handling */}
      {isError && (
        <p style={{ color: "red" }}>
          Failed to load dashboard stats.
        </p>
      )}
      {/* Stats */}
      <div className="stats-grid">
        <StatCard title="Total Users" value={isLoading ? "..." : totalUsers} color="blue" />
        <StatCard title="Total Pets" value={isLoading ? "..." : totalPets} color="orange" />
        <StatCard title="Pet Health Rate" value="67%" color="green" />
        <StatCard title="New Signups" value="+24" color="purple" />
      </div>

      {/* Search */}
      <div className="dashboard-actions">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search users or pets..." />
        </div>

        <div className="action-buttons">
          <button className="btn-outline">
            <span style={{ marginRight: "6px" }}>⚙</span>
            Filter
          </button>
          <button className="btn-primary">Export Report</button>
        </div>
      </div>

      {/* Tables */}
      <div className="tables-grid">
        <UsersTable />
        <PetsTable />
      </div>
    </div>
  );
}

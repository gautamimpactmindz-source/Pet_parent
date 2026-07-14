
import { useDeleteUserMutation, useUpdateUserStatusMutation } from "@/apis/adminUserApi";
import "./UserRow.css";
import { toast } from "react-toastify";

export default function UserRow({ user }) {
  const [updateUserStatus, { isLoading }] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const status = user.isActive ? "active" : "blocked";

  const handleToggle = async () => {
    try {
      await updateUserStatus({
        slug: user.slug,
        status: !user.isActive
      }).unwrap();
    } catch (error) {
      toast.error('Failed to update user status', error);
    }
  }

  const handleDelete = async () => {
    try {
      await deleteUser({ slug: user.slug }).unwrap();
    } catch (error) {
      toast.error('Failed to delete user', error);
    }
  }
  return (
    <div className="user-row">

      <div className="user-name">
        <div className="avatar">{user.name?.charAt(0)}</div>
        <div>
          <div className="name">{user.name}</div>
          <div className="email">{user.email}</div>
        </div>
      </div>

      <div>{user.email}</div>

      <div>
        <span className={`status-badge ${status}`}>
          {status}
        </span>
      </div>

      <div className="action-buttons">
        <button
          className={`btn-outline ${status === "blocked" ? "unblock" : "block"}`}
          onClick={handleToggle}
        >
          {status === "blocked" ? "Unblock" : "Block"}
        </button>

        <button
          className="btn-delete"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

    </div>
  );
}

import "./UsersTable.css";

export default function UsersTable() {
  return (
    <div className="table-card">
      <div className="table-header">
        <h3>Recent Users</h3>
        <span>View All</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alice Johnson</td>
            <td><span className="badge admin">Admin</span></td>
            <td><span className="badge active">Active</span></td>
          </tr>
          <tr>
            <td>Bob Smith</td>
            <td><span className="badge user">User</span></td>
            <td><span className="badge active">Active</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

import "./PetsTable.css";

export default function PetsTable() {
  return (
    <div className="table-card">
      <div className="table-header">
        <h3>All Pets</h3>
        <span>View All</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Pet</th>
            <th>Owner</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Buddy</td>
            <td>Bob Smith</td>
            <td><span className="badge healthy">Healthy</span></td>
          </tr>
          <tr>
            <td>Mittens</td>
            <td>Alice</td>
            <td><span className="badge healthy">Healthy</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

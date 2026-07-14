import "./StatCard.css";

export default function StatCard({ title, value, color }) {
  return (
    <div className="stat-card">
      <div className={`icon-circle ${color}`}></div>
      <p className="stat-title">{title}</p>
      <h2 className="stat-value">{value}</h2>
      <div className={`progress ${color}`}></div>
    </div>
  );
}

import "./DashboardCard.css";

function DashboardCard({ title, value, color, icon }) {
  return (
    <div className="dashboard-card">
      <div
        className="dashboard-icon"
        style={{ background: color }}
      >
        {icon}
      </div>

      <div className="dashboard-content">
        <h4>{title}</h4>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

export default DashboardCard;
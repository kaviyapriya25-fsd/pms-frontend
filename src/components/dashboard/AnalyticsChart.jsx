import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import "./AnalyticsChart.css";

function AnalyticsChart() {

  const data = [
    { month: "Jan", projects: 4, tasks: 12 },
    { month: "Feb", projects: 6, tasks: 18 },
    { month: "Mar", projects: 8, tasks: 22 },
    { month: "Apr", projects: 10, tasks: 28 },
    { month: "May", projects: 9, tasks: 24 },
    { month: "Jun", projects: 12, tasks: 35 },
  ];

  return (

    <div className="analytics-card">

      <h3>Project Analytics</h3>

      <ResponsiveContainer width="100%" height={320}>

        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="projects"
            fill="#2563eb"
            radius={[8,8,0,0]}
          />

          <Bar
            dataKey="tasks"
            fill="#10b981"
            radius={[8,8,0,0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );
}

export default AnalyticsChart;
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import "./ReportsCharts.css";

function ReportsCharts({ projects, tasks }) {

  // Temporary project chart
  const projectGrowth = [
    {
      name: "Projects",
      total: projects.length,
    },
  ];

  const completed = tasks.filter(
    (t) => t.status === "COMPLETED"
  ).length;

  const pending = tasks.filter(
    (t) => t.status === "PENDING"
  ).length;

  const progress = tasks.filter(
    (t) => t.status === "IN_PROGRESS"
  ).length;

  const pieData = [
    {
      name: "Completed",
      value: completed,
    },
    {
      name: "Pending",
      value: pending,
    },
    {
      name: "In Progress",
      value: progress,
    },
  ];

  const COLORS = [
    "#22c55e",
    "#f59e0b",
    "#2563eb",
  ];

  return (

    <div className="reports-charts">

      <div className="chart-card">

        <h2>Project Overview</h2>

        <ResponsiveContainer width="100%" height={320}>

          <BarChart data={projectGrowth}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="total"
              fill="#2563eb"
              radius={[8,8,0,0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      <div className="chart-card">

        <h2>Task Status</h2>

        <ResponsiveContainer width="100%" height={320}>

          <PieChart>

            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={110}
              label
            >

              {pieData.map((entry,index)=>

                <Cell
                  key={index}
                  fill={COLORS[index]}
                />

              )}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  );
}

export default ReportsCharts;
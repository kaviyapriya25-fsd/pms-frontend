import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
 Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import "./ReportsCharts.css";

function ReportsCharts() {

  const projectData = [
    { month: "Jan", projects: 2 },
    { month: "Feb", projects: 5 },
    { month: "Mar", projects: 6 },
    { month: "Apr", projects: 8 },
    { month: "May", projects: 10 },
    { month: "Jun", projects: 12 },
  ];

  const taskData = [
    { name: "Completed", value: 65 },
    { name: "Pending", value: 20 },
    { name: "In Progress", value: 15 },
  ];

  const COLORS = [
    "#22c55e",
    "#f59e0b",
    "#3b82f6",
  ];

  return (

    <div className="reports-charts">

      <div className="chart-card">

        <h2>Project Growth</h2>

        <ResponsiveContainer width="100%" height={320}>

          <BarChart data={projectData}>

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="projects"
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
              data={taskData}
              dataKey="value"
              outerRadius={110}
              label
            >

              {taskData.map((entry,index)=>(
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}

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
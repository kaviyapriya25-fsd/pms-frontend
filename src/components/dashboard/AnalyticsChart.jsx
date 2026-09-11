import { useEffect, useState } from "react";

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

import { getReportData } from "../../services/reportService";

import "./AnalyticsChart.css";

function AnalyticsChart() {

  const [data, setData] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {

    try {

      const res = await getReportData();

      // Build chart data from actual API response
      const projects = res.projects || [];
      const tasks = res.tasks || [];

      // Group projects and tasks by status for the chart
      const chartData = [
        {
          name: "Active",
          Projects: projects.filter(p => p.status === "ACTIVE").length,
          Tasks: tasks.filter(t => t.status === "TODO").length,
        },
        {
          name: "In Progress",
          Projects: projects.filter(p => p.status === "IN_PROGRESS").length,
          Tasks: tasks.filter(t => t.status === "IN_PROGRESS").length,
        },
        {
          name: "Completed",
          Projects: projects.filter(p => p.status === "COMPLETED").length,
          Tasks: tasks.filter(t => t.status === "COMPLETED").length,
        },
      ];

      setData(chartData);

    } catch (err) {
      console.log("Analytics load error:", err);
    }

  };

  return (
    <div className="analytics-card">

      <h3>Project & Task Analytics</h3>

      <ResponsiveContainer width="100%" height={320}>

        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="Projects"
            fill="#2563eb"
            radius={[8, 8, 0, 0]}
          />

          <Bar
            dataKey="Tasks"
            fill="#10b981"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );

}

export default AnalyticsChart;
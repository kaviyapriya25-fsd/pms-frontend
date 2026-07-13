import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Statistics from "../../components/dashboard/Statistics";
import RecentProjects from "../../components/dashboard/RecentProjects";
import RecentActivity from "../../components/dashboard/RecentActivity";
import AnalyticsChart from "../../components/dashboard/AnalyticsChart";

import { getDashboardCounts } from "../../services/dashboardService";

import {
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaCheckCircle,
  FaSpinner,
  FaClipboardList,
} from "react-icons/fa";

import "../../styles/dashboard.css";

function Dashboard() {

  const [counts, setCounts] = useState({
    projects: 0,
    activeProjects: 0,
    completedProjects: 0,
    employees: 0,
    leaders: 0,
    tasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardCounts();
      setCounts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const cards = [
    {
      title: "Total Projects",
      value: counts.projects,
      icon: <FaProjectDiagram />,
      color: "#2563eb",
    },
    {
      title: "Active Projects",
      value: counts.activeProjects,
      icon: <FaSpinner />,
      color: "#06b6d4",
    },
    {
      title: "Completed Projects",
      value: counts.completedProjects,
      icon: <FaCheckCircle />,
      color: "#16a34a",
    },
    {
      title: "Employees",
      value: counts.employees,
      icon: <FaUsers />,
      color: "#8b5cf6",
    },
    {
      title: "Pending Tasks",
      value: counts.pendingTasks,
      icon: <FaTasks />,
      color: "#f59e0b",
    },
    {
      title: "Completed Tasks",
      value: counts.completedTasks,
      icon: <FaClipboardList />,
      color: "#ef4444",
    },
  ];

  return (
    <DashboardLayout>

      <div className="dashboard">

        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome Back Admin 👋</p>
          </div>
        </div>

        <div className="dashboard-cards">

          {cards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
          ))}

        </div>

        {/* Analytics Chart */}

        <AnalyticsChart />

        {/* Existing Statistics */}

        <Statistics />

        {/* Bottom Section */}

        <div className="dashboard-bottom">

          <RecentProjects />

          <RecentActivity />

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;
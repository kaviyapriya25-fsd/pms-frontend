import DashboardLayout from "../../components/layout/DashboardLayout";

import DashboardCard from "../../components/dashboard/DashboardCard";

import Statistics from "../../components/dashboard/Statistics";
import RecentProjects from "../../components/dashboard/RecentProjects";
import RecentActivity from "../../components/dashboard/RecentActivity";

import {
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaCheckCircle,
  FaSpinner,
  FaClipboardList
} from "react-icons/fa";

import "../../styles/dashboard.css";

function Dashboard() {

  const cards = [

    {
      title: "Total Projects",
      value: 12,
      icon: <FaProjectDiagram />,
      color: "#2563eb"
    },

    {
      title: "Active Projects",
      value: 5,
      icon: <FaSpinner />,
      color: "#06b6d4"
    },

    {
      title: "Completed Projects",
      value: 7,
      icon: <FaCheckCircle />,
      color: "#16a34a"
    },

    {
      title: "Employees",
      value: 28,
      icon: <FaUsers />,
      color: "#8b5cf6"
    },

    {
      title: "Pending Tasks",
      value: 18,
      icon: <FaTasks />,
      color: "#f59e0b"
    },

    {
      title: "Completed Tasks",
      value: 60,
      icon: <FaClipboardList />,
      color: "#ef4444"
    }

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

          {

            cards.map((card, index) => (

              <DashboardCard

                key={index}

                title={card.title}

                value={card.value}

                icon={card.icon}

                color={card.color}

              />

            ))

          }

        </div>

        <Statistics />

        <div className="dashboard-bottom">

          <RecentProjects />

          <RecentActivity />

        </div>

      </div>

    </DashboardLayout>

  );

}

export default Dashboard;
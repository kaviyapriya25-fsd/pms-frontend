import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ReportsCharts from "../../components/reports/ReportsCharts";

import {
  getProjectCount,
  getEmployeeCount,
  getLeaderCount,
  getTaskCount,
} from "../../services/reportService";

import "./reports.css";

function Reports() {
  const [projects, setProjects] = useState(0);
  const [employees, setEmployees] = useState(0);
  const [leaders, setLeaders] = useState(0);
  const [tasks, setTasks] = useState(0);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const projectCount = await getProjectCount();
      const employeeCount = await getEmployeeCount();
      const leaderCount = await getLeaderCount();
      const taskCount = await getTaskCount();

      setProjects(projectCount);
      setEmployees(employeeCount);
      setLeaders(leaderCount);
      setTasks(taskCount);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="reports-page">

        <div className="reports-header">
          <div>
            <h1>Reports & Analytics</h1>
            <p>Overview of the Project Management System</p>
          </div>
        </div>

        <div className="report-cards">

          <div className="report-card">
            <h2>Projects</h2>
            <h3>{projects}</h3>
          </div>

          <div className="report-card">
            <h2>Employees</h2>
            <h3>{employees}</h3>
          </div>

          <div className="report-card">
            <h2>Team Leaders</h2>
            <h3>{leaders}</h3>
          </div>

          <div className="report-card">
            <h2>Tasks</h2>
            <h3>{tasks}</h3>
          </div>

        </div>

        <ReportsCharts />

      </div>
    </DashboardLayout>
  );
}

export default Reports;
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SearchBar from "../../components/common/SearchBar";
import {
  getReportSummary,
  downloadExcelReport,
  downloadPdfReport,
} from "../../services/reportService";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaFileAlt,
  FaPrint,
  FaFileExcel,
  FaFilePdf,
  FaProjectDiagram,
  FaUserTie,
  FaUsers,
  FaTasks,
  FaSearch,
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "./reports.css";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

function Reports() {
  const [activeTab, setActiveTab] = useState("EMPLOYEE");
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getReportSummary();
      setSummaryData(data);
    } catch (err) {
      console.error("Failed to load reports summary", err);
      toast.error("Failed to load enterprise report data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    setDownloading(true);
    try {
      await downloadExcelReport(activeTab);
      toast.success(`${activeTab} Report downloaded as Excel workbook!`);
    } catch (err) {
      console.error("Excel download error", err);
      toast.error("Failed to download Excel report.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      await downloadPdfReport(activeTab);
      toast.success(`${activeTab} Report downloaded as PDF document!`);
    } catch (err) {
      console.error("PDF download error", err);
      toast.error("Failed to download PDF report.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Safe data access
  const empList = summaryData?.employeePerformanceList || [];
  const leaderList = summaryData?.leaderPerformanceList || [];
  const projList = summaryData?.projectProgressList || [];
  const taskReport = summaryData?.taskCompletionReport || {};

  // Filtered lists
  const filteredEmployees = empList.filter(
    (e) =>
      e.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeaders = leaderList.filter(
    (l) =>
      l.leaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.assignedProject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projList.filter(
    (p) =>
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.leaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Recharts Formatted Data
  const empChartData = empList.map((e) => ({
    name: e.employeeName.split(" ")[0],
    Completed: e.completedTasks,
    Pending: e.inProgressTasks + e.todoTasks,
    Rate: e.completionRate,
  }));

  const leaderChartData = leaderList.map((l) => ({
    name: l.leaderName.split(" ")[0],
    CompletedTasks: l.completedTeamTasks,
    TeamCount: l.teamEmployeeCount,
    Rate: l.teamCompletionRate,
  }));

  const pieStatusData = [
    { name: "Completed", value: taskReport.completedTasks || 0 },
    { name: "In Progress", value: taskReport.inProgressTasks || 0 },
    { name: "Todo", value: taskReport.todoTasks || 0 },
    { name: "Overdue", value: taskReport.overdueTasks || 0 },
  ].filter((d) => d.value > 0);

  const piePriorityData = [
    { name: "High", value: taskReport.highPriorityCount || 0 },
    { name: "Medium", value: taskReport.mediumPriorityCount || 0 },
    { name: "Low", value: taskReport.lowPriorityCount || 0 },
  ].filter((d) => d.value > 0);

  const lineTrendData = taskReport.monthlyTrends || [];

  return (
    <DashboardLayout>
      <div className="reports-page-wrapper" style={{ maxWidth: "1200px", margin: "0 auto", padding: "10px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ background: "#e0e7ff", color: "#3730a3", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                COMPANY ISOLATED
              </span>
              <span style={{ color: "#64748b", fontSize: "13px" }}>
                {summaryData?.companyName || "Company Analytics"}
              </span>
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", margin: "6px 0 0 0", display: "flex", alignItems: "center", gap: "10px" }}>
              <FaFileAlt style={{ color: "#4f46e5" }} /> Enterprise Analytics & Reports
            </h1>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              style={{ background: "#ef4444", color: "#fff", padding: "10px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}
            >
              <FaFilePdf /> Export PDF
            </button>

            <button
              onClick={handleDownloadExcel}
              disabled={downloading}
              style={{ background: "#10b981", color: "#fff", padding: "10px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}
            >
              <FaFileExcel /> Export Excel
            </button>

            <button
              onClick={handlePrint}
              style={{ background: "#4f46e5", color: "#fff", padding: "10px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}
            >
              <FaPrint /> Print Summary
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div style={{ background: "#ffffff", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>
              <span>Total Projects</span>
              <FaProjectDiagram style={{ color: "#3b82f6", fontSize: "18px" }} />
            </div>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginTop: "8px" }}>
              {summaryData?.totalProjects || 0}
            </div>
            <div style={{ fontSize: "12px", color: "#10b981", marginTop: "4px", fontWeight: "600" }}>
              Progress Rate: {summaryData?.overallProjectCompletionRate || 0}%
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>
              <span>Team Leaders</span>
              <FaUserTie style={{ color: "#8b5cf6", fontSize: "18px" }} />
            </div>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginTop: "8px" }}>
              {summaryData?.totalTeamLeaders || 0}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
              Supervising active teams
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>
              <span>Active Employees</span>
              <FaUsers style={{ color: "#10b981", fontSize: "18px" }} />
            </div>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginTop: "8px" }}>
              {summaryData?.totalEmployees || 0}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
              Company workforce
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>
              <span>Total Tasks</span>
              <FaTasks style={{ color: "#f59e0b", fontSize: "18px" }} />
            </div>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginTop: "8px" }}>
              {summaryData?.totalTasks || 0}
            </div>
            <div style={{ fontSize: "12px", color: "#10b981", marginTop: "4px", fontWeight: "600" }}>
              Completed: {taskReport.completedTasks || 0}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => setActiveTab("EMPLOYEE")}
              style={{
                padding: "10px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px",
                background: activeTab === "EMPLOYEE" ? "#4f46e5" : "#f1f5f9",
                color: activeTab === "EMPLOYEE" ? "#ffffff" : "#475569"
              }}
            >
              <FaUsers /> Employee Performance ({empList.length})
            </button>

            <button
              onClick={() => setActiveTab("LEADERS")}
              style={{
                padding: "10px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px",
                background: activeTab === "LEADERS" ? "#4f46e5" : "#f1f5f9",
                color: activeTab === "LEADERS" ? "#ffffff" : "#475569"
              }}
            >
              <FaUserTie /> Leader Output ({leaderList.length})
            </button>

            <button
              onClick={() => setActiveTab("PROJECT")}
              style={{
                padding: "10px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px",
                background: activeTab === "PROJECT" ? "#4f46e5" : "#f1f5f9",
                color: activeTab === "PROJECT" ? "#ffffff" : "#475569"
              }}
            >
              <FaProjectDiagram /> Project Progress ({projList.length})
            </button>

            <button
              onClick={() => setActiveTab("TASK")}
              style={{
                padding: "10px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px",
                background: activeTab === "TASK" ? "#4f46e5" : "#f1f5f9",
                color: activeTab === "TASK" ? "#ffffff" : "#475569"
              }}
            >
              <FaTasks /> Task Breakdown ({taskReport.totalTasks || 0})
            </button>
          </div>

          {/* Search Box */}
          <div style={{ flex: 1, maxWidth: "360px" }}>
            <SearchBar
              value={searchTerm}
              onChange={(val) => setSearchTerm(val)}
              onSearch={() => {}}
              onClear={() => setSearchTerm("")}
              placeholder="Search reports by employee, leader, project, designation, department..."
            />
          </div>
        </div>

        {/* Charts Container */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "20px", marginBottom: "24px" }}>

          {/* 1. Bar Chart */}
          <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <FaChartBar style={{ color: "#4f46e5" }} /> {activeTab === "LEADERS" ? "Leader Team Performance" : "Employee Task Completion"}
            </h3>
            <div style={{ width: "100%", height: "260px" }}>
              <ResponsiveContainer>
                <BarChart data={activeTab === "LEADERS" ? leaderChartData : empChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={activeTab === "LEADERS" ? "TeamCount" : "Pending"} fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Pie Chart */}
          <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <FaChartPie style={{ color: "#10b981" }} /> Task Status Distribution
            </h3>
            <div style={{ width: "100%", height: "260px" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Line Chart */}
          <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", gridColumn: "1 / -1" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <FaChartLine style={{ color: "#3b82f6" }} /> 6-Month Task Completion Trend
            </h3>
            <div style={{ width: "100%", height: "240px" }}>
              <ResponsiveContainer>
                <LineChart data={lineTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completedCount" name="Tasks Completed" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="createdCount" name="Tasks Assigned" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Data Tables */}
        {activeTab === "EMPLOYEE" && (
          <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#0f172a", fontSize: "16px" }}>Employee Performance Audit</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
                  <th style={{ padding: "10px" }}>ID</th>
                  <th style={{ padding: "10px" }}>Employee</th>
                  <th style={{ padding: "10px" }}>Designation</th>
                  <th style={{ padding: "10px" }}>Leader</th>
                  <th style={{ padding: "10px" }}>Project</th>
                  <th style={{ padding: "10px" }}>Tasks (Done/Total)</th>
                  <th style={{ padding: "10px" }}>Efficiency Rate</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.employeeId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 10px" }}>#{emp.employeeId}</td>
                    <td style={{ padding: "12px 10px", fontWeight: "700", color: "#0f172a" }}>{emp.employeeName}</td>
                    <td style={{ padding: "12px 10px" }}>{emp.designation}</td>
                    <td style={{ padding: "12px 10px" }}>{emp.teamLeader}</td>
                    <td style={{ padding: "12px 10px" }}>{emp.assignedProject}</td>
                    <td style={{ padding: "12px 10px", fontWeight: "600", color: "#16a34a" }}>
                      {emp.completedTasks} / {emp.totalTasks}
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ flex: 1, background: "#e2e8f0", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${emp.completionRate}%`, background: "#10b981", height: "100%" }} />
                        </div>
                        <span style={{ fontWeight: "700", fontSize: "12px" }}>{emp.completionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "LEADERS" && (
          <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#0f172a", fontSize: "16px" }}>Team Leader Deliverables Audit</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
                  <th style={{ padding: "10px" }}>ID</th>
                  <th style={{ padding: "10px" }}>Leader Name</th>
                  <th style={{ padding: "10px" }}>Department</th>
                  <th style={{ padding: "10px" }}>Assigned Project</th>
                  <th style={{ padding: "10px" }}>Team Size</th>
                  <th style={{ padding: "10px" }}>Team Tasks</th>
                  <th style={{ padding: "10px" }}>Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaders.map((l) => (
                  <tr key={l.leaderId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 10px" }}>#{l.leaderId}</td>
                    <td style={{ padding: "12px 10px", fontWeight: "700", color: "#0f172a" }}>{l.leaderName}</td>
                    <td style={{ padding: "12px 10px" }}>{l.department}</td>
                    <td style={{ padding: "12px 10px" }}>{l.assignedProject}</td>
                    <td style={{ padding: "12px 10px", fontWeight: "600" }}>{l.teamEmployeeCount} Members</td>
                    <td style={{ padding: "12px 10px", fontWeight: "600", color: "#16a34a" }}>
                      {l.completedTeamTasks} / {l.totalTeamTasks}
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ flex: 1, background: "#e2e8f0", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${l.teamCompletionRate}%`, background: "#4f46e5", height: "100%" }} />
                        </div>
                        <span style={{ fontWeight: "700", fontSize: "12px" }}>{l.teamCompletionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "PROJECT" && (
          <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#0f172a", fontSize: "16px" }}>Project Progress & Health Audit</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
                  <th style={{ padding: "10px" }}>ID</th>
                  <th style={{ padding: "10px" }}>Project Name</th>
                  <th style={{ padding: "10px" }}>Leader</th>
                  <th style={{ padding: "10px" }}>Priority</th>
                  <th style={{ padding: "10px" }}>Status</th>
                  <th style={{ padding: "10px" }}>Start Date</th>
                  <th style={{ padding: "10px" }}>Progress</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => (
                  <tr key={p.projectId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 10px" }}>#{p.projectId}</td>
                    <td style={{ padding: "12px 10px", fontWeight: "700", color: "#0f172a" }}>{p.projectName}</td>
                    <td style={{ padding: "12px 10px" }}>{p.leaderName}</td>
                    <td style={{ padding: "12px 10px" }}>
                      <span style={{ padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700", background: p.priority === "HIGH" ? "#fee2e2" : "#fef3c7", color: p.priority === "HIGH" ? "#991b1b" : "#92400e" }}>
                        {p.priority}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span style={{ padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700", background: p.status === "COMPLETED" ? "#dcfce7" : "#e0f2fe", color: p.status === "COMPLETED" ? "#166534" : "#0369a1" }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px" }}>{p.startDate}</td>
                    <td style={{ padding: "12px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ flex: 1, background: "#e2e8f0", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${p.progressPercentage}%`, background: "#3b82f6", height: "100%" }} />
                        </div>
                        <span style={{ fontWeight: "700", fontSize: "12px" }}>{p.progressPercentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "TASK" && (
          <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#0f172a", fontSize: "16px" }}>Task Completion Status Breakdown</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", borderLeft: "4px solid #10b981" }}>
                <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Completed Tasks</div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#15803d", marginTop: "4px" }}>
                  {taskReport.completedTasks || 0}
                </div>
              </div>

              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", borderLeft: "4px solid #3b82f6" }}>
                <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>In Progress Tasks</div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#1d4ed8", marginTop: "4px" }}>
                  {taskReport.inProgressTasks || 0}
                </div>
              </div>

              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", borderLeft: "4px solid #f59e0b" }}>
                <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Pending / Todo</div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#b45309", marginTop: "4px" }}>
                  {taskReport.todoTasks || 0}
                </div>
              </div>

              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", borderLeft: "4px solid #ef4444" }}>
                <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Overdue Tasks</div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#b91c1c", marginTop: "4px" }}>
                  {taskReport.overdueTasks || 0}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default Reports;
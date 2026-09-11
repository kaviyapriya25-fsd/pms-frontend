import { Routes, Route, Navigate } from "react-router-dom";

// ================= Authentication =================
import UnifiedLandingPage from "../pages/auth/UnifiedLandingPage";
import Login from "../pages/auth/Login";
import RegisterCompany from "../pages/auth/RegisterCompany";
import ForgotPassword from "../pages/auth/ForgotPassword";

// ================= Team Leader =================
import LeaderLogin from "../pages/leader/Login";
import LeaderDashboard from "../pages/leader/Dashboard";
import AssignTasks from "../pages/leader/AssignTasks";
import TeamMembers from "../pages/leader/TeamMembers";
import LeaderMyProjects from "../pages/leader/MyProjects";

// ================= Employee =================
import EmployeeLogin from "../pages/employee/Login";
import EmployeeDashboard from "../pages/employee/Dashboard";
import MyTasks from "../pages/employee/MyTasks";
import EmployeeMyProjects from "../pages/employee/MyProjects";
import EmployeeProfile from "../pages/employee/Profile";

// ================= Admin =================
import Dashboard from "../pages/admin/Dashboard";
import Projects from "../pages/admin/Projects";
import Employees from "../pages/admin/Employees";
import TeamLeaders from "../pages/admin/TeamLeaders";
import Tasks from "../pages/admin/Tasks";
import Reports from "../pages/admin/Reports";
import Notifications from "../pages/admin/Notifications";
import Settings from "../pages/admin/Settings";

function AppRoutes() {
  return (
    <Routes>

      {/* ================= Unified Landing Portal ================= */}
      <Route path="/" element={<UnifiedLandingPage />} />
      <Route path="/auth" element={<UnifiedLandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterCompany />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ================= Team Leader Portal ================= */}
      <Route path="/leader/login" element={<LeaderLogin />} />
      <Route path="/leader/dashboard" element={<LeaderDashboard />} />
      <Route path="/leader/assign-tasks" element={<AssignTasks />} />
      <Route path="/leader/team-members" element={<TeamMembers />} />
      <Route path="/leader/my-project" element={<LeaderMyProjects />} />
      <Route path="/leader/notifications" element={<Notifications />} />

      {/* ================= Employee Portal ================= */}
      <Route path="/employee/login" element={<EmployeeLogin />} />
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
      <Route path="/employee/my-tasks" element={<MyTasks />} />
      <Route path="/employee/my-project" element={<EmployeeMyProjects />} />
      <Route path="/employee/profile" element={<EmployeeProfile />} />
      <Route path="/employee/notifications" element={<Notifications />} />

      {/* ================= Admin Portal ================= */}
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/projects" element={<Projects />} />
      <Route path="/admin/employees" element={<Employees />} />
      <Route path="/admin/teamleaders" element={<TeamLeaders />} />
      <Route path="/admin/tasks" element={<Tasks />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/notifications" element={<Notifications />} />
      <Route path="/admin/settings" element={<Settings />} />

      {/* ================= Unknown Route ================= */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}

export default AppRoutes;
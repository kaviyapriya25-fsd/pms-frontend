import { Routes, Route } from "react-router-dom";

// Authentication Pages
import Login from "../pages/auth/Login";
import RegisterCompany from "../pages/auth/RegisterCompany";
import ForgotPassword from "../pages/auth/ForgotPassword";

// Admin Pages
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

      {/* ================= Authentication ================= */}

      <Route path="/" element={<Login />} />

      <Route
        path="/register"
        element={<RegisterCompany />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* ================= Admin Dashboard ================= */}

      <Route
        path="/admin/dashboard"
        element={<Dashboard />}
      />

      {/* ================= Projects ================= */}

      <Route
        path="/admin/projects"
        element={<Projects />}
      />

      {/* ================= Employees ================= */}

      <Route
        path="/admin/employees"
        element={<Employees />}
      />

      {/* ================= Team Leaders ================= */}

      <Route
        path="/admin/teamleaders"
        element={<TeamLeaders />}
      />

      {/* ================= Tasks ================= */}

      <Route
        path="/admin/tasks"
        element={<Tasks />}
      />

      {/* ================= Reports ================= */}

      <Route
        path="/admin/reports"
        element={<Reports />}
      />

      {/* ================= Notifications ================= */}

      <Route
        path="/admin/notifications"
        element={<Notifications />}
      />

      {/* ================= Settings ================= */}

      <Route
        path="/admin/settings"
        element={<Settings />}
      />

    </Routes>
  );
}

export default AppRoutes;
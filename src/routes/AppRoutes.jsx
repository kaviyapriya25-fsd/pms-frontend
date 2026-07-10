import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";

import AdminDashboard from "../pages/admin/Dashboard";
import LeaderDashboard from "../pages/leader/Dashboard";
import EmployeeDashboard from "../pages/employee/Dashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/leader/dashboard"
        element={<LeaderDashboard />}
      />

      <Route
        path="/employee/dashboard"
        element={<EmployeeDashboard />}
      />
    </Routes>
  );
}

export default AppRoutes;
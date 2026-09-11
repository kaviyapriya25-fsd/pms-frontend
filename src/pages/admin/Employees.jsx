import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import EmployeeForm from "../../components/forms/EmployeeForm";
import SearchBar from "../../components/common/SearchBar";

import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/employeeService";

import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaUserTie,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
} from "react-icons/fa";

import "./employee.css";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load employees");
      setEmployees([]);
    }
  };

  const handleSave = async (employee) => {
    try {
      if (selectedEmployee) {
        await updateEmployee(selectedEmployee.id, employee);
        toast.success("Employee Updated Successfully");
      } else {
        await addEmployee(employee);
        toast.success("Employee Added Successfully");
      }

      setSelectedEmployee(null);
      setShowForm(false);
      loadEmployees();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Operation Failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Employee?")) return;

    try {
      await deleteEmployee(id);
      toast.success("Employee Deleted Successfully");
      loadEmployees();
    } catch {
      toast.error("Delete Failed");
    }
  };

  // Filter Logic
  const filteredEmployees = employees.filter((emp) => {
    const keyword = search.toLowerCase();
    const matchesSearch =
      emp.name?.toLowerCase().includes(keyword) ||
      emp.email?.toLowerCase().includes(keyword) ||
      emp.designation?.toLowerCase().includes(keyword) ||
      emp.project?.toLowerCase().includes(keyword) ||
      emp.teamLeader?.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "ALL" || emp.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <DashboardLayout>
      <div className="employees-page">

        {/* Header */}
        <div className="employees-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h1>Employees</h1>
            <p style={{ color: "#6b7280", margin: "4px 0 0 0" }}>Manage company employees and team assignments.</p>
          </div>

          <button
            className="add-btn"
            onClick={() => {
              setSelectedEmployee(null);
              setShowForm(true);
            }}
          >
            + Add Employee
          </button>
        </div>

        {/* Stats Cards */}
        <div className="employee-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "20px" }}>

          <div className="stat-card" style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaUsers style={{ fontSize: "24px", color: "#8b5cf6" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "22px" }}>{employees.length}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Total Employees</p>
              </div>
            </div>
          </div>

          <div className="stat-card active-card" style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaCheckCircle style={{ fontSize: "24px", color: "#16a34a" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "22px" }}>{employees.filter((e) => e.status === "ACTIVE").length}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Active</p>
              </div>
            </div>
          </div>

          <div className="stat-card pending-card" style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaTimesCircle style={{ fontSize: "24px", color: "#ef4444" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "22px" }}>{employees.filter((e) => e.status === "INACTIVE").length}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Inactive</p>
              </div>
            </div>
          </div>

          <div className="stat-card" style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaUserTie style={{ fontSize: "24px", color: "#0ea5e9" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "22px" }}>{employees.filter((e) => e.teamLeader && e.teamLeader.trim() !== "").length}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Under Team Leader</p>
              </div>
            </div>
          </div>

        </div>

        {/* Filter and Search Bar */}
        <div style={{ marginBottom: "20px", display: "flex", gap: "15px", alignItems: "center" }}>
          
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            onSearch={() => setCurrentPage(1)}
            onClear={() => setCurrentPage(1)}
            placeholder="Search by Name, Email, Designation, Team Leader, or Project..."
          />

          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", padding: "10px 16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <FaFilter style={{ color: "#6b7280", fontSize: "14px" }} />
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ border: "none", outline: "none", background: "transparent", fontSize: "14px", cursor: "pointer", fontWeight: "600" }}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

        </div>

        {/* Form Modal */}
        {showForm && (
          <EmployeeForm
            onSave={handleSave}
            selectedEmployee={selectedEmployee}
            onCancel={() => {
              setSelectedEmployee(null);
              setShowForm(false);
            }}
          />
        )}

        {/* Profile Modal */}
        {viewingProfile && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", width: "420px", maxWidth: "90%" }}>
              <h2>Employee Profile</h2>
              <div style={{ marginTop: "15px", lineHeight: "1.8" }}>
                <p><strong>Name:</strong> {viewingProfile.name}</p>
                <p><strong>Email:</strong> {viewingProfile.email}</p>
                <p><strong>Phone:</strong> {viewingProfile.phone || "N/A"}</p>
                <p><strong>Designation:</strong> {viewingProfile.designation}</p>
                <p><strong>Team Leader:</strong> {viewingProfile.teamLeader || "None (Direct Employee)"}</p>
                <p><strong>Inherited Project:</strong> {viewingProfile.project || "Unassigned"}</p>
                <p><strong>Status:</strong> {viewingProfile.status}</p>
                <p><strong>Joining Date:</strong> {viewingProfile.joiningDate || "N/A"}</p>
              </div>
              <button
                onClick={() => setViewingProfile(null)}
                style={{ marginTop: "20px", background: "#374151", color: "#fff", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", width: "100%" }}
              >
                Close Profile
              </button>
            </div>
          </div>
        )}

        {/* Table View */}
        <div style={{ overflowX: "auto", width: "100%", borderRadius: "10px", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <table className="employee-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Designation</th>
                <th>Team Leader</th>
                <th>Project (Inherited)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentEmployees.length > 0 ? (
                currentEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td><strong>{emp.name}</strong></td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.designation}</td>

                    <td>
                      {emp.teamLeader && emp.teamLeader.trim() !== "" ? (
                        <span style={{ background: "#f0f9ff", color: "#0369a1", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                          {emp.teamLeader}
                        </span>
                      ) : (
                        <span style={{ background: "#f3f4f6", color: "#9ca3af", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" }}>
                          None
                        </span>
                      )}
                    </td>

                    <td>
                      {emp.project && emp.project.trim() !== "" ? (
                        <span style={{ background: "#e0e7ff", color: "#3730a3", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                          {emp.project}
                        </span>
                      ) : (
                        <span style={{ background: "#f3f4f6", color: "#9ca3af", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" }}>
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td>
                      <span className={(emp.status || "active").toLowerCase()}>
                        {emp.status}
                      </span>
                    </td>

                    <td style={{ display: "flex", gap: "6px" }}>
                      <button
                        className="edit-btn"
                        onClick={() => setViewingProfile(emp)}
                        title="View Profile"
                        style={{ background: "#0ea5e9", color: "#fff", padding: "6px 10px", borderRadius: "4px", border: "none", cursor: "pointer" }}
                      >
                        <FaEye />
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setShowForm(true);
                        }}
                        title="Edit Employee"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(emp.id)}
                        title="Delete Employee"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                    No Employees Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", background: "#fff", padding: "12px 20px", borderRadius: "10px" }}>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEmployees.length)} of {filteredEmployees.length} Employees
            </span>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: "6px", background: currentPage === 1 ? "#f3f4f6" : "#fff", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
              >
                <FaChevronLeft />
              </button>

              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: "6px", background: currentPage === totalPages ? "#f3f4f6" : "#fff", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default Employees;
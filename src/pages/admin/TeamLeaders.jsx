import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";
import TeamLeaderForm from "../../components/forms/TeamLeaderForm";
import SearchBar from "../../components/common/SearchBar";
import {
  getTeamLeaders,
  addTeamLeader,
  updateTeamLeader,
  deleteTeamLeader,
} from "../../services/teamLeaderService";
import { FaUserTie, FaCheckCircle, FaTimesCircle, FaProjectDiagram, FaSearch, FaEye, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./teamleader.css";

function TeamLeaders() {
  const [leaders, setLeaders] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadTeamLeaders();
  }, []);

  const loadTeamLeaders = async () => {
    try {
      const data = await getTeamLeaders();
      setLeaders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load Team Leaders");
      setLeaders([]);
    }
  };

  const handleSave = async (leader) => {
    try {
      if (selectedLeader) {
        await updateTeamLeader(selectedLeader.id, leader);
        toast.success("Team Leader Updated Successfully");
      } else {
        await addTeamLeader(leader);
        toast.success("Team Leader Added Successfully");
      }

      setSelectedLeader(null);
      setShowForm(false);
      loadTeamLeaders();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Operation Failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Team Leader?")) return;

    try {
      await deleteTeamLeader(id);
      toast.success("Team Leader Deleted");
      loadTeamLeaders();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete Failed");
    }
  };

  // Filter Logic
  const filteredLeaders = leaders.filter((leader) => {
    const keyword = search.toLowerCase();
    return (
      leader.name?.toLowerCase().includes(keyword) ||
      leader.email?.toLowerCase().includes(keyword) ||
      leader.department?.toLowerCase().includes(keyword) ||
      leader.status?.toLowerCase().includes(keyword) ||
      leader.project?.toLowerCase().includes(keyword)
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredLeaders.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeaders = filteredLeaders.slice(indexOfFirstItem, indexOfLastItem);

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
            <h1>Team Leaders</h1>
            <p style={{ color: "#6b7280", margin: "4px 0 0 0" }}>Manage team leaders and monitor their assigned projects.</p>
          </div>

          <button
            className="add-btn"
            onClick={() => {
              setSelectedLeader(null);
              setShowForm(true);
            }}
          >
            + Add Team Leader
          </button>
        </div>

        {/* Stats Cards */}
        <div className="employee-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "20px" }}>

          <div className="stat-card" style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaUserTie style={{ fontSize: "24px", color: "#2563eb" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "22px" }}>{leaders.length}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Total Leaders</p>
              </div>
            </div>
          </div>

          <div className="stat-card active-card" style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaCheckCircle style={{ fontSize: "24px", color: "#16a34a" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "22px" }}>{leaders.filter((l) => l.status === "ACTIVE").length}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Active</p>
              </div>
            </div>
          </div>

          <div className="stat-card pending-card" style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaTimesCircle style={{ fontSize: "24px", color: "#ef4444" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "22px" }}>{leaders.filter((l) => l.status === "INACTIVE").length}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Inactive</p>
              </div>
            </div>
          </div>

          <div className="stat-card" style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaProjectDiagram style={{ fontSize: "24px", color: "#8b5cf6" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "22px" }}>{leaders.filter((l) => l.project && l.project.trim() !== "").length}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Assigned to Projects</p>
              </div>
            </div>
          </div>

        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "20px" }}>
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            onSearch={() => setCurrentPage(1)}
            onClear={() => setCurrentPage(1)}
            placeholder="Search by Name, Email, Department, Status, or Project..."
          />
        </div>

        {/* Form Modal */}
        {showForm && (
          <TeamLeaderForm
            onSave={handleSave}
            selectedLeader={selectedLeader}
            onCancel={() => {
              setSelectedLeader(null);
              setShowForm(false);
            }}
          />
        )}

        {/* Profile Modal */}
        {viewingProfile && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", width: "420px", maxWidth: "90%" }}>
              <h2>Team Leader Profile</h2>
              <div style={{ marginTop: "15px", lineHeight: "1.8" }}>
                <p><strong>Name:</strong> {viewingProfile.name}</p>
                <p><strong>Email:</strong> {viewingProfile.email}</p>
                <p><strong>Phone:</strong> {viewingProfile.phone || "N/A"}</p>
                <p><strong>Department:</strong> {viewingProfile.department}</p>
                <p><strong>Status:</strong> {viewingProfile.status}</p>
                <p><strong>Assigned Project:</strong> {viewingProfile.project || "Unassigned"}</p>
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
                <th>Department</th>
                <th>Assigned Project</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentLeaders.length > 0 ? (
                currentLeaders.map((leader) => (
                  <tr key={leader.id}>
                    <td>{leader.id}</td>
                    <td><strong>{leader.name}</strong></td>
                    <td>{leader.email}</td>
                    <td>{leader.phone}</td>
                    <td>{leader.department}</td>

                    <td>
                      {leader.project && leader.project.trim() !== "" ? (
                        <span style={{ background: "#e0e7ff", color: "#3730a3", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                          {leader.project}
                        </span>
                      ) : (
                        <span style={{ background: "#f3f4f6", color: "#9ca3af", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" }}>
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td>
                      <span className={(leader.status || "active").toLowerCase()}>
                        {leader.status}
                      </span>
                    </td>

                    <td style={{ display: "flex", gap: "6px" }}>
                      <button
                        className="edit-btn"
                        onClick={() => setViewingProfile(leader)}
                        title="View Profile"
                        style={{ background: "#0ea5e9", color: "#fff", padding: "6px 10px", borderRadius: "4px", border: "none", cursor: "pointer" }}
                      >
                        <FaEye />
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() => {
                          setSelectedLeader(leader);
                          setShowForm(true);
                        }}
                        title="Edit Leader"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(leader.id)}
                        title="Delete Leader"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                    No Team Leaders Found
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLeaders.length)} of {filteredLeaders.length} Team Leaders
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

export default TeamLeaders;
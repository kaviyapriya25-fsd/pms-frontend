import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ProjectForm from "../../components/forms/ProjectForm";
import SearchBar from "../../components/common/SearchBar";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../../services/projectService";
import {
  FaProjectDiagram,
  FaCheckCircle,
  FaSpinner,
  FaUserTie,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
} from "react-icons/fa";
import "./project.css";

// Auto-generates a colorful gradient logo from project name initials
const PROJECT_GRADIENTS = [
  ["#6366f1", "#8b5cf6"],
  ["#0ea5e9", "#06b6d4"],
  ["#f59e0b", "#ef4444"],
  ["#10b981", "#059669"],
  ["#ec4899", "#f43f5e"],
  ["#f97316", "#fb923c"],
  ["#8b5cf6", "#a78bfa"],
  ["#14b8a6", "#0d9488"],
  ["#3b82f6", "#2563eb"],
  ["#84cc16", "#16a34a"],
];

function ProjectLogo({ name }) {
  const initials = name
    ? name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")
    : "P";
  const colorIndex =
    name
      ? name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) %
        PROJECT_GRADIENTS.length
      : 0;
  const [from, to] = PROJECT_GRADIENTS[colorIndex];
  return (
    <div
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "10px",
        background: `linear-gradient(135deg, ${from}, ${to})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: "800",
        fontSize: "13px",
        letterSpacing: "0.5px",
        flexShrink: 0,
        boxShadow: `0 3px 8px ${from}55`,
      }}
    >
      {initials}
    </div>
  );
}


function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects");
      setProjects([]);
    }
  };

  const handleSave = async (project) => {
    if (project.startDate && project.endDate && project.endDate < project.startDate) {
      toast.error("Target End Date cannot be before Start Date.");
      return;
    }

    try {
      if (selectedProject) {
        await updateProject(selectedProject.id, project);
        toast.success("Project Updated Successfully");
      } else {
        await addProject(project);
        toast.success("Project Created & Assigned Successfully");
      }

      setSelectedProject(null);
      setShowForm(false);
      loadProjects();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Operation Failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(id);
      toast.success("Project Deleted");
      loadProjects();
    } catch (err) {
      console.error(err);
      toast.error("Delete Failed");
    }
  };

  // Filter Logic
  const filteredProjects = projects.filter((p) => {
    const keyword = search.toLowerCase();
    const matchesSearch =
      p.projectName?.toLowerCase().includes(keyword) ||
      p.leader?.toLowerCase().includes(keyword) ||
      p.description?.toLowerCase().includes(keyword) ||
      p.status?.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "ALL" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <DashboardLayout>
      <div className="projects-page">

        {/* Header */}
        <div className="projects-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h1>Company Projects</h1>
            <p style={{ color: "#6b7280", margin: "4px 0 0 0" }}>Manage enterprise projects and assign them to Team Leaders.</p>
          </div>

          <button
            className="add-btn"
            onClick={() => {
              setSelectedProject(null);
              setShowForm(true);
            }}
          >
            + Create New Project
          </button>
        </div>

        {/* Stat Cards */}
        <div className="project-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "20px" }}>

          <div className="stat-card" style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaProjectDiagram style={{ fontSize: "24px", color: "#2563eb" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "22px" }}>{projects.length}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Total Projects</p>
              </div>
            </div>
          </div>

          <div className="stat-card active-card" style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaSpinner style={{ fontSize: "24px", color: "#0284c7" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "22px" }}>{projects.filter((p) => p.status === "ACTIVE" || p.status === "IN_PROGRESS").length}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Active / In Progress</p>
              </div>
            </div>
          </div>

          <div className="stat-card completed-card" style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaCheckCircle style={{ fontSize: "24px", color: "#16a34a" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "22px" }}>{projects.filter((p) => p.status === "COMPLETED").length}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Completed</p>
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
            placeholder="Search by project name, description, or assigned team leader..."
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
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <ProjectForm
            onSave={handleSave}
            selectedProject={selectedProject}
            onCancel={() => {
              setSelectedProject(null);
              setShowForm(false);
            }}
          />
        )}

        {/* View Details Modal */}
        {viewingProject && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: "28px", borderRadius: "14px", width: "480px", maxWidth: "90%" }}>
              <h2>{viewingProject.projectName}</h2>
              <div style={{ marginTop: "15px", lineHeight: "1.8" }}>
                <p><strong>Description:</strong> {viewingProject.description || "No description provided."}</p>
                <p><strong>Assigned Team Leader:</strong> {viewingProject.leader || "Unassigned"}</p>
                <p><strong>Priority:</strong> {viewingProject.priority}</p>
                <p><strong>Status:</strong> {viewingProject.status}</p>
                <p><strong>Start Date:</strong> {viewingProject.startDate || "N/A"}</p>
                <p><strong>End Date:</strong> {viewingProject.endDate || "N/A"}</p>
              </div>
              <button
                onClick={() => setViewingProject(null)}
                style={{ marginTop: "20px", background: "#374151", color: "#fff", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", width: "100%" }}
              >
                Close Project Details
              </button>
            </div>
          </div>
        )}

        {/* Projects Table */}
        <div style={{ overflowX: "auto", width: "100%", borderRadius: "10px", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <table className="project-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Project Name</th>
                <th>Assigned Team Leader</th>
                <th>Priority</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentProjects.length > 0 ? (
                currentProjects.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <ProjectLogo name={p.projectName} />
                        <strong style={{ color: "#1e293b" }}>{p.projectName}</strong>
                      </div>
                    </td>
                    <td>
                      {p.leader ? (
                        <span style={{ background: "#e0e7ff", color: "#3730a3", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                          {p.leader}
                        </span>
                      ) : (
                        <span style={{ background: "#f3f4f6", color: "#9ca3af", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" }}>
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={(p.priority || "medium").toLowerCase()}>
                        {p.priority || "MEDIUM"}
                      </span>
                    </td>
                    <td>{p.startDate || "-"}</td>
                    <td>{p.endDate || "-"}</td>
                    <td>
                      <span className={(p.status || "active").toLowerCase().replace("_", "-")}>
                        {p.status}
                      </span>
                    </td>

                    <td style={{ display: "flex", gap: "6px" }}>
                      <button
                        className="edit-btn"
                        onClick={() => setViewingProject(p)}
                        title="View Details"
                        style={{ background: "#0ea5e9", color: "#fff", padding: "6px 10px", borderRadius: "4px", border: "none", cursor: "pointer" }}
                      >
                        <FaEye />
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() => {
                          setSelectedProject(p);
                          setShowForm(true);
                        }}
                        title="Edit Project"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(p.id)}
                        title="Delete Project"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                    No Projects Found
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProjects.length)} of {filteredProjects.length} Projects
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

export default Projects;
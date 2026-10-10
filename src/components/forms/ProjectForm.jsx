import { useState, useEffect } from "react";
import "../../styles/projectform.css";
import { getTeamLeaders } from "../../services/teamLeaderService";
                          
                     
function ProjectForm({ onSave, selectedProject, onCancel }) {
  const initialState = {
    projectName: "",
    description: "",
    leader: "",
    priority: "MEDIUM",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "ACTIVE",
  };

  const [project, setProject] = useState(initialState);
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState("");
                                            
  useEffect(() => {
    loadLeaders();
  }, []);
                                      
  useEffect(() => {
    if (selectedProject) {
      setProject({
        ...selectedProject,
        leader: selectedProject.leader || "",
      });
    } else {
      setProject(initialState);
    }
    setError("");
  }, [selectedProject]);

  const loadLeaders = async () => {
    try {
      const data = await getTeamLeaders();
      setLeaders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load leaders:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "startDate") {
      setProject((prev) => ({
        ...prev,
        startDate: value,
        endDate: prev.endDate && prev.endDate < value ? "" : prev.endDate,
      }));
      if (project.endDate && project.endDate < value) {
        setError("Target End Date cannot be before Start Date.");
      } else {
        setError("");
      }
      return;
    }

    if (name === "endDate") {
      if (project.startDate && value && value < project.startDate) {
        setError("Target End Date cannot be before Start Date.");
      } else {
        setError("");
      }
    }

    setProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!project.projectName.trim()) {
      setError("Project Name is required.");
      return;
    }
    if (!project.leader.trim()) {
      setError("Please assign a Team Leader.");
      return;
    }
    if (!project.endDate) {
      setError("Target End Date is required.");
      return;
    }
    if (project.startDate && project.endDate && project.endDate < project.startDate) {
      setError("Target End Date cannot be before Start Date.");
      return;
    }

    setError("");
    onSave(project);

    if (!selectedProject) {
      setProject(initialState);
    }
  };

  return (
    <div className="project-form-container">
      <h2>{selectedProject ? "Edit Project Details" : "Create New Project"}</h2>

      {error && <div className="form-error-alert">{error}</div>}

      <form className="project-form" onSubmit={handleSubmit}>

        <div className="form-group full-width">
          <label className="form-label">Project Title *</label>
          <input
            type="text"
            name="projectName"
            placeholder="e.g. NextGen E-Commerce Mobile Portal"
            value={project.projectName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            placeholder="Outline key project objectives, goals and requirements..."
            value={project.description}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        <div className="form-group full-width">
          <label className="form-label">Assign Team Leader *</label>
          <select
            name="leader"
            value={project.leader}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Team Leader --</option>
            {leaders.map((leader) => (
              <option key={leader.id} value={leader.name}>
                {leader.name} ({leader.email}) {leader.project ? `[Current: ${leader.project}]` : "[Available]"}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Priority</label>
          <select name="priority" value={project.priority} onChange={handleChange}>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select name="status" value={project.status} onChange={handleChange}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Start Date *</label>
          <input
            type="date"
            name="startDate"
            value={project.startDate || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Target End Date *</label>
          <input
            type="date"
            name="endDate"
            min={project.startDate || undefined}
            value={project.endDate || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons full-width">
          <button type="submit" className="save-btn">
            {selectedProject ? "Save Project Changes" : "Create & Assign Project"}
          </button>

          {selectedProject && (
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>

      </form>
    </div>
  );
}

export default ProjectForm;
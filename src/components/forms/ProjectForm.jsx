import { useState, useEffect } from "react";
import "../../styles/projectform.css";

function ProjectForm({ onSave, selectedProject, onCancel }) {
  const [project, setProject] = useState({
    projectName: "",
    description: "",
    leader: "",
    startDate: "",
    endDate: "",
    status: "Active",
  });

  useEffect(() => {
    if (selectedProject) {
      setProject(selectedProject);
    }
  }, [selectedProject]);

  const handleChange = (e) => {
    setProject({
      ...project,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(project);

    setProject({
      projectName: "",
      description: "",
      leader: "",
      startDate: "",
      endDate: "",
      status: "Active",
    });
  };

  return (
    <div className="project-form-container">
      <h2>
        {selectedProject ? "Edit Project" : "Add New Project"}
      </h2>

      <form onSubmit={handleSubmit} className="project-form">

        <input
          type="text"
          name="projectName"
          placeholder="Project Name"
          value={project.projectName}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={project.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="leader"
          placeholder="Team Leader"
          value={project.leader}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="startDate"
          value={project.startDate}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="endDate"
          value={project.endDate}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={project.status}
          onChange={handleChange}
        >
          <option>Active</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>

        <div className="form-buttons">
          <button type="submit">
            {selectedProject ? "Update" : "Save"}
          </button>

          {selectedProject && (
            <button
              type="button"
              onClick={onCancel}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
        </div>

      </form>
    </div>
  );
}

export default ProjectForm;
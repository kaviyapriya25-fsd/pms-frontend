import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import ProjectForm from "../../components/forms/ProjectForm";

import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../../services/projectService";

import "./project.css";

function Projects() {

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      toast.error("Failed to load projects");
    }
  };

  const handleSave = async (project) => {
    try {

      if (selectedProject) {

        await updateProject(selectedProject.id, project);

        toast.success("Project Updated Successfully");

      } else {

        await addProject(project);

        toast.success("Project Added Successfully");

      }

      setSelectedProject(null);
      setShowForm(false);

      loadProjects();

    } catch (error) {

      toast.error("Something went wrong");

    }
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this Project?")) return;

    try {

      await deleteProject(id);

      toast.success("Project Deleted Successfully");

      loadProjects();

    } catch (error) {

      toast.error("Delete Failed");

    }

  };

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>

      <div className="projects-page">

        <div className="projects-header">

          <h1>Projects</h1>

          <button
            className="add-btn"
            onClick={() => {
              setSelectedProject(null);
              setShowForm(true);
            }}
          >
            + Add Project
          </button>

        </div>

        <div className="project-stats">

          <div className="stat-card">
            <h3>{projects.length}</h3>
            <p>Total Projects</p>
          </div>

          <div className="stat-card active-card">
            <h3>
              {
                projects.filter(
                  (p) => p.status === "Active"
                ).length
              }
            </h3>
            <p>Active</p>
          </div>

          <div className="stat-card completed-card">
            <h3>
              {
                projects.filter(
                  (p) => p.status === "Completed"
                ).length
              }
            </h3>
            <p>Completed</p>
          </div>

          <div className="stat-card pending-card">
            <h3>
              {
                projects.filter(
                  (p) => p.status === "Pending"
                ).length
              }
            </h3>
            <p>Pending</p>
          </div>

        </div>

        <input
          type="text"
          className="search-box"
          placeholder="Search Project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

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

        <table className="project-table">

          <thead>

            <tr>

              <th>ID</th>
              <th>Project Name</th>
              <th>Leader</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredProjects.length > 0 ? (

              filteredProjects.map((project) => (

                <tr key={project.id}>

                  <td>{project.id}</td>

                  <td>{project.projectName}</td>

                  <td>{project.leader}</td>

                  <td>

                    <span
                      className={project.status.toLowerCase()}
                    >
                      {project.status}
                    </span>

                  </td>

                  <td>{project.startDate}</td>

                  <td>{project.endDate}</td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() => {
                        setSelectedProject(project);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No Projects Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}

export default Projects;
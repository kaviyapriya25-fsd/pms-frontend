import { useEffect, useState } from "react";
import { getProjects } from "../../services/projectService";
import "../../styles/recentProjects.css";

function RecentProjects({ data }) {

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setProjects(data);
    } else {
      loadProjects();
    }
  }, [data]);

  const loadProjects = async () => {
    try {
      const result = await getProjects();
      if (Array.isArray(result)) {
        setProjects(result.slice(-5).reverse());
      }
    } catch (err) {
      console.error("RecentProjects Error:", err);
      setProjects([]);
    }
  };

  return (

    <div className="recent-projects">

      <h3>Recent Projects</h3>

      <table>

        <thead>

          <tr>

            <th>ID</th>

            <th>Project</th>

            <th>Leader</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {projects && projects.length > 0 ? (

            projects.map(project => (

              <tr key={project.id}>

                <td>{project.id}</td>

                <td>{project.projectName}</td>

                <td>{project.leader || "Unassigned"}</td>

                <td>
                  <span className={(project.status || "active").toLowerCase()}>
                    {project.status}
                  </span>
                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td colSpan="4" style={{ textAlign: "center" }}>

                No Projects Available

              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>

  );

}

export default RecentProjects;
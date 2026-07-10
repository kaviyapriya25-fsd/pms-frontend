import "../../styles/recentProjects.css";

function RecentProjects() {

  const projects = [

    {
      id:1,
      name:"Project Management System",
      leader:"Akka",
      status:"Active"
    },

    {
      id:2,
      name:"Student Portal",
      leader:"Priya",
      status:"Completed"
    },

    {
      id:3,
      name:"Employee Tracker",
      leader:"Arun",
      status:"Pending"
    }

  ];

  return(

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

        {

          projects.map(project=>(

            <tr key={project.id}>

              <td>{project.id}</td>

              <td>{project.name}</td>

              <td>{project.leader}</td>

              <td>{project.status}</td>

            </tr>

          ))

        }

        </tbody>

      </table>

    </div>

  );

}

export default RecentProjects;
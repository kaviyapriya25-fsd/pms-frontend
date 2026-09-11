import { useEffect, useState } from "react";
import { getProjects } from "../../services/projectService";
import "../../styles/recentActivity.css";

function RecentActivity({ data }) {

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setActivities(data);
    } else {
      loadActivity();
    }
  }, [data]);

  const loadActivity = async () => {

    try {

      const projects = await getProjects();
      if (Array.isArray(projects)) {
        const latest = projects
          .slice(-5)
          .reverse()
          .map(project => ({
            id: project.id,
            text: `Project "${project.projectName}" created`
          }));

        setActivities(latest);
      }

    } catch (err) {
      console.error("RecentActivity Error:", err);
      setActivities([]);
    }

  };

  return (

    <div className="recent-activity">

      <h3>Recent Activity</h3>

      <ul>

        {activities && activities.length > 0 ? (

          activities.map((activity, index) => (

            <li key={activity.id || index}>

              {activity.text}

            </li>

          ))

        ) : (

          <li>No Recent Activity</li>

        )}

      </ul>

    </div>

  );

}

export default RecentActivity;
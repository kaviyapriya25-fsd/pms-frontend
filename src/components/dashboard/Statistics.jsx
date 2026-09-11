import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaProjectDiagram,
} from "react-icons/fa";

import { getTasks } from "../../services/taskService";
import "../../styles/statistics.css";

function Statistics() {

  const [completed, setCompleted] = useState(0);
  const [pending, setPending] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {

      const tasks = await getTasks();

      setCompleted(
        tasks.filter(task => task.status === "COMPLETED").length
      );

      setPending(
        tasks.filter(task => task.status === "TODO").length
      );

      setProgress(
        tasks.filter(task => task.status === "IN_PROGRESS").length
      );

    } catch (err) {
      console.log(err);
    }
  };

  const total = completed + pending + progress;

  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return (

    <div className="statistics">

      {/* Project Progress */}

      <div className="chart-card">

        <h3>Project Progress</h3>

        <div className="progress-box">

          <FaProjectDiagram className="progress-icon" />

          <h1>{percentage}%</h1>

          <p>Overall Completion</p>

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{ width: `${percentage}%` }}
            ></div>

          </div>

          <span>{completed} Completed Tasks</span>

        </div>

      </div>

      {/* Task Completion */}

      <div className="chart-card">

        <h3>Task Completion</h3>

        <div className="task-grid">

          <div className="task-box pending">

            <FaClock />

            <h2>{pending}</h2>

            <p>Pending</p>

          </div>

          <div className="task-box progress">

            <FaSpinner />

            <h2>{progress}</h2>

            <p>In Progress</p>

          </div>

          <div className="task-box completed">

            <FaCheckCircle />

            <h2>{completed}</h2>

            <p>Completed</p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Statistics;
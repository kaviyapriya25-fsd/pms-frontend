import { useEffect, useState } from "react";
import EmployeeLayout from "../../components/layout/EmployeeLayout";
import SearchBar from "../../components/common/SearchBar";
import KanbanBoard from "../../components/agile/KanbanBoard";
import TaskDetailModal from "../../components/agile/TaskDetailModal";
import { getTasks } from "../../services/taskService";
import { FaClipboardList } from "react-icons/fa";

function MyTasks() {
  const employeeName = localStorage.getItem("name") || "Employee";

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTaskModal, setSelectedTaskModal] = useState(null);

  useEffect(() => {
    loadMyTasks();
  }, []);

  const loadMyTasks = async () => {
    try {
      setLoading(true);
      const allTasks = await getTasks();
      const myTasks = allTasks.filter(
        (t) => t.employee === employeeName || (t.employee && t.employee.toLowerCase() === employeeName.toLowerCase())
      );
      setTasks(myTasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const k = search.toLowerCase();
    return (
      t.taskName?.toLowerCase().includes(k) ||
      t.description?.toLowerCase().includes(k) ||
      t.project?.toLowerCase().includes(k)
    );
  });

  return (
    <EmployeeLayout>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "10px 0" }}>

        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
            Agile Work Board & Time Logger
          </h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>
            Track assigned deliverables, log work hours, and advance status across Kanban stages.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "20px" }}>
          <SearchBar
            value={search}
            onChange={(val) => setSearch(val)}
            onSearch={() => {}}
            onClear={() => setSearch("")}
            placeholder="Search your assigned tasks by title, project, or sprint..."
          />
        </div>

        {/* Agile Kanban Board */}
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading your tasks...</div>
        ) : (
          <KanbanBoard
            tasks={filteredTasks}
            onTaskUpdated={loadMyTasks}
            onSelectTask={(task) => setSelectedTaskModal(task)}
            role="employee"
          />
        )}

        {/* Task Detail & Work Logger Modal */}
        {selectedTaskModal && (
          <TaskDetailModal
            task={selectedTaskModal}
            onClose={() => setSelectedTaskModal(null)}
            onTaskUpdated={loadMyTasks}
          />
        )}

      </div>
    </EmployeeLayout>
  );
}

export default MyTasks;

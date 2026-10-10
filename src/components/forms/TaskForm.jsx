import { useState, useEffect } from "react";
import { getProjects } from "../../services/projectService";
import { getTeamLeaders } from "../../services/teamLeaderService";
import { getEmployees } from "../../services/employeeService";
import "../../styles/taskform.css";

function TaskForm({ onSave, selectedTask, onCancel }) {

    const initialState = {
        taskName: "",
        description: "",
        priority: "MEDIUM",
        status: "TODO",
        project: "",
        teamLeader: "",
        employee: "",
        startDate: "",
        dueDate: "",
        backendCompleted: false,
        frontendCompleted: false,
        integrationCompleted: false,
    };

    const [task, setTask] = useState(initialState);
    const [projects, setProjects] = useState([]);
    const [leaders, setLeaders] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedTask) {
            setTask({ ...selectedTask });
        } else {
            setTask(initialState);
        }
    }, [selectedTask]);

    useEffect(() => {
        if (task.teamLeader) {
            const filtered = employees.filter(
                (emp) => emp.teamLeader === getLeaderNameByEmail(task.teamLeader)
                       || emp.email === task.employee
            );
            setFilteredEmployees(filtered.length > 0 ? filtered : employees);
        } else {
            setFilteredEmployees(employees);
        }
    }, [task.teamLeader, employees]);

    const loadData = async () => {
        try {
            const [projectData, leaderData, employeeData] = await Promise.all([
                getProjects(),
                getTeamLeaders(),
                getEmployees(),
            ]);
            setProjects(projectData);
            setLeaders(leaderData);
            setEmployees(employeeData);
            setFilteredEmployees(employeeData);
        } catch (err) {
            console.log("Failed to load task form data:", err);
        }
    };

    const getLeaderNameByEmail = (email) => {
        const found = leaders.find((l) => l.email === email);
        return found ? found.name : "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "project") {
            const selectedProject = projects.find((p) => p.projectName === value);
            setTask((prev) => ({
                ...prev,
                project: value,
                teamLeader: selectedProject ? selectedProject.leader : prev.teamLeader,
                employee: "",
            }));
            return;
        }

        if (name === "teamLeader") {
            setTask((prev) => ({
                ...prev,
                teamLeader: value,
                employee: "",
            }));
            return;
        }

        if (name === "startDate") {
            setTask((prev) => ({
                ...prev,
                startDate: value,
                dueDate: prev.dueDate && prev.dueDate < value ? "" : prev.dueDate,
            }));
            return;
        }

        setTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (task.startDate && task.dueDate && task.dueDate < task.startDate) {
            alert("Task Due Date cannot be before Start Date.");
            return;
        }
        onSave(task);
        if (!selectedTask) {
            setTask(initialState);
        }
    };

    return (
        <div className="task-form-container">
            <h2>{selectedTask ? "Update Task" : "Create Task"}</h2>

            <form className="task-form" onSubmit={handleSubmit}>

                <div className="form-group full-width">
                    <label className="form-label">Task Name *</label>
                    <input
                        name="taskName"
                        placeholder="e.g. Implement OAuth Authentication"
                        value={task.taskName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group full-width">
                    <label className="form-label">Description *</label>
                    <textarea
                        name="description"
                        placeholder="Detailed task instructions..."
                        value={task.description}
                        onChange={handleChange}
                        rows={3}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Project *</label>
                    <select
                        name="project"
                        value={task.project}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Project</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.projectName}>
                                {project.projectName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Team Leader *</label>
                    <select
                        name="teamLeader"
                        value={task.teamLeader}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Team Leader</option>
                        {leaders.map((leader) => (
                            <option key={leader.id} value={leader.email}>
                                {leader.name} ({leader.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Assigned Employee *</label>
                    <select
                        name="employee"
                        value={task.employee}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Employee</option>
                        {filteredEmployees.map((emp) => (
                            <option key={emp.id} value={emp.email}>
                                {emp.name} ({emp.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select
                        name="priority"
                        value={task.priority}
                        onChange={handleChange}
                    >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="URGENT">URGENT</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                        name="status"
                        value={task.status}
                        onChange={handleChange}
                    >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={task.startDate || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        min={task.startDate || undefined}
                        value={task.dueDate || ""}
                        onChange={handleChange}
                    />
                </div>



                <div className="form-buttons full-width">
                    <button type="submit" className="save-btn">
                        {selectedTask ? "Update Task" : "Save Task"}
                    </button>

                    {selectedTask && (
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    )}
                </div>

            </form>
        </div>
    );
}

export default TaskForm;
import { useEffect, useState } from "react";
import "../../styles/teamleaderform.css";

function TeamLeaderForm({ onSave, selectedLeader, onCancel }) {

  const [leader, setLeader] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    project: "",
    status: "Active",
  });

  useEffect(() => {
    if (selectedLeader) {
      setLeader(selectedLeader);
    }
  }, [selectedLeader]);

  const handleChange = (e) => {
    setLeader({
      ...leader,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave(leader);

    setLeader({
      name: "",
      email: "",
      phone: "",
      department: "",
      project: "",
      status: "Active",
    });
  };

  return (
    <div className="teamleader-form-container">

      <h2>
        {selectedLeader ? "Edit Team Leader" : "Add Team Leader"}
      </h2>

      <form
        className="teamleader-form"
        onSubmit={handleSubmit}
      >

        <input
          name="name"
          placeholder="Leader Name"
          value={leader.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          value={leader.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={leader.phone}
          onChange={handleChange}
          required
        />

        <input
          name="department"
          placeholder="Department"
          value={leader.department}
          onChange={handleChange}
          required
        />

        <input
          name="project"
          placeholder="Project"
          value={leader.project}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={leader.status}
          onChange={handleChange}
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <div className="form-buttons">

          <button type="submit">
            {selectedLeader ? "Update" : "Save"}
          </button>

          {selectedLeader && (
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

export default TeamLeaderForm;
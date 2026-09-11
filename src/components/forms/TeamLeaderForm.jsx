import { useState, useEffect } from "react";
import "../../styles/teamleaderform.css";

function TeamLeaderForm({ onSave, selectedLeader, onCancel }) {

  const initialState = {
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    joiningDate: "",
    status: "ACTIVE",
  };

  const [leader, setLeader] = useState(initialState);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedLeader) {
      setLeader({
        id: selectedLeader.id,
        name: selectedLeader.name || "",
        email: selectedLeader.email || "",
        password: "",
        phone: selectedLeader.phone || "",
        department: selectedLeader.department || "",
        joiningDate: selectedLeader.joiningDate || "",
        status: selectedLeader.status || "ACTIVE",
      });
    } else {
      setLeader(initialState);
    }
    setError("");
  }, [selectedLeader]);

  const handleChange = (e) => {
    setLeader({
      ...leader,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!leader.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!leader.email.trim() || !leader.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!leader.phone.trim()) {
      setError("Phone number is required.");
      return;
    }
    if (!leader.department.trim()) {
      setError("Department is required.");
      return;
    }

    setError("");
    onSave(leader);

    if (!selectedLeader) {
      setLeader(initialState);
    }
  };

  return (
    <div className="teamleader-form-container">
      <h2>{selectedLeader ? "Edit Team Leader" : "Add Team Leader"}</h2>

      {error && <div className="form-error-alert">{error}</div>}

      {!selectedLeader && (
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "12px", color: "#1e40af", fontWeight: "600" }}>
          🔒 <strong>Security Feature:</strong> Passwords are not set by Admin. An invitation email will be dispatched to the leader's Gmail address to set their password via OTP on first login.
        </div>
      )}

      <form className="teamleader-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label className="form-label">Leader Name *</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Alex Morgan"
            value={leader.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            name="email"
            placeholder="e.g. alex@company.com"
            value={leader.email}
            onChange={handleChange}
            disabled={!!selectedLeader}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input
            type="text"
            name="phone"
            placeholder="e.g. +1 234 567 8900"
            value={leader.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Department *</label>
          <input
            type="text"
            name="department"
            placeholder="e.g. Software Engineering"
            value={leader.department}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Joining Date</label>
          <input
            type="date"
            name="joiningDate"
            value={leader.joiningDate || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            name="status"
            value={leader.status}
            onChange={handleChange}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <div className="form-buttons full-width">
          <button type="submit" className="save-btn">
            {selectedLeader ? "Update Team Leader" : "Save Team Leader"}
          </button>

          {selectedLeader && (
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>

      </form>
    </div>
  );
}

export default TeamLeaderForm;
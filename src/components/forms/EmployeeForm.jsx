import { useState, useEffect } from "react";
import { getTeamLeaders } from "../../services/teamLeaderService";
import "../../styles/employeeform.css";

function EmployeeForm({ onSave, selectedEmployee, onCancel }) {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState("");

  const initialState = {
    name: "",
    email: "",
    password: "",
    phone: "",
    designation: "",
    project: "",      // auto-set from selected team leader
    department: "",   // auto-set from selected team leader
    teamLeader: "",   // optional
    joiningDate: "",
    status: "ACTIVE",
  };

  const [employee, setEmployee] = useState(initialState);

  useEffect(() => {
    loadLeaders();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      setEmployee({
        ...selectedEmployee,
        password: "", // don't pre-fill password on edit
      });
    } else {
      setEmployee(initialState);
    }
    setError("");
  }, [selectedEmployee]);

  const loadLeaders = async () => {
    try {
      const data = await getTeamLeaders();
      setLeaders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load team leaders:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "teamLeader") {
      const selectedLeaderObj = leaders.find((l) => l.name === value || l.email === value);
      setEmployee((prev) => ({
        ...prev,
        teamLeader: value,
        project: selectedLeaderObj ? (selectedLeaderObj.project || "") : "",
        department: selectedLeaderObj ? (selectedLeaderObj.department || "") : "",
      }));
      return;
    }

    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!employee.name.trim()) {
      setError("Employee Name is required.");
      return;
    }
    if (!employee.email.trim() || !employee.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!employee.phone.trim()) {
      setError("Phone number is required.");
      return;
    }
    if (!employee.designation.trim()) {
      setError("Designation is required.");
      return;
    }

    setError("");
    onSave(employee);

    if (!selectedEmployee) {
      setEmployee(initialState);
    }
  };

  return (
    <div className="employee-form-container">
      <h2>{selectedEmployee ? "Edit Employee" : "Add Employee"}</h2>

      {error && <div className="form-error-alert">{error}</div>}

      {!selectedEmployee && (
        <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "12px", color: "#065f46", fontWeight: "600" }}>
          🔒 <strong>Security Feature:</strong> Passwords are not set by Admin. An invitation email will be dispatched to the employee's Gmail address to set their password via OTP on first login.
        </div>
      )}

      <form className="employee-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label className="form-label">Employee Name *</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. John Doe"
            value={employee.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            name="email"
            placeholder="e.g. john@company.com"
            value={employee.email}
            onChange={handleChange}
            disabled={!!selectedEmployee}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input
            type="text"
            name="phone"
            placeholder="e.g. +1 234 567 8900"
            value={employee.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Designation *</label>
          <input
            type="text"
            name="designation"
            placeholder="e.g. Frontend Developer"
            value={employee.designation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Team Leader (Optional)</label>
          <select
            name="teamLeader"
            value={employee.teamLeader}
            onChange={handleChange}
          >
            <option value="">-- No Team Leader (Optional) --</option>
            {leaders.map((leader) => (
              <option key={leader.id} value={leader.name}>
                {leader.name} {leader.project ? `(Project: ${leader.project})` : "(Unassigned)"}
              </option>
            ))}
          </select>
        </div>

        {employee.teamLeader && (
          <div className="form-group full-width">
            <div className="inherited-info-badge">
              <p className="inherited-title">
                Inherited Project: <strong>{employee.project || "None (Leader has no project)"}</strong>
              </p>
              {employee.department && (
                <p className="inherited-subtitle">
                  Department: {employee.department}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Joining Date</label>
          <input
            type="date"
            name="joiningDate"
            value={employee.joiningDate || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select name="status" value={employee.status} onChange={handleChange}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <div className="form-buttons full-width">
          <button type="submit" className="save-btn">
            {selectedEmployee ? "Update Employee" : "Save Employee"}
          </button>

          {selectedEmployee && (
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>

      </form>
    </div>
  );
}

export default EmployeeForm;
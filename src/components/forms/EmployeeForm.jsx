import { useState, useEffect } from "react";
import "../../styles/employeeform.css";

function EmployeeForm({ onSave, selectedEmployee, onCancel }) {

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    status: "Active",
  });

  useEffect(() => {
    if (selectedEmployee) {
      setEmployee(selectedEmployee);
    }
  }, [selectedEmployee]);

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    onSave(employee);

    setEmployee({
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      status: "Active",
    });

  };

  return (

    <div className="employee-form-container">

      <h2>

        {selectedEmployee ? "Edit Employee" : "Add Employee"}

      </h2>

      <form
        className="employee-form"
        onSubmit={handleSubmit}
      >

        <input
          name="name"
          placeholder="Employee Name"
          value={employee.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          value={employee.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={employee.phone}
          onChange={handleChange}
          required
        />

        <input
          name="department"
          placeholder="Department"
          value={employee.department}
          onChange={handleChange}
          required
        />

        <input
          name="designation"
          placeholder="Designation"
          value={employee.designation}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={employee.status}
          onChange={handleChange}
        >

          <option>Active</option>

          <option>Inactive</option>

        </select>

        <div className="form-buttons">

          <button type="submit">

            {selectedEmployee ? "Update" : "Save"}

          </button>

          {selectedEmployee && (

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

export default EmployeeForm;
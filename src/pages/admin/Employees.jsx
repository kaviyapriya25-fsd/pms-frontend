import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import EmployeeForm from "../../components/forms/EmployeeForm";

import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/employeeService";

import "./employee.css";

function Employees() {

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {

      const data = await getEmployees();

      console.log("Employees from Backend:", data);

      setEmployees(data);

    } catch (error) {

      console.log(error);

      toast.error("Failed to load employees");

    }
  };

  const handleSave = async (employee) => {

    try {

      if (selectedEmployee) {

        await updateEmployee(selectedEmployee.id, employee);

        toast.success("Employee Updated Successfully");

      } else {

        await addEmployee(employee);

        toast.success("Employee Added Successfully");

      }

      setSelectedEmployee(null);
      setShowForm(false);

      loadEmployees();

    } catch {

      toast.error("Operation Failed");

    }

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete Employee?")) return;

    try {

      await deleteEmployee(id);

      toast.success("Employee Deleted");

      loadEmployees();

    } catch {

      toast.error("Delete Failed");

    }

  };

  const filteredEmployees = employees.filter((emp) => {

    const keyword = search.toLowerCase();

    return (

      emp.name?.toLowerCase().includes(keyword) ||

      emp.email?.toLowerCase().includes(keyword) ||

      emp.department?.toLowerCase().includes(keyword) ||

      emp.designation?.toLowerCase().includes(keyword)

    );

  });

  return (

    <DashboardLayout>

      <div className="employees-page">

        <div className="employees-header">

          <h1>Employees</h1>

          <button
            className="add-btn"
            onClick={() => {
              setSelectedEmployee(null);
              setShowForm(true);
            }}
          >
            + Add Employee
          </button>

        </div>

        <div className="employee-stats">

          <div className="stat-card">

            <h3>{employees.length}</h3>

            <p>Total Employees</p>

          </div>

          <div className="stat-card active-card">

            <h3>

              {employees.filter((e) => e.status === "Active").length}

            </h3>

            <p>Active</p>

          </div>

          <div className="stat-card pending-card">

            <h3>

              {employees.filter((e) => e.status === "Inactive").length}

            </h3>

            <p>Inactive</p>

          </div>

        </div>

        <input
          className="search-box"
          placeholder="Search by Name, Email, Department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {showForm && (

          <EmployeeForm
            onSave={handleSave}
            selectedEmployee={selectedEmployee}
            onCancel={() => {
              setSelectedEmployee(null);
              setShowForm(false);
            }}
          />

        )}

        <table className="employee-table">

          <thead>

            <tr>

              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredEmployees.length > 0 ? (

              filteredEmployees.map((emp) => (

                <tr key={emp.id}>

                  <td>{emp.id}</td>

                  <td>{emp.name}</td>

                  <td>{emp.email}</td>

                  <td>{emp.phone}</td>

                  <td>{emp.department}</td>

                  <td>{emp.designation}</td>

                  <td>

                    <span className={emp.status.toLowerCase()}>

                      {emp.status}

                    </span>

                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(emp.id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="8" style={{ textAlign: "center" }}>

                  No Employees Found

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </DashboardLayout>

  );

}

export default Employees;
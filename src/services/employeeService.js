import api from "./api";

const getCompanyId = () => localStorage.getItem("companyId");

// ======================
// Get Employees
// ======================
export const getEmployees = async () => {
  const response = await api.get("/employees", {
    params: {
      companyId: getCompanyId(),
    },
  });

  return response.data;
};

// ======================
// Add Employee
// ======================
export const addEmployee = async (employee) => {

  employee.company = {
    id: Number(getCompanyId()),
  };

  const response = await api.post("/employees", employee);

  return response.data;
};

// ======================
// Update Employee
// ======================
export const updateEmployee = async (id, employee) => {

  employee.company = {
    id: Number(getCompanyId()),
  };

  const response = await api.put(`/employees/${id}`, employee);

  return response.data;
};

// ======================
// Delete Employee
// ======================
export const deleteEmployee = async (id) => {
  await api.delete(`/employees/${id}`);
};
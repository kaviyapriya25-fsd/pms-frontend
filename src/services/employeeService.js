import api from "./api";

export const getEmployees = async () => {
  const response = await api.get("/employees");
  return response.data;
};

export const addEmployee = async (employee) => {
  const response = await api.post("/employees", employee);
  return response.data;
};

export const updateEmployee = async (id, employee) => {
  const response = await api.put(`/employees/${id}`, employee);
  return response.data;
};

export const deleteEmployee = async (id) => {
  await api.delete(`/employees/${id}`);
};
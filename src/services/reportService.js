import api from "./api";

export const getProjectCount = async () => {
  const res = await api.get("/projects");
  return res.data.length;
};

export const getEmployeeCount = async () => {
  const res = await api.get("/employees");
  return res.data.length;
};

export const getLeaderCount = async () => {
  const res = await api.get("/teamleaders");
  return res.data.length;
};

export const getTaskCount = async () => {
  const res = await api.get("/tasks");
  return res.data.length;
};
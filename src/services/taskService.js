import api from "./api";

export const getTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

export const addTask = async (task) => {
  const response = await api.post("/tasks", task);
  return response.data;
};

export const updateTask = async (id, task) => {
  const response = await api.put(`/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
};
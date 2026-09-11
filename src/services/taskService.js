import api from "./api";

const getCompanyId = () => localStorage.getItem("companyId");

export const getTasks = async () => {
  const response = await api.get("/tasks", {
    params: {
      companyId: getCompanyId(),
    },
  });
  return response.data;
};

export const getLeaderTasks = async (email) => {
  const response = await api.get(`/tasks/leader/${email}`);
  return response.data;
};

export const getEmployeeTasks = async (email) => {
  const response = await api.get(`/tasks/employee/${email}`);
  return response.data;
};

export const addTask = async (task) => {
  task.company = {
    id: Number(getCompanyId()),
  };
  const response = await api.post("/tasks", task);
  return response.data;
};

export const updateTask = async (id, task) => {
  task.company = {
    id: Number(getCompanyId()),
  };
  const response = await api.put(`/tasks/${id}`, task);
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await api.patch(`/tasks/${id}/status`, { status });
  return response.data;
};

export const uploadWorkSubmission = async (id, workSubmission) => {
  const response = await api.patch(`/tasks/${id}/work`, { workSubmission });
  return response.data;
};

export const addTaskComment = async (id, comment, author) => {
  const response = await api.post(`/tasks/${id}/comments`, { comment, author });
  return response.data;
};

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
};
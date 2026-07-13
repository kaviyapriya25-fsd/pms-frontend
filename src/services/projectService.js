import api from "./api";

// Get all projects
export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

// Add project
export const addProject = async (project) => {
  const response = await api.post("/projects", project);
  return response.data;
};

// Update project
export const updateProject = async (id, project) => {
  const response = await api.put(`/projects/${id}`, project);
  return response.data;
};

// Delete project
export const deleteProject = async (id) => {
  await api.delete(`/projects/${id}`);
};
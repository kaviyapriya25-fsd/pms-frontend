import api from "./api";

const getCompanyId = () => localStorage.getItem("companyId");

export const getProjects = async () => {
  const response = await api.get("/projects", {
    params: {
      companyId: getCompanyId(),
    },
  });
  return response.data;
};

export const addProject = async (project) => {
  project.company = {
    id: Number(getCompanyId()),
  };
  const response = await api.post("/projects", project);
  return response.data;
};

export const updateProject = async (id, project) => {
  project.company = {
    id: Number(getCompanyId()),
  };
  const response = await api.put(`/projects/${id}`, project);
  return response.data;
};

export const deleteProject = async (id) => {
  await api.delete(`/projects/${id}`);
};
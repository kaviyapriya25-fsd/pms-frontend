import api from "./api";

export const getTeamLeaders = async () => {
  const response = await api.get("/teamleaders");
  return response.data;
};

export const addTeamLeader = async (leader) => {
  const response = await api.post("/teamleaders", leader);
  return response.data;
};

export const updateTeamLeader = async (id, leader) => {
  const response = await api.put(`/teamleaders/${id}`, leader);
  return response.data;
};

export const deleteTeamLeader = async (id) => {
  await api.delete(`/teamleaders/${id}`);
};
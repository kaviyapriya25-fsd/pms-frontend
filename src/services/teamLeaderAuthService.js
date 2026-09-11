import api from "./api";

export const loginTeamLeader = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
    role: "TEAM_LEADER",
  });

  return response.data;
};
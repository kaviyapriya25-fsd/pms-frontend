import api from "./api";

const getCompanyId = () => localStorage.getItem("companyId");

// ======================
// Get Team Leaders
// ======================
export const getTeamLeaders = async () => {
  const response = await api.get("/teamleaders", {
    params: {
      companyId: getCompanyId(),
    },
  });

  return response.data;
};

// ======================
// Active Team Leaders
// ======================
export const getAvailableLeaders = async () => {

  const response = await api.get("/teamleaders", {
    params: {
      companyId: getCompanyId(),
    },
  });

  return response.data.filter(
    (leader) => leader.status === "ACTIVE"
  );
};

// ======================
// Add Team Leader
// ======================
export const addTeamLeader = async (leader) => {

  leader.company = {
    id: Number(getCompanyId()),
  };

  const response = await api.post("/teamleaders", leader);

  return response.data;
};

// ======================
// Update Team Leader
// ======================
export const updateTeamLeader = async (id, leader) => {

  leader.company = {
    id: Number(getCompanyId()),
  };

  const response = await api.put(`/teamleaders/${id}`, leader);

  return response.data;
};

// ======================
// Delete Team Leader
// ======================
export const deleteTeamLeader = async (id) => {
  await api.delete(`/teamleaders/${id}`);
};
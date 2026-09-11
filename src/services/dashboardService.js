import api from "./api";

export const getDashboardCounts = async () => {
  try {
    const companyId = localStorage.getItem("companyId");
    const response = await api.get("/dashboard", {
      params: { companyId },
    });
    return response.data;
  } catch (error) {
    console.error("Dashboard Service Error:", error);
    return {
      employees: 0,
      teamLeaders: 0,
      projects: 0,
      activeProjects: 0,
      inProgressProjects: 0,
      completedProjects: 0,
      tasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      completedTasks: 0,
      recentProjects: [],
      recentActivities: [],
      recentNotifications: [],
    };
  }
};

export const getLeaderDashboardCounts = async () => {
  try {
    const companyId = localStorage.getItem("companyId");
    const leaderEmail = localStorage.getItem("email");
    const leaderName = localStorage.getItem("name") || localStorage.getItem("leaderName");

    const response = await api.get("/dashboard/leader", {
      params: { companyId, leaderEmail, leaderName },
    });
    return response.data;
  } catch (error) {
    console.error("Leader Dashboard Service Error:", error);
    return null;
  }
};
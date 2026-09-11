import api from "./api";

const getCompanyId = () => Number(localStorage.getItem("companyId"));
const getUserEmail = () => localStorage.getItem("email") || "";
const getUserRole = () => localStorage.getItem("role") || "";

export const getNotifications = async () => {
  const response = await api.get("/notifications", {
    params: {
      companyId: getCompanyId(),
      email: getUserEmail(),
      role: getUserRole(),
    },
  });
  return response.data;
};

export const addNotification = async (notification) => {
  notification.companyId = getCompanyId();
  const response = await api.post("/notifications", notification);
  return response.data;
};

export const updateNotification = async (id, notification) => {
  notification.companyId = getCompanyId();
  const response = await api.put(`/notifications/${id}`, notification);
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get("/notifications/unread-count", {
    params: {
      companyId: getCompanyId(),
      email: getUserEmail(),
      role: getUserRole(),
    },
  });
  return response.data?.unreadCount || 0;
};

export const markAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.put(`/notifications/read-all`, null, {
    params: {
      companyId: getCompanyId(),
      email: getUserEmail(),
      role: getUserRole(),
    },
  });
  return response.data;
};

export const deleteNotification = async (id) => {
  await api.delete(`/notifications/${id}`);
};
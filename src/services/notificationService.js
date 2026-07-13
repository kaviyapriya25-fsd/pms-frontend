import api from "./api";

export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const addNotification = async (notification) => {
  const response = await api.post("/notifications", notification);
  return response.data;
};

export const updateNotification = async (id, notification) => {
  const response = await api.put(`/notifications/${id}`, notification);
  return response.data;
};

export const deleteNotification = async (id) => {
  await api.delete(`/notifications/${id}`);
};
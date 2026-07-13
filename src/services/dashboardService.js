import axios from "axios";

const API = "http://localhost:8081";

export const getDashboardCounts = async () => {
  try {
    const response = await axios.get(`${API}/dashboard`);
    return response.data;
  } catch (error) {
    console.error("Error loading dashboard:", error);
    throw error;
  }
};
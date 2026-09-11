import api from "./api";

export const registerCompany = async (company) => {
  const response = await api.post("/auth/register-company", company);
  return response.data;
};

export const sendOtp = async (email, role) => {
  const response = await api.post("/auth/send-otp", { email, role });
  return response.data;
};

export const resendOtp = async (email, role) => {
  const response = await api.post("/auth/resend-otp", { email, role });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await api.post("/auth/verify-otp", { email, otp });
  return response.data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const response = await api.post("/auth/reset-password", { email, otp, newPassword });
  return response.data;
};

export const sendRegistrationOtp = async (email) => {
  const response = await api.post("/auth/send-registration-otp", { email });
  return response.data;
};

export const verifyRegistrationOtp = async (email, otp) => {
  const response = await api.post("/auth/verify-registration-otp", { email, otp });
  return response.data;
};

export const googleLogin = async (email, name, googleId, role) => {
  const response = await api.post("/auth/google-login", { email, name, googleId, role });
  return response.data;
};
import api from "./api";

export const getCompanyProfile = async () => {
  const response = await api.get("/company/profile");
  return response.data;
};

export const updateCompanyProfile = async (companyData) => {
  const response = await api.put("/company/profile", companyData);
  return response.data;
};

export const updateCompanyLogo = async (logoUrl) => {
  const response = await api.post("/company/logo", logoUrl, {
    headers: { "Content-Type": "text/plain" },
  });
  return response.data;
};

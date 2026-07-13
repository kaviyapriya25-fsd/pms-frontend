import api from "./api";

export const registerCompany = async (company) => {

    const response = await api.post(
        "/auth/register-company",
        company
    );

    return response.data;

};
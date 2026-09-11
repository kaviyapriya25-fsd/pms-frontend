import api from "./api";

export const getReportSummary = async (companyId) => {
  const response = await api.get("/reports/summary", {
    params: { companyId },
  });
  return response.data;
};

export const getReportData = async (companyId) => {
  const summary = await getReportSummary(companyId);
  return {
    projects: summary.projectProgressList || [],
    tasks: summary.employeePerformanceList || [],
    summary,
  };
};

export const getEmployeePerformance = async (companyId) => {
  const response = await api.get("/reports/employee-performance", {
    params: { companyId },
  });
  return response.data;
};

export const getLeaderPerformance = async (companyId) => {
  const response = await api.get("/reports/leader-performance", {
    params: { companyId },
  });
  return response.data;
};

export const getProjectProgress = async (companyId) => {
  const response = await api.get("/reports/project-progress", {
    params: { companyId },
  });
  return response.data;
};

export const getTaskCompletion = async (companyId) => {
  const response = await api.get("/reports/task-completion", {
    params: { companyId },
  });
  return response.data;
};

export const downloadExcelReport = async (type = "EMPLOYEE", companyId) => {
  const response = await api.get("/reports/export/excel", {
    params: { type, companyId },
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `PMS_${type.toUpperCase()}_REPORT.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadPdfReport = async (type = "EMPLOYEE", companyId) => {
  const response = await api.get("/reports/export/pdf", {
    params: { type, companyId },
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `PMS_${type.toUpperCase()}_REPORT.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
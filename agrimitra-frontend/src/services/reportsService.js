import api from "./api";

export async function getReportsSummary() {
  const { data } = await api.get("/reports");
  return data;
}

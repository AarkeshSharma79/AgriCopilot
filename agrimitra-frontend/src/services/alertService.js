import api from "./api";

export async function getAlerts() {
  const { data } = await api.get("/alerts");
  return data;
}

export async function createAlert(alertData) {
  const { data } = await api.post("/alerts", alertData);
  return data;
}

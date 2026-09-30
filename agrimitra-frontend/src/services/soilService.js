import api from "./api";

export async function getSoilHealth(farmId) {
  const { data } = await api.get(`/farms/${farmId}/soil-health`);
  return data;
}

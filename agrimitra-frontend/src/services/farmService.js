import api from "./api";

export async function getFarms() {
  const { data } = await api.get("/farms");
  return data;
}

export async function getFarmById(id) {
  const { data } = await api.get(`/farms/${id}`);
  return data;
}

export async function createFarm(farmData) {
  const { data } = await api.post("/farms", farmData);
  return data;
}

export async function updateFarm(id, updates) {
  const { data } = await api.put(`/farms/${id}`, updates);
  return data;
}

export async function deleteFarm(id) {
  const { data } = await api.delete(`/farms/${id}`);
  return data;
}

export async function getWaterUsage(farmId) {
  const { data } = await api.get(`/farms/${farmId}/water-usage`);
  return data;
}

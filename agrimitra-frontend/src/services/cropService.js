import api from "./api";

export async function getCropHealthOverview(farmId, range = "year") {
  const { data } = await api.get(`/farms/${farmId}/crop-health`, { params: { range } });
  return data;
}

export async function analyzeCropImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/crop-monitoring/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getRecommendations(farmId) {
  const { data } = await api.get(`/farms/${farmId}/recommendations`);
  return data;
}

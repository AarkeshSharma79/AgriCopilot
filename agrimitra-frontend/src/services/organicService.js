import api from "./api";

export async function getOrganicAdvisory(farmSize = 2.5) {
  const { data } = await api.get("/organic", { params: { farmSize } });
  return data;
}

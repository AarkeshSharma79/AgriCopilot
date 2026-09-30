import api from "./api";

// Fetch full weather for a registered farm
export const getFarmWeather = async (farmId) => {
  const { data } = await api.get(`/weather/dashboard/${farmId}`);
  return data; // Returns the unified weather schema
};

// Fetch full weather for an arbitrary coordinate (manual location / GPS)
export const getLocationWeather = async (lat, lon) => {
  const { data } = await api.get("/weather/location", { params: { lat, lon } });
  return data;
};

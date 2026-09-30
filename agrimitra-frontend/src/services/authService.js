import api from "./api";

export async function login(credentials) {
  const { data } = await api.post("/auth/login", credentials);
  if (data?.data?.token) {
    localStorage.setItem("agrimitra_token", data.data.token);
  }
  return data;
}

export async function register(userData) {
  const { data } = await api.post("/auth/register", userData);
  if (data?.data?.token) {
    localStorage.setItem("agrimitra_token", data.data.token);
  }
  return data;
}

export async function getProfile() {
  const { data } = await api.get("/auth/profile");
  return data;
}

export async function updateProfile(updates) {
  const { data } = await api.put("/auth/profile", updates);
  return data;
}

export function logout() {
  localStorage.removeItem("agrimitra_token");
}

import api from "./api";

export async function askAssistant(message, context = {}) {
  const { data } = await api.post("/ai/ask", { message, context });
  return data;
}

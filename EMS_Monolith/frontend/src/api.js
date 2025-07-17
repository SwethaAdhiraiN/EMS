import axios from "axios";

const baseURL = "http://localhost:8000/api/";

export function getApiClient(token) {
  const instance = axios.create({
    baseURL,
  });

  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return instance;
}

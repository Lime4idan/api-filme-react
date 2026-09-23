import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  withCredentials: true,
  timeout: 12000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.error?.code;
    if (status === 401 && ["TOKEN_EXPIRED", "INVALID_TOKEN", "AUTH_REQUIRED"].includes(code)) {
      window.dispatchEvent(new CustomEvent("moviehub:unauthorized", { detail: { code } }));
    }
    const normalized = new Error(error.response?.data?.error?.message || (error.code === "ECONNABORTED" ? "The connection timed out" : "Could not complete the request"));
    normalized.code = code || "NETWORK_ERROR";
    normalized.status = status;
    normalized.details = error.response?.data?.error?.details || [];
    return Promise.reject(normalized);
  },
);

export default api;

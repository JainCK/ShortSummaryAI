import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API endpoints
export const authApi = {
  register: (data: { email: string; username: string; password: string }) =>
    apiClient.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    apiClient.post("/auth/login", data),
};

export const textApi = {
  generateSummary: (text: string) =>
    apiClient.post("/text/generate_summary", { text }),
  generateBulletPoints: (text: string) =>
    apiClient.post("/text/generate_bullet_points", { text }),
  getHistory: (params?: {
    skip?: number;
    limit?: number;
    process_type?: string;
  }) => apiClient.get("/text/history", { params }),
};

export default apiClient;

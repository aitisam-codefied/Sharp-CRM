import axios from "axios";

const BASE_URL = "http://localhost:5001/api/v1";

const api = axios.create({
  baseURL: "http://localhost:5001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor – attach access token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("sms_access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle expired token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("sms_refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          res.data.tokens || {};

        if (accessToken && newRefreshToken) {
          localStorage.setItem("sms_access_token", accessToken);
          localStorage.setItem("sms_refresh_token", newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }

        throw new Error("Missing tokens in refresh response");
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

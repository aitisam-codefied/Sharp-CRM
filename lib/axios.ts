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

        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = res.data.tokens?.accessToken;
        const newRefreshToken = res.data.tokens?.refreshToken;

        if (newAccessToken && newRefreshToken) {
          localStorage.setItem("sms_access_token", newAccessToken);
          localStorage.setItem("sms_refresh_token", newRefreshToken);

          // Update token in header and retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.clear(); // log user out on refresh fail
        window.location.href = "/login"; // redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

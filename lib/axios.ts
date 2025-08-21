import axios from "axios";

// const BASE_URL = "http://localhost:5001/api/v1";
const BASE_URL = "https://beta.api.supasystem.co.uk/api/v1";
const api = axios.create({
  baseURL: BASE_URL,
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
  async (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("sms_refresh_token");
        const oldaccessToken = localStorage.getItem("sms_access_token");
        console.log("old access token", oldaccessToken); // <--debug
        console.log("Refresh token:", refreshToken); // <--debug
        if (!refreshToken) throw new Error("No refresh token found");

        const res = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: {
              "x-refresh-token": refreshToken,
            },
          }
        );
        console.log("res", res); //<--debug

        const { accessToken, refreshToken: newRefreshToken } =
          res.data.tokens || {};

        if (accessToken && newRefreshToken) {
          localStorage.setItem("sms_access_token", accessToken);
          localStorage.setItem("sms_refresh_token", newRefreshToken);

          console.log("newwww access token", accessToken); //<--debug

          // ✅ Correct way to retry original request
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

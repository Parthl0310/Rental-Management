import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Handle network/server errors where config may not exist
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest =
      originalRequest.url?.includes("/auth/refresh-token");

    if (
      isUnauthorized &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      // If refresh token request is already in progress,
      // queue all failed requests
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh access token
        await api.post("/auth/refresh-token");

        // Retry all queued requests
        processQueue();

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Reject all queued requests
        processQueue(refreshError);

        // Optional cleanup
        localStorage.clear();
        sessionStorage.clear();

        // Redirect to login only if not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "../services/storage";

const BASE_URL = "http://127.0.0.1:8000";

interface RefreshResponse {
  access: string;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

let refreshPromise: Promise<string> | null = null;

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    const refresh = await getRefreshToken();

    if (!refresh) {
      await clearAuthStorage();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = axios
        .post<RefreshResponse>(`${BASE_URL}/api/auth/refresh/`, { refresh })
        .then(async (res) => {
          await setTokens({
            access: res.data.access,
            refresh,
          });
          return res.data.access;
        })
        .catch(async (err) => {
          await clearAuthStorage();
          throw err;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const newAccessToken = await refreshPromise;

    if (originalRequest.headers) {
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    }

    return api(originalRequest);
  }
);

export default api;
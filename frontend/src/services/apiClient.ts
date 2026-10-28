import axios from 'axios';

let accessToken: string | null = null;
let refreshToken: string | null = null;

const ACCESS_TOKEN_KEY = 'hms.accessToken';
const REFRESH_TOKEN_KEY = 'hms.refreshToken';

const readStoredValue = (key: string) => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(key);
};

accessToken = readStoredValue(ACCESS_TOKEN_KEY);
refreshToken = readStoredValue(REFRESH_TOKEN_KEY);

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (typeof window !== 'undefined') {
    if (token) window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    else window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const getAccessToken = () => accessToken;

export const setRefreshToken = (token: string | null) => {
  refreshToken = token;
  if (typeof window !== 'undefined') {
    if (token) window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
    else window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const getRefreshToken = () => refreshToken;

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';
    const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh');
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest && refreshToken) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, { refreshToken }, { withCredentials: true });
        const newToken = refreshResponse.data.accessToken;
        setAccessToken(newToken);
        setRefreshToken(refreshResponse.data.refreshToken || refreshToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        setAccessToken(null);
        setRefreshToken(null);
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

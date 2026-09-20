import axios from 'axios';
import { useAuthStore, useCustomerStore } from '../store/auth.js';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({ baseURL, withCredentials: true });

// Attach whichever token is active (staff takes precedence over customer).
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken || useCustomerStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise = null;

// On a 401, try the httpOnly refresh cookie once, then retry the request.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    if (!response || !config) return Promise.reject(error);

    const hadStaffToken = Boolean(useAuthStore.getState().accessToken);
    if (response.status === 401 && !config._retry && hadStaffToken) {
      config._retry = true;
      try {
        refreshPromise =
          refreshPromise || axios.post(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true });
        const { data } = await refreshPromise;
        refreshPromise = null;

        const newToken = data?.data?.accessToken;
        useAuthStore.getState().setToken(newToken);
        config.headers.Authorization = `Bearer ${newToken}`;
        return api(config);
      } catch (refreshError) {
        refreshPromise = null;
        useAuthStore.getState().clearAuth();
      }
    }

    return Promise.reject(error);
  },
);

/** Pulls a readable message out of an axios error. */
export const apiErrorMessage = (error) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0]?.message || error?.message || 'Something went wrong';

/** Field-level validation errors keyed by field name. */
export const apiFieldErrors = (error) => {
  const errors = error?.response?.data?.errors;
  if (!Array.isArray(errors)) return {};
  return errors.reduce((acc, item) => {
    if (item?.field) acc[item.field] = item.message;
    return acc;
  }, {});
};

export { baseURL };
export default api;

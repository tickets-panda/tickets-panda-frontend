import { create } from 'zustand';

/**
 * Staff auth (platform + tenant users).
 * The access token lives in memory only — never localStorage.
 */
export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  bootstrapped: false,
  setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true, bootstrapped: true }),
  setToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  finishBootstrap: () => set({ bootstrapped: true }),
  clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false, bootstrapped: true }),
}));

/** Customer auth (OTP-based, 30-minute token). */
export const useCustomerStore = create((set) => ({
  customer: null,
  accessToken: null,
  setAuth: (customer, accessToken) => set({ customer, accessToken }),
  clearAuth: () => set({ customer: null, accessToken: null }),
}));

export const isPlatformUser = (user) => ['PLATFORM_OWNER', 'PLATFORM_ADMIN'].includes(user?.role);
export const isTenantUser = (user) =>
  ['TENANT_OWNER', 'TENANT_ADMIN', 'EVENT_MANAGER', 'FINANCE_VIEWER', 'CHECKIN_STAFF'].includes(user?.role);

export default { useAuthStore, useCustomerStore, isPlatformUser, isTenantUser };

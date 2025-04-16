import { AuthToken } from "../types";

export const setAuthToken = (token: AuthToken) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token.access_token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

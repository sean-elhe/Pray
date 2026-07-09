import { api } from "./client";

export const login = (name: string, pin: string) =>
  api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ name, pin }),
  });

export const register = (name: string, pin: string) =>
  api("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, pin }),
  });

export const me = () => api("/api/auth/me");

export const logout = () =>
  api("/api/auth/logout", {
    method: "POST",
  });

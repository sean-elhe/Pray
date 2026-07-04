import { api } from "./client";

export const login = (name: string, pin: string) =>
  api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ name, pin }),
  });

export const register = (name: string, pin: string) =>
  api("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, pin }),
  });

export const me = () => api("/auth/me");

export const logout = () =>
  api("/auth/logout", {
    method: "POST",
  });

import Cookies from "js-cookie";
import { useEffect, useState } from "react";

// ── Constants ────────────────────────────────────────────
const TOKEN_KEY = "cuidaapr-token";
const USER_KEY = "cuidaapr-user";
const IS_PROD = import.meta.env.MODE === "production"; // Vite

// ── Token ────────────────────────────────────────────────
export const setToken = (token, expiresDays = 1) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: expiresDays,
    secure: IS_PROD,
    sameSite: "strict",
  });
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY) || undefined;
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};

// ── User ─────────────────────────────────────────────────
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

// ── Auth helpers ─────────────────────────────────────────
export const isAuthenticated = () => !!getToken();
export const getUserRole = () => getUser()?.role || null;

export const logout = () => {
  removeToken();
  removeUser();
};

// ── User field shortcuts ─────────────────────────────────
export const getUserEmail = () => getUser()?.email || null;
export const getUserName = () => getUser()?.name || null;

// ── Generic localStorage ─────────────────────────────────
export const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = (key) => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};

export const removeItem = (key) => {
  localStorage.removeItem(key);
};

// ── Hooks ────────────────────────────────────────────────
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Email/Password Authentication utilities with JWT.
 */

import { apiUrl } from "./api";

const AUTH_KEY = "medai_user";
const TOKEN_KEY = "medai_token";

export interface User {
  id: string;
  username: string;
  email: string;
}

// ─── Local storage helpers ───────────────────────────────────

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null && getAuthToken() !== null;
}

// ─── Token helpers ───────────────────────────────────────────

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

// ─── Signup ──────────────────────────────────────────────────

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export async function signup(data: SignupData): Promise<User> {
  const res = await fetch(apiUrl("/api/auth/signup"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Signup failed");
  }

  setToken(json.token);
  setUser(json.user);
  return json.user;
}

// ─── Login ───────────────────────────────────────────────────

export interface LoginData {
  email: string;
  password: string;
}

export async function login(data: LoginData): Promise<User> {
  const res = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Login failed");
  }

  setToken(json.token);
  setUser(json.user);
  return json.user;
}

// ─── Fetch current user ─────────────────────────────────────

export async function fetchCurrentUser(): Promise<User> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(apiUrl("/api/auth/me"), {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch user");
  }

  setUser(json.user);
  return json.user;
}

// ─── Logout ──────────────────────────────────────────────────

export async function logout(): Promise<void> {
  clearUser();
}

/**
 * Real authentication utilities using Backend API.
 */

const AUTH_KEY = "medai_user";
const TOKEN_KEY = "medai_token";
const API_URL = "http://localhost:3000/api";

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setUser(user: User, token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null && getToken() !== null;
}

export async function login(email: string, password: string): Promise<User> {
  console.log("Attempting login to:", `${API_URL}/auth/login`);
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  // Decode token or use returned user data?
  // Our backend signup returns { user: ... }, but login returns just token?
  // Wait, let's check server.js login response. 
  // Login returns { message, token }. It does NOT return user object.
  // We need to decode the token to get user info or fetch /me.
  // For now, let's construct a basic user object from email or decode if possible.
  // Or better, update backend login to return user info too.

  // Assuming backend update (I will add this to the plan)
  const user = data.user || { id: "unknown", username: email.split("@")[0], email };

  setUser(user, data.token);
  return user;
}

export async function signup(data: {
  username: string;
  email: string;
  phone?: string;
  password?: string; // Add password to type
}): Promise<User> {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.username,
      email: data.email,
      password: data.password // passed from form
    }),
  });

  const resData = await res.json();

  if (!res.ok) {
    throw new Error(resData.message || "Signup failed");
  }

  const user = resData.user;
  setUser(user, resData.token);
  return user;
}

// Keeping mock functions for compatibility if needed, but they should be removed.
export const mockLogin = login;
export const mockSignup = signup;

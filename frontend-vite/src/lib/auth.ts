/**
 * Real authentication utilities using Backend API.
 */

import { apiUrl } from "./api";

const AUTH_KEY = "medai_user";
const TOKEN_KEY = "medai_token";

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
}

export interface SignupResult {
  verificationRequired: boolean;
  email: string;
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
  const res = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    const error: any = new Error(data.message || "Login failed");
    error.code = data.code;
    error.email = data.email;
    throw error;
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
}): Promise<SignupResult> {
  const res = await fetch(apiUrl("/api/auth/signup"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: data.username,
      email: data.email,
      phone: data.phone,
      password: data.password // passed from form
    }),
  });

  const resData = await res.json();

  if (!res.ok) {
    throw new Error(resData.message || "Signup failed");
  }

  if (resData.token && resData.user) {
    setUser(resData.user, resData.token);
  }

  return {
    verificationRequired: Boolean(resData.verificationRequired),
    email: resData.email || data.email,
  };
}

export async function verifyEmailOtp(email: string, otp: string): Promise<User> {
  const res = await fetch(apiUrl("/api/auth/verify-email"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Verification failed");
  }

  const user = data.user;
  setUser(user, data.token);
  return user;
}

export async function resendEmailOtp(email: string): Promise<void> {
  const res = await fetch(apiUrl("/api/auth/resend-otp"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to resend code");
  }
}

// Keeping mock functions for compatibility if needed, but they should be removed.
export const mockLogin = login;
export const mockSignup = signup;

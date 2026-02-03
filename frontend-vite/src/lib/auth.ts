/**
 * Mock authentication utilities.
 * In production, replace with real auth.
 */

const AUTH_KEY = "medai_user";

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

export function setUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function mockLogin(email: string, _password: string): User {
  const user: User = {
    id: "user-1",
    username: email.split("@")[0],
    email,
  };
  setUser(user);
  return user;
}

export function mockSignup(data: {
  username: string;
  email: string;
  phone?: string;
}): User {
  const user: User = {
    id: `user-${Date.now()}`,
    username: data.username,
    email: data.email,
    phone: data.phone,
  };
  setUser(user);
  return user;
}

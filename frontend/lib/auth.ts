/**
 * Mock authentication utilities.
 * In production, replace with real auth (e.g. NextAuth, Supabase Auth).
 */

const AUTH_KEY = "medai_user";

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
}

/** Get current user from localStorage (client-only) */
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
}

/** Set user in localStorage after login/signup (mock) */
export function setUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

/** Clear user (logout) */
export function clearUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}

/** Check if user is authenticated */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

/** Mock login – accepts any email/password and returns a user */
export function mockLogin(email: string, _password: string): User {
  const user: User = {
    id: "user-1",
    username: email.split("@")[0],
    email,
  };
  setUser(user);
  return user;
}

/** Mock signup – creates user and stores */
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

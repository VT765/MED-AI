/**
 * Firebase Phone Authentication utilities.
 */

import { auth, signInWithPhoneNumber, RecaptchaVerifier } from "./firebase";
import type { ConfirmationResult } from "./firebase";
import { apiUrl } from "./api";

const AUTH_KEY = "medai_user";

export interface User {
  id: string;
  username: string | null;
  phone: string;
  email?: string;
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
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null && auth.currentUser !== null;
}

// ─── Firebase token helper ───────────────────────────────────

export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

// ─── Phone OTP flow ──────────────────────────────────────────

let confirmationResult: ConfirmationResult | null = null;

export function setupRecaptcha(elementId: string): RecaptchaVerifier {
  const verifier = new RecaptchaVerifier(auth, elementId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved — will proceed with signInWithPhoneNumber
    },
  });
  return verifier;
}

export async function sendPhoneOtp(
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<void> {
  confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}

export interface VerifyResult {
  user: User;
  profileComplete: boolean;
  isNewUser: boolean;
}

export async function verifyPhoneOtp(code: string): Promise<VerifyResult> {
  if (!confirmationResult) {
    throw new Error("No OTP request in progress. Please request a new code.");
  }

  // Confirm the OTP with Firebase
  const userCredential = await confirmationResult.confirm(code);
  const idToken = await userCredential.user.getIdToken();

  // Send token to backend to create/login user
  const res = await fetch(apiUrl("/api/auth/verify-phone"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok || !data.authenticated) {
    throw new Error(data.message || "Authentication failed");
  }

  const user: User = data.user;
  setUser(user);
  confirmationResult = null;
  return {
    user,
    profileComplete: data.profileComplete,
    isNewUser: data.isNewUser,
  };
}

// ─── Complete Profile ────────────────────────────────────────

export interface CompleteProfileData {
  username: string;
  email: string;
  password?: string;
}

export async function completeProfile(profileData: CompleteProfileData): Promise<User> {
  const token = await getIdToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(apiUrl("/api/auth/complete-profile"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to complete profile");
  }

  const user: User = data.user;
  setUser(user);
  return user;
}

// ─── Logout ──────────────────────────────────────────────────

export async function logout(): Promise<void> {
  await auth.signOut();
  clearUser();
}

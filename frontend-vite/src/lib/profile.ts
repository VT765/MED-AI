/**
 * Profile API helpers — save & retrieve onboarding/profile data.
 */

import { apiUrl } from "./api";
import { getAuthToken } from "./auth";

// ── Types ───────────────────────────────────────────────────

export interface HealthCondition {
  yes: boolean;
  details: string;
}

export interface ProfileData {
  fullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  height: string;
  weight: string;
  activityLevel: string;
  conditions: Record<string, HealthCondition>;
}

export interface ProfileResponse extends ProfileData {
  bmi: string | null;
  onboardingDone: boolean;
  profileComplete: number;
}

// ── API calls ───────────────────────────────────────────────

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function saveProfile(data: ProfileData): Promise<{ message: string; profile: ProfileResponse }> {
  const res = await fetch(apiUrl("/api/profile"), {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || json.detail || "Failed to save profile");
  }

  return json;
}

export async function getProfile(): Promise<ProfileResponse> {
  const res = await fetch(apiUrl("/api/profile"), {
    headers: authHeaders(),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || json.detail || "Failed to fetch profile");
  }

  return json;
}

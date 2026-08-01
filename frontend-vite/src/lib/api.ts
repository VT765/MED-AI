/**
 * Single source for API base URL and typed API helpers.
 * Uses relative path so Vite proxy works in dev.
 */

import { getAuthToken } from "./auth";

export const API_BASE =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE) || "";

export function apiUrl(path: string): string {
  const base = API_BASE.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

// ── Auth header helper ──────────────────────────────────────

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extra,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// ── Chat API ────────────────────────────────────────────────

export interface ChatMessageOut {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface SendChatResponse {
  session_id: string;
  reply: string;
  timestamp: string;
}

export interface ChatHistoryResponse {
  session_id: string;
  messages: ChatMessageOut[];
}

export async function sendChatMessage(
  message: string,
  sessionId?: string | null
): Promise<SendChatResponse> {
  const res = await fetch(apiUrl("/api/chat"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      message,
      session_id: sessionId || null,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || data.message || "Failed to send message");
  }

  return data as SendChatResponse;
}

export async function getChatHistory(): Promise<ChatHistoryResponse> {
  const res = await fetch(apiUrl("/api/chat/history"), {
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || data.message || "Failed to load chat history");
  }

  return data as ChatHistoryResponse;
}

export async function startNewChat(): Promise<{ session_id: string }> {
  const res = await fetch(apiUrl("/api/chat/new"), {
    method: "POST",
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || data.message || "Failed to start new chat");
  }

  return data;
}

// ── Guest Chat API (no auth required) ───────────────────────

export async function sendGuestChatMessage(
  message: string,
  sessionId?: string | null
): Promise<SendChatResponse> {
  const res = await fetch(apiUrl("/api/chat/guest"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      session_id: sessionId || null,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || data.message || "Failed to send message");
  }

  return data as SendChatResponse;
}

export async function getGuestChatHistory(
  sessionId: string
): Promise<ChatHistoryResponse> {
  const res = await fetch(
    apiUrl(`/api/chat/guest/history?session_id=${encodeURIComponent(sessionId)}`),
    { headers: { "Content-Type": "application/json" } }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || data.message || "Failed to load chat history");
  }

  return data as ChatHistoryResponse;
}

export async function startNewGuestChat(): Promise<{ session_id: string }> {
  const res = await fetch(apiUrl("/api/chat/guest/new"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || data.message || "Failed to start new guest chat");
  }

  return data;
}

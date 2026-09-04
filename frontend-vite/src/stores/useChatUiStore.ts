// ─────────────────────────────────────────────────────────────────────────────
// useChatUiStore.ts — Bridges chat actions (history / new chat) to the
// dashboard header, which renders those CTAs next to the profile button.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";

interface ChatUiState {
  historyOpen: boolean;
  /** Incremented each time the header's "New Chat" CTA is pressed. */
  newChatCounter: number;
  setHistoryOpen: (open: boolean) => void;
  requestNewChat: () => void;

  // ── Medical Reports page ────────────────────────────────────────────────
  reportsHistoryOpen: boolean;
  /** Incremented each time the header's "Upload Report" CTA is pressed. */
  uploadReportCounter: number;
  setReportsHistoryOpen: (open: boolean) => void;
  requestUploadReport: () => void;
}

export const useChatUiStore = create<ChatUiState>((set) => ({
  historyOpen: false,
  newChatCounter: 0,
  setHistoryOpen: (open) => set({ historyOpen: open }),
  requestNewChat: () => set((s) => ({ newChatCounter: s.newChatCounter + 1 })),

  reportsHistoryOpen: false,
  uploadReportCounter: 0,
  setReportsHistoryOpen: (open) => set({ reportsHistoryOpen: open }),
  requestUploadReport: () => set((s) => ({ uploadReportCounter: s.uploadReportCounter + 1 })),
}));

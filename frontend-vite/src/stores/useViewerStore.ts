// ─────────────────────────────────────────────────────────────────────────────
// useViewerStore.ts — Zustand global state matching the Body Atlas+ UI
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type { Hotspot } from "@/data/anatomyData";

export type NavTab = "explore" | "circulation" | "microscopic" | "comparison" | "clinical" | "ai";
export type DetailsSubTab = "overview" | "quiz" | "microscopic" | "clinical";

export interface LayerVisibility {
  myocardium: boolean;
  vessels: boolean;
  conduction: boolean;
  pericardium: boolean;
}

interface ViewerState {
  // ── Navigation & Selection ──────────────────────────────────────────────
  activeNavTab: NavTab;
  activeOrganId: string;
  activeSystemId: string;
  activeHotspot: Hotspot | null;
  bookmarkedOrgans: string[];

  // ── 3D Viewport Controls ────────────────────────────────────────────────
  autoRotate: boolean;
  isRotating: boolean;
  clippingEnabled: boolean;
  clippingPosition: number;
  isolateMode: boolean;
  showLayers: boolean;
  isLayersMenuOpen: boolean;
  layerVisibility: LayerVisibility;
  compareMode: boolean;
  heartbeatAnimation: boolean;
  resetTrigger: number;
  zoomTrigger: number; // positive = zoom in, negative = zoom out
  
  // ── UI Modals & Drawers ─────────────────────────────────────────────────
  isLoading: boolean;
  activeDetailsTab: DetailsSubTab;
  isQuizOpen: boolean;
  isLessonOpen: boolean;
  isMicroscopicOpen: boolean;
  isComparisonOpen: boolean;
  isCirculationOpen: boolean;
  isClinicalNotesOpen: boolean;
  isAiAssistantOpen: boolean;
  searchQuery: string;

  // ── Actions ─────────────────────────────────────────────────────────────
  setActiveNavTab: (tab: NavTab) => void;
  setActiveOrgan: (organId: string) => void;
  setActiveSystemId: (systemId: string) => void;
  setActiveHotspot: (hotspot: Hotspot | null) => void;
  toggleBookmark: (organId: string) => void;
  toggleAutoRotate: () => void;
  toggleClipping: () => void;
  setClippingPosition: (pos: number) => void;
  toggleIsolateMode: () => void;
  toggleLayers: () => void;
  setIsLayersMenuOpen: (open: boolean) => void;
  toggleLayerVisibility: (layer: keyof LayerVisibility) => void;
  toggleCompareMode: () => void;
  toggleHeartbeat: () => void;
  triggerZoomIn: () => void;
  triggerZoomOut: () => void;
  resetCamera: () => void;
  setIsLoading: (loading: boolean) => void;
  setActiveDetailsTab: (tab: DetailsSubTab) => void;
  setIsQuizOpen: (open: boolean) => void;
  setIsLessonOpen: (open: boolean) => void;
  setIsMicroscopicOpen: (open: boolean) => void;
  setIsComparisonOpen: (open: boolean) => void;
  setIsCirculationOpen: (open: boolean) => void;
  setIsClinicalNotesOpen: (open: boolean) => void;
  setIsAiAssistantOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useViewerStore = create<ViewerState>((set) => ({
  activeNavTab: "explore",
  activeOrganId: "heart",
  activeSystemId: "all",
  activeHotspot: null,
  bookmarkedOrgans: ["heart"],

  autoRotate: false,
  isRotating: false,
  clippingEnabled: false,
  clippingPosition: 0.5,
  isolateMode: false,
  showLayers: true,
  isLayersMenuOpen: false,
  layerVisibility: {
    myocardium: true,
    vessels: true,
    conduction: true,
    pericardium: false,
  },
  compareMode: false,
  heartbeatAnimation: false,
  resetTrigger: 0,
  zoomTrigger: 0,

  isLoading: true,
  activeDetailsTab: "overview",
  isQuizOpen: false,
  isLessonOpen: false,
  isMicroscopicOpen: false,
  isComparisonOpen: false,
  isCirculationOpen: false,
  isClinicalNotesOpen: false,
  isAiAssistantOpen: false,
  searchQuery: "",

  setActiveNavTab: (tab) => {
    set({ activeNavTab: tab });
    if (tab === "microscopic") set({ isMicroscopicOpen: true });
    if (tab === "comparison") set({ isComparisonOpen: true });
    if (tab === "circulation") set({ isCirculationOpen: true });
    if (tab === "clinical") set({ isClinicalNotesOpen: true });
    if (tab === "ai") set({ isAiAssistantOpen: true });
  },

  setActiveOrgan: (organId) =>
    set({
      activeOrganId: organId,
      activeHotspot: null,
      isLoading: true,
      clippingEnabled: false,
      clippingPosition: 0.5,
      isolateMode: false,
      activeDetailsTab: "overview",
    }),

  setActiveSystemId: (systemId) =>
    set({
      activeSystemId: systemId,
      activeHotspot: null,
    }),

  setActiveHotspot: (hotspot) => set({ activeHotspot: hotspot }),

  toggleBookmark: (organId) =>
    set((state) => ({
      bookmarkedOrgans: state.bookmarkedOrgans.includes(organId)
        ? state.bookmarkedOrgans.filter((id) => id !== organId)
        : [...state.bookmarkedOrgans, organId],
    })),

  toggleAutoRotate: () =>
    set((state) => ({ autoRotate: !state.autoRotate })),

  toggleClipping: () =>
    set((state) => ({ clippingEnabled: !state.clippingEnabled })),

  setClippingPosition: (pos) =>
    set({ clippingPosition: Math.max(0, Math.min(1, pos)) }),

  toggleIsolateMode: () =>
    set((state) => ({ isolateMode: !state.isolateMode })),

  toggleLayers: () =>
    set((state) => ({ isLayersMenuOpen: !state.isLayersMenuOpen })),

  setIsLayersMenuOpen: (open) => set({ isLayersMenuOpen: open }),

  toggleLayerVisibility: (layer) =>
    set((state) => ({
      layerVisibility: {
        ...state.layerVisibility,
        [layer]: !state.layerVisibility[layer],
      },
    })),

  toggleCompareMode: () =>
    set((state) => {
      const next = !state.compareMode;
      return {
        compareMode: next,
        isComparisonOpen: next,
      };
    }),

  toggleHeartbeat: () =>
    set((state) => ({ heartbeatAnimation: !state.heartbeatAnimation })),

  triggerZoomIn: () =>
    set((state) => ({ zoomTrigger: state.zoomTrigger + 1 })),

  triggerZoomOut: () =>
    set((state) => ({ zoomTrigger: state.zoomTrigger - 1 })),

  resetCamera: () =>
    set((state) => ({
      resetTrigger: state.resetTrigger + 1,
      activeHotspot: null,
      isolateMode: false,
      clippingEnabled: false,
      clippingPosition: 0.5,
      isLayersMenuOpen: false,
      layerVisibility: {
        myocardium: true,
        vessels: true,
        conduction: true,
        pericardium: false,
      },
    })),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setActiveDetailsTab: (tab) => set({ activeDetailsTab: tab }),

  setIsQuizOpen: (open) => set({ isQuizOpen: open }),

  setIsLessonOpen: (open) => set({ isLessonOpen: open }),

  setIsMicroscopicOpen: (open) => set({ isMicroscopicOpen: open }),

  setIsComparisonOpen: (open) => set({ isComparisonOpen: open, compareMode: open }),

  setIsCirculationOpen: (open) => set({ isCirculationOpen: open }),

  setIsClinicalNotesOpen: (open) => set({ isClinicalNotesOpen: open }),

  setIsAiAssistantOpen: (open) => set({ isAiAssistantOpen: open }),

  setSearchQuery: (query) => set({ searchQuery: query }),
}));

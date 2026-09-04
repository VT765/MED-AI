// ─────────────────────────────────────────────────────────────────────────────
// AnatomyPage.tsx — Full Responsive AI-Powered Anatomy Interface
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Compass,
  Activity,
  ZoomIn,
  ArrowRightLeft,
  Stethoscope,
  Sparkles,
  Search,
  PanelRightOpen,
  PanelLeftOpen,
} from "lucide-react";
import { OrganSidebar } from "@/components/anatomy/OrganSidebar";
import { CanvasContainer } from "@/components/anatomy/CanvasContainer";
import { DetailsPanel } from "@/components/anatomy/DetailsPanel";
import { OrganMiniCard } from "@/components/anatomy/OrganMiniCard";
import { MicroscopicViewModal } from "@/components/anatomy/MicroscopicViewModal";
import { HeartBrainComparisonModal } from "@/components/anatomy/HeartBrainComparisonModal";
import { CirculationAnimationModal } from "@/components/anatomy/CirculationAnimationModal";
import { ClinicalNotesModal } from "@/components/anatomy/ClinicalNotesModal";
import { AiAnatomyAssistant } from "@/components/anatomy/AiAnatomyAssistant";
import { useViewerStore, type NavTab } from "@/stores/useViewerStore";

export function AnatomyPage() {
  const navigate = useNavigate();
  const activeNavTab = useViewerStore((s) => s.activeNavTab);
  const setActiveNavTab = useViewerStore((s) => s.setActiveNavTab);
  const searchQuery = useViewerStore((s) => s.searchQuery);
  const setSearchQuery = useViewerStore((s) => s.setSearchQuery);
  const isDetailsExpanded = useViewerStore((s) => s.isDetailsExpanded);

  const [isMobileLeftOpen, setIsMobileLeftOpen] = useState(false);
  const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);

  const navTabs: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: "explore", label: "3D Explore", icon: Compass },
    { id: "circulation", label: "Circulation Flow", icon: Activity },
    { id: "microscopic", label: "Microscopic View", icon: ZoomIn },
    { id: "comparison", label: "Heart vs Brain", icon: ArrowRightLeft },
    { id: "clinical", label: "Clinical Notes", icon: Stethoscope },
    { id: "ai", label: "AI Copilot", icon: Sparkles },
  ];

  return (
    <div className="h-full w-full flex flex-col overflow-hidden select-none font-sans bg-surface text-content-primary">
      {/* ── Top Sub-Navigation Bar ──────────────────────────────────── */}
      <header className="h-14 px-4 md:px-6 flex items-center justify-between flex-shrink-0 z-30 border-b border-stone-200 bg-surface-elevated shadow-xs">
        {/* Left: Section Badge + Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-700 shadow-xs">
            <Compass className="w-4 h-4 text-primary-600" />
          </div>

          <div className="flex items-baseline gap-2">
            <h2 className="text-sm font-bold tracking-tight text-content-primary">
              3D Specimen Lab
            </h2>
            <span className="text-xs text-content-tertiary hidden xl:inline">
              Interactive Clinical Dissection
            </span>
          </div>
        </div>

        {/* Center: Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-stone-100/90 border border-stone-200/80 overflow-x-auto max-w-[660px] scrollbar-none">
          {navTabs.map((tab) => {
            const isActive = tab.id === activeNavTab;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveNavTab(tab.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150
                  ${isActive
                    ? "bg-primary-600 text-white font-bold shadow-soft"
                    : "text-content-secondary hover:text-content-primary hover:bg-white/80"
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Search Input & Mobile Toggles */}
        <div className="flex items-center gap-2">
          <div className="relative w-40 sm:w-56">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search organs..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl placeholder:text-stone-400 text-content-primary bg-stone-50 border border-stone-200 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>

          <button
            onClick={() => setIsMobileLeftOpen(!isMobileLeftOpen)}
            className="md:hidden p-2 rounded-xl border border-stone-200 text-content-secondary hover:text-content-primary hover:bg-stone-100 transition-colors bg-white"
            title="Toggle organ library"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMobileRightOpen(!isMobileRightOpen)}
            className="lg:hidden p-2 rounded-xl border border-stone-200 text-content-secondary hover:text-content-primary hover:bg-stone-100 transition-colors bg-white"
            title="Toggle specimen info"
          >
            <PanelRightOpen className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Main 3-Column Layout ────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Column: Organ Library Sidebar */}
        <div
          className={`
            ${isMobileLeftOpen ? "absolute inset-y-0 left-0 z-40 flex shadow-2xl" : "hidden md:flex"}
            flex-shrink-0 h-full
          `}
        >
          <OrganSidebar />
        </div>

        {/* Middle Column: 3D Viewport */}
        <main className="flex-1 relative overflow-hidden">
          <CanvasContainer />
        </main>

        {/* Right Column: Specimen Details Panel */}
        <div
          className={`
            ${isMobileRightOpen ? "absolute inset-y-0 right-0 z-40 flex shadow-2xl" : "hidden lg:flex"}
            flex-shrink-0 h-full
          `}
        >
          {isDetailsExpanded ? <DetailsPanel /> : <OrganMiniCard />}
        </div>
      </div>

      {/* ── Enriched Specialty Modals ───────────────────────────────── */}
      <MicroscopicViewModal />
      <HeartBrainComparisonModal />
      <CirculationAnimationModal />
      <ClinicalNotesModal />
      <AiAnatomyAssistant />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OrganSidebar.tsx — Premium Organ Library Sidebar with photorealistic cards
// ─────────────────────────────────────────────────────────────────────────────

import { Bookmark, Heart as HeartIcon, Sparkles, Activity, Brain, Wind, Utensils, Droplets, Eye } from "lucide-react";
import { bodySystems, searchOrgans } from "@/data/anatomyData";
import { useViewerStore } from "@/stores/useViewerStore";

// System color accent map
const systemAccentMap: Record<string, string> = {
  cardiovascular: "#e11d48",
  nervous: "#8b5cf6",
  respiratory: "#06b6d4",
  digestive: "#f59e0b",
  urinary: "#3b82f6",
  "sensory-integumentary": "#10b981",
  all: "#e11d48",
};

export function OrganSidebar() {
  const activeOrganId = useViewerStore((s) => s.activeOrganId);
  const setActiveOrgan = useViewerStore((s) => s.setActiveOrgan);
  const activeSystemId = useViewerStore((s) => s.activeSystemId);
  const setActiveSystemId = useViewerStore((s) => s.setActiveSystemId);
  const bookmarkedOrgans = useViewerStore((s) => s.bookmarkedOrgans);
  const toggleBookmark = useViewerStore((s) => s.toggleBookmark);
  const searchQuery = useViewerStore((s) => s.searchQuery);

  const filteredOrgans = searchOrgans(searchQuery, activeSystemId);

  const getSystemIcon = (iconName: string) => {
    switch (iconName) {
      case "Heart":    return Activity;
      case "Brain":    return Brain;
      case "Wind":     return Wind;
      case "Utensils": return Utensils;
      case "Droplets": return Droplets;
      case "Eye":      return Eye;
      default:         return Sparkles;
    }
  };

  return (
    <aside className="w-[280px] h-full flex flex-col justify-between select-none overflow-hidden flex-shrink-0 z-20 border-r border-stone-200 bg-surface-elevated">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 py-3.5 flex items-center justify-between border-b border-stone-200 bg-surface-elevated">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold text-content-tertiary tracking-widest uppercase">
              ORGAN LIBRARY
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full text-primary-700 bg-primary-50 border border-primary-200">
              {filteredOrgans.length}
            </span>
          </div>
          <button
            onClick={() => toggleBookmark(activeOrganId)}
            className="text-content-tertiary hover:text-primary-600 transition-colors p-1.5 rounded-lg hover:bg-stone-50"
            title="Bookmark active organ"
          >
            <Bookmark
              className={`w-4 h-4 ${
                bookmarkedOrgans.includes(activeOrganId)
                  ? "fill-primary-600 text-primary-600"
                  : ""
              }`}
            />
          </button>
        </div>

        {/* ── Body System Switcher ──────────────────────────────────── */}
        <div className="px-3 py-2.5 border-b border-stone-200 bg-stone-50/60">
          <p className="text-[10px] font-bold uppercase tracking-wider text-content-tertiary mb-1.5 px-1">
            BODY SYSTEMS
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {bodySystems.map((sys) => {
              const isActive = sys.id === activeSystemId;
              const Icon = getSystemIcon(sys.iconName);

              return (
                <button
                  key={sys.id}
                  onClick={() => setActiveSystemId(sys.id)}
                  className={`
                    flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex-shrink-0
                    ${
                      isActive
                        ? "bg-primary-600 text-white shadow-soft font-bold"
                        : "text-content-secondary bg-white border border-stone-200 hover:text-content-primary hover:bg-stone-50"
                    }
                  `}
                  title={sys.description}
                >
                  <Icon className="w-3 h-3 flex-shrink-0" />
                  <span>{sys.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Organ Gallery Cards ──────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 scrollbar-thin">
          {filteredOrgans.length === 0 ? (
            <div className="text-center py-8 px-4 text-xs text-content-tertiary">
              <p className="font-semibold text-content-secondary">No organs found</p>
              <p className="mt-1 text-[11px]">Try switching body systems or clearing the search query.</p>
              <button
                onClick={() => setActiveSystemId("all")}
                className="mt-3 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 hover:bg-primary-100 transition-colors"
              >
                Reset to All Systems
              </button>
            </div>
          ) : (
            filteredOrgans.map((organ) => {
              const isActive = organ.id === activeOrganId;

              return (
                <button
                  key={organ.id}
                  onClick={() => setActiveOrgan(organ.id)}
                  className={`
                    w-full text-left flex items-center gap-3 px-2.5 py-2.5 rounded-2xl transition-all duration-150 group relative overflow-hidden
                    ${
                      isActive
                        ? "bg-primary-50/80 border border-primary-300 shadow-sm ring-1 ring-primary-300"
                        : "bg-white border border-stone-200/80 hover:border-primary-200 hover:bg-stone-50/70 hover:shadow-xs"
                    }
                  `}
                >
                  {/* Left accent bar */}
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary-600" />
                  )}

                  {/* Organ Thumbnail */}
                  <div className={`
                    w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200/80 shadow-xs
                    transition-all duration-200 group-hover:scale-[1.03]
                    ${isActive ? "ring-2 ring-primary-400" : ""}
                  `}>
                    <img
                      src={organ.thumbnail}
                      alt={organ.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/logo.png";
                      }}
                    />
                  </div>

                  {/* Organ Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className={`text-[12.5px] font-bold truncate leading-tight ${isActive ? "text-primary-950 font-extrabold" : "text-content-primary"}`}>
                        {organ.name}
                      </h3>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-primary-600" />
                      )}
                    </div>
                    <p className="text-[10px] italic text-content-tertiary font-serif mt-0.5 truncate">
                      {organ.latinName}
                    </p>
                    <p className="text-[10px] text-content-secondary truncate mt-0.5">
                      {organ.tagline}
                    </p>

                    {/* System badge */}
                    <span className={`inline-block mt-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide ${
                      isActive
                        ? "bg-primary-100 text-primary-800"
                        : "bg-stone-100 text-content-secondary"
                    }`}>
                      {organ.category}
                    </span>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="flex-shrink-0 mr-0.5">
                      <HeartIcon className="w-3.5 h-3.5 fill-primary-600 text-primary-600" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div className="p-3.5 border-t border-stone-200 bg-surface-elevated">
        <div className="p-3 rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-primary-100/40 text-primary-900 shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary-800">
            <Sparkles className="w-3.5 h-3.5 text-primary-600" />
            <span>Interactive 3D Atlas</span>
          </div>
          <p className="text-[10px] text-primary-800/80 mt-1 leading-snug">
            Select any organ to launch high-fidelity 3D exploration and clinical dissection.
          </p>
        </div>
      </div>
    </aside>
  );
}

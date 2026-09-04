// ─────────────────────────────────────────────────────────────────────────────
// OrganMiniCard.tsx — Compact right-side summary card (collapsed DetailsPanel)
// Shown by default; expands into the full DetailsPanel on hotspot click.
// ─────────────────────────────────────────────────────────────────────────────

import { Heart, ChevronsRight } from "lucide-react";
import { useViewerStore } from "@/stores/useViewerStore";
import { getOrganById } from "@/data/anatomyData";

export function OrganMiniCard() {
  const activeOrganId = useViewerStore((s) => s.activeOrganId);
  const setIsDetailsExpanded = useViewerStore((s) => s.setIsDetailsExpanded);
  const organ = getOrganById(activeOrganId);

  return (
    <aside className="w-64 h-full flex-shrink-0 border-l border-stone-200 bg-surface-elevated p-4">
      <div className="rounded-2xl border border-stone-200 bg-white shadow-xs p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-stone-50 border border-stone-200">
            <img
              src={organ.thumbnail}
              alt={organ.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-[10px] font-bold text-primary-600 uppercase tracking-wider">
              <Heart className="w-3 h-3 fill-primary-600 shrink-0" />
              <span className="truncate">THE {organ.name.toUpperCase()}</span>
            </div>
            <h3 className="text-sm font-black text-content-primary truncate">
              {organ.name}
            </h3>
          </div>
        </div>

        <p className="text-xs text-content-secondary leading-relaxed line-clamp-3">
          {organ.description}
        </p>

        <button
          onClick={() => setIsDetailsExpanded(true)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-[0.99] text-white text-xs font-semibold transition-all"
        >
          View Details
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="mt-3 text-[10px] text-content-tertiary text-center px-2 leading-relaxed">
        Click a hotspot on the model to open full specimen details.
      </p>
    </aside>
  );
}

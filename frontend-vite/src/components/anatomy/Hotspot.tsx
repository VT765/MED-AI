// ─────────────────────────────────────────────────────────────────────────────
// Hotspot.tsx — Premium Interactive 3D annotation pins matching reference images
// White-bordered colored dot with pulsing ring animation + rich tooltip card.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Html } from "@react-three/drei";
import { useViewerStore } from "@/stores/useViewerStore";
import type { Hotspot as HotspotType } from "@/data/anatomyData";

interface HotspotProps {
  hotspot: HotspotType;
}

export function Hotspot({ hotspot }: HotspotProps) {
  const activeHotspot = useViewerStore((s) => s.activeHotspot);
  const setActiveHotspot = useViewerStore((s) => s.setActiveHotspot);
  const [isHovered, setIsHovered] = useState(false);

  const isActive = activeHotspot?.id === hotspot.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveHotspot(isActive ? null : hotspot);
  };

  return (
    <group position={hotspot.position}>
      {/* Invisible click-target sphere at the 3D anchor position */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          setActiveHotspot(isActive ? null : hotspot);
        }}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* HTML overlay — rich pin + tooltip card */}
      <Html
        center
        distanceFactor={4.2}
        zIndexRange={[20, 0]}
        style={{ pointerEvents: "auto" }}
        occlude={false}
      >
        <div
          className="relative group cursor-pointer select-none"
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* ── Pin Container ── */}
          <div className="relative flex items-center justify-center">
            {/* Outer pulsing ring (always visible, pulses on active) */}
            <div
              className={`absolute rounded-full transition-all duration-300 ${
                isActive
                  ? "w-9 h-9 opacity-40 animate-ping"
                  : isHovered
                  ? "w-7 h-7 opacity-20"
                  : "w-6 h-6 opacity-0"
              }`}
              style={{ backgroundColor: hotspot.color }}
            />

            {/* Secondary pulse ring */}
            {isActive && (
              <div
                className="absolute w-7 h-7 rounded-full opacity-30 animate-ping"
                style={{
                  backgroundColor: hotspot.color,
                  animationDelay: "0.15s",
                  animationDuration: "1.2s",
                }}
              />
            )}

            {/* Main Pin Dot — white border, colored fill, inner white core */}
            <div
              className={`
                relative z-10 rounded-full border-[2.5px] border-white
                flex items-center justify-center shadow-lg
                transition-all duration-200
                ${isActive ? "w-7 h-7 scale-110" : isHovered ? "w-6 h-6 scale-105" : "w-5 h-5"}
              `}
              style={{
                backgroundColor: hotspot.color,
                boxShadow: isActive
                  ? `0 0 0 3px ${hotspot.color}40, 0 4px 12px rgba(0,0,0,0.3)`
                  : "0 2px 8px rgba(0,0,0,0.25)",
              }}
            >
              {/* Inner white core dot — hollow ring style when not active */}
              {!isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
              )}
            </div>
          </div>

          {/* ── Tooltip / Info Card ── */}
          {(isHovered || isActive) && (
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-50 pointer-events-auto"
              style={{ minWidth: "190px", maxWidth: "260px" }}
            >
              <div
                className="rounded-2xl overflow-hidden shadow-xl border border-stone-200 bg-white/95 backdrop-blur-md"
                style={{
                  boxShadow: `0 12px 32px -4px rgba(0,0,0,0.12), 0 3px 0 0 ${hotspot.color}`,
                }}
              >
                {/* Color header bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: hotspot.color }}
                />

                <div className="p-3">
                  {/* Label + color dot */}
                  <div className="flex items-start gap-2 mb-1.5">
                    <span
                      className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: hotspot.color }}
                    />
                    <h4 className="text-[12px] font-bold text-content-primary leading-tight">
                      {hotspot.label}
                    </h4>
                  </div>

                  {/* Latin / anatomical term */}
                  {hotspot.anatomicalTerm && (
                    <p className="text-[10px] italic text-content-tertiary mb-1.5 font-serif pl-4">
                      {hotspot.anatomicalTerm}
                    </p>
                  )}

                  {/* Category badge */}
                  {hotspot.category && (
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-1.5 ml-4"
                      style={{
                        backgroundColor: `${hotspot.color}15`,
                        color: hotspot.color,
                        border: `1px solid ${hotspot.color}35`,
                      }}
                    >
                      {hotspot.category}
                    </span>
                  )}

                  {/* Description */}
                  <p className="text-[11px] text-content-secondary leading-snug pl-4 line-clamp-3">
                    {hotspot.description}
                  </p>

                  {/* Click-for-more hint */}
                  {isHovered && !isActive && (
                    <p className="text-[9px] text-primary-700 mt-2 pl-4 font-semibold">
                      Click to inspect details →
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom pointer arrow */}
              <div className="flex justify-center -mt-px">
                <div
                  className="w-3 h-3 rotate-45 border-r border-b border-stone-200 bg-white"
                  style={{
                    boxShadow: "2px 2px 4px rgba(0,0,0,0.05)",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

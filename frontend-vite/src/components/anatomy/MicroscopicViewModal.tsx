// ─────────────────────────────────────────────────────────────────────────────
// MicroscopicViewModal.tsx — Interactive Histology & Cellular Architecture
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import {
  X,
  ZoomIn,
  Sparkles,
  Info,
  Layers,
  CheckCircle2,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { cardiacHistologyStructures } from "@/data/anatomyData";
import { useViewerStore } from "@/stores/useViewerStore";

export function MicroscopicViewModal() {
  const isMicroscopicOpen = useViewerStore((s) => s.isMicroscopicOpen);
  const setIsMicroscopicOpen = useViewerStore((s) => s.setIsMicroscopicOpen);
  const [magnification, setMagnification] = useState<"40x" | "100x" | "400x" | "1000x">("400x");
  const [stain, setStain] = useState<"he" | "trichrome">("he");
  const [selectedStructureId, setSelectedStructureId] = useState<string>("intercalated-discs");

  if (!isMicroscopicOpen) return null;

  const activeStructure =
    cardiacHistologyStructures.find((s) => s.id === selectedStructureId) ||
    cardiacHistologyStructures[0];

  const magLevels: ("40x" | "100x" | "400x" | "1000x")[] = ["40x", "100x", "400x", "1000x"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm animate-fade-in select-none">
      <div className="border border-stone-200 w-full max-w-5xl h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-content-primary bg-white">
        {/* ── Modal Header ──────────────────────────────────────────── */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 shadow-xs">
              <ZoomIn className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-content-primary">
                  Microscopic Histology View
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-700 rounded-full border border-primary-200">
                  Cardiac Myocyte Architecture
                </span>
              </div>
              <p className="text-xs text-content-secondary">
                Explore syncytial branching, intercalated discs, gap junctions, and sarcomeres under varying optical magnifications.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMicroscopicOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-content-primary hover:bg-stone-100 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Main Content Area ─────────────────────────────────────── */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* Left Canvas: High-Resolution Microscopic Canvas Simulation */}
          <div className="flex-1 bg-[#1A1817] relative flex flex-col overflow-hidden">
            {/* Top Canvas Controls Bar */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
              {/* Magnification Switcher */}
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-stone-400 px-2">
                  MAG:
                </span>
                {magLevels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setMagnification(lvl)}
                    className={`
                      px-2.5 py-1 rounded-xl text-xs font-bold transition-all
                      ${
                        magnification === lvl
                          ? "bg-primary-600 text-white shadow-soft"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                      }
                    `}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* Histology Stain Switcher */}
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-stone-400 px-2">
                  STAIN:
                </span>
                <button
                  onClick={() => setStain("he")}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    stain === "he"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  H&E Stain
                </button>
                <button
                  onClick={() => setStain("trichrome")}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    stain === "trichrome"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  Masson's
                </button>
              </div>
            </div>

            {/* Microscopic Slide Viewport with SVG Diagrammatic Histology */}
            <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
              <svg
                viewBox="0 0 800 500"
                className="w-full h-full max-h-[460px] filter drop-shadow-2xl transition-all duration-300"
                style={{
                  transform:
                    magnification === "40x"
                      ? "scale(0.85)"
                      : magnification === "100x"
                      ? "scale(1.0)"
                      : magnification === "400x"
                      ? "scale(1.25)"
                      : "scale(1.55)",
                }}
              >
                {/* Background Tissue Field */}
                <defs>
                  {/* Striations pattern */}
                  <pattern
                    id="sarcomere-striations"
                    width="12"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="40"
                      stroke={stain === "he" ? "#881337" : "#1e3a8a"}
                      strokeWidth="2.5"
                      opacity="0.5"
                    />
                    <line
                      x1="6"
                      y1="0"
                      x2="6"
                      y2="40"
                      stroke={stain === "he" ? "#f43f5e" : "#3b82f6"}
                      strokeWidth="1.5"
                      opacity="0.3"
                    />
                  </pattern>

                  {/* Gradient for Muscle Fiber */}
                  <linearGradient id="fiber-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop
                      offset="0%"
                      stopColor={stain === "he" ? "#9f1239" : "#1d4ed8"}
                    />
                    <stop
                      offset="50%"
                      stopColor={stain === "he" ? "#be123c" : "#2563eb"}
                    />
                    <stop
                      offset="100%"
                      stopColor={stain === "he" ? "#881337" : "#1e40af"}
                    />
                  </linearGradient>
                </defs>

                {/* Microscope circular vignette lens effect */}
                <circle
                  cx="400"
                  cy="250"
                  r="380"
                  fill="#111"
                  stroke="#333"
                  strokeWidth="6"
                />

                {/* ── Main Muscle Fiber 1 (Upper Branch) ──────────────── */}
                <path
                  d="M 50 140 Q 250 130 400 160 T 750 140 L 750 220 Q 550 240 400 220 T 50 220 Z"
                  fill="url(#fiber-grad)"
                  opacity="0.9"
                />
                <path
                  d="M 50 140 Q 250 130 400 160 T 750 140 L 750 220 Q 550 240 400 220 T 50 220 Z"
                  fill="url(#sarcomere-striations)"
                />

                {/* Branching Y-junction connector */}
                <path
                  d="M 400 180 Q 480 250 550 310 L 530 360 Q 420 280 360 210 Z"
                  fill="url(#fiber-grad)"
                  opacity="0.9"
                />
                <path
                  d="M 400 180 Q 480 250 550 310 L 530 360 Q 420 280 360 210 Z"
                  fill="url(#sarcomere-striations)"
                />

                {/* ── Lower Branching Muscle Fiber 2 ──────────────────── */}
                <path
                  d="M 50 290 Q 260 270 420 300 T 750 300 L 750 380 Q 560 390 420 370 T 50 370 Z"
                  fill="url(#fiber-grad)"
                  opacity="0.9"
                />
                <path
                  d="M 50 290 Q 260 270 420 300 T 750 300 L 750 380 Q 560 390 420 370 T 50 370 Z"
                  fill="url(#sarcomere-striations)"
                />

                {/* ── Nucleus 1 (Central Oval Pale Nucleus) ───────────── */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedStructureId("nucleus")}
                >
                  <ellipse
                    cx="230"
                    cy="180"
                    rx="32"
                    ry="20"
                    fill="#312e81"
                    stroke="#818cf8"
                    strokeWidth="2.5"
                  />
                  <circle cx="225" cy="178" r="6" fill="#c7d2fe" />
                </g>

                {/* ── Nucleus 2 (Lower Fiber) ─────────────────────────── */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedStructureId("nucleus")}
                >
                  <ellipse
                    cx="580"
                    cy="340"
                    rx="34"
                    ry="22"
                    fill="#312e81"
                    stroke="#818cf8"
                    strokeWidth="2.5"
                  />
                  <circle cx="575" cy="338" r="6" fill="#c7d2fe" />
                </g>

                {/* ── Intercalated Disc (Step-like boundary) ──────────── */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedStructureId("intercalated-discs")}
                >
                  {/* Step-like dark purple/black band */}
                  <path
                    d="M 330 148 L 330 178 L 348 178 L 348 214"
                    stroke="#facc15"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="339"
                    cy="181"
                    r="12"
                    fill="#e11d48"
                    className="animate-ping opacity-40"
                  />
                  <circle cx="339" cy="181" r="8" fill="#e11d48" stroke="#fff" strokeWidth="2" />
                </g>

                {/* Another Intercalated Disc on Lower Fiber */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedStructureId("intercalated-discs")}
                >
                  <path
                    d="M 280 292 L 280 326 L 295 326 L 295 365"
                    stroke="#facc15"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="288" cy="330" r="7" fill="#facc15" stroke="#fff" strokeWidth="2" />
                </g>

                {/* ── Mitochondria (Giant Cristae Clusters) ───────────── */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedStructureId("mitochondria")}
                >
                  <ellipse
                    cx="150"
                    cy="165"
                    rx="14"
                    ry="7"
                    fill="#06b6d4"
                    stroke="#e0f2fe"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="175"
                    cy="195"
                    rx="15"
                    ry="8"
                    fill="#06b6d4"
                    stroke="#e0f2fe"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="480"
                    cy="175"
                    rx="16"
                    ry="8"
                    fill="#06b6d4"
                    stroke="#e0f2fe"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="510"
                    cy="195"
                    rx="13"
                    ry="7"
                    fill="#06b6d4"
                    stroke="#e0f2fe"
                    strokeWidth="1.5"
                  />
                </g>

                {/* ── Blood Capillary with Erythrocytes in Endomysium ─── */}
                <path
                  d="M 60 250 Q 300 240 740 260"
                  stroke="#ef4444"
                  strokeWidth="14"
                  opacity="0.3"
                  strokeLinecap="round"
                />
                {/* Red blood cells in single file */}
                <circle cx="180" cy="247" r="7" fill="#dc2626" />
                <circle cx="280" cy="246" r="7" fill="#dc2626" />
                <circle cx="430" cy="250" r="7" fill="#dc2626" />
                <circle cx="580" cy="254" r="7" fill="#dc2626" />

                {/* Scale Bar at bottom left */}
                <g transform="translate(80, 430)">
                  <line x1="0" y1="0" x2="80" y2="0" stroke="#fff" strokeWidth="3" />
                  <line x1="0" y1="-5" x2="0" y2="5" stroke="#fff" strokeWidth="3" />
                  <line x1="80" y1="-5" x2="80" y2="5" stroke="#fff" strokeWidth="3" />
                  <text x="25" y="-8" fill="#fff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                    {magnification === "40x"
                      ? "100 μm"
                      : magnification === "100x"
                      ? "50 μm"
                      : magnification === "400x"
                      ? "20 μm"
                      : "5 μm"}
                  </text>
                </g>
              </svg>

              {/* Bottom Canvas Overlay Legend */}
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[11px] text-white/70 bg-black/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 pointer-events-auto">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#facc15]" />
                    Intercalated Disc (Desmosomes & Gap Junctions)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#312e81] border border-[#818cf8]" />
                    Centrally Placed Nucleus
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
                    Abundant Mitochondria (35% volume)
                  </span>
                </div>
                <span className="text-white/40 italic">
                  Click any structure for high-yield histology analysis
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel: Selected Structure Explanations & High-Yield Pearls */}
          <div className="w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-stone-200 flex flex-col justify-between overflow-y-auto p-5 scrollbar-thin bg-white">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700">
                  HISTOLOGY STRUCTURES
                </span>
                <h3 className="text-lg font-black text-content-primary mt-0.5">
                  Cardiac Myocyte Architecture
                </h3>
              </div>

              {/* Structure Selection Chips */}
              <div className="flex flex-wrap gap-1.5">
                {cardiacHistologyStructures.map((s) => {
                  const isSel = s.id === selectedStructureId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStructureId(s.id)}
                      className={`
                        px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5
                        ${
                          isSel
                            ? "bg-primary-600 text-white shadow-soft font-bold"
                            : "text-content-secondary border border-stone-200 bg-white hover:text-content-primary hover:bg-stone-50"
                        }
                      `}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: s.color }}
                      />
                      <span>{s.name.split("&")[0].trim()}</span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Active Structure Card */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-content-primary">
                      {activeStructure.name}
                    </h4>
                    {activeStructure.latinName && (
                      <p className="text-xs text-content-tertiary italic font-serif">
                        {activeStructure.latinName}
                      </p>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 text-primary-700 border border-primary-200">
                    {activeStructure.tag}
                  </span>
                </div>

                <p className="text-xs text-content-secondary leading-relaxed">
                  {activeStructure.description}
                </p>

                <div className="p-3 border border-emerald-200 bg-emerald-50/70 rounded-xl">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>PHYSIOLOGICAL SIGNIFICANCE</span>
                  </div>
                  <p className="text-xs text-emerald-950 leading-relaxed">
                    {activeStructure.significance}
                  </p>
                </div>
              </div>

              {/* Comparative Histology Callout */}
              <div className="border border-stone-200 bg-stone-50/60 rounded-2xl p-3.5 space-y-2 text-xs text-content-secondary">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cardiomyocytes vs Skeletal Muscle</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl border border-stone-200 bg-white">
                    <span className="font-bold text-primary-700 block mb-0.5">Cardiac</span>
                    <p>• 1–2 central nuclei</p>
                    <p>• Branched cells + discs</p>
                    <p>• Involuntary automaticity</p>
                    <p>• 35% mitochondria</p>
                  </div>
                  <div className="p-2.5 rounded-xl border border-stone-200 bg-white">
                    <span className="font-bold text-blue-700 block mb-0.5">Skeletal</span>
                    <p>• Multiple peripheral nuclei</p>
                    <p>• Unbranched long fibers</p>
                    <p>• Voluntary somatic control</p>
                    <p>• 2–5% mitochondria</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Close Button */}
            <div className="pt-4 border-t border-stone-200">
              <button
                onClick={() => setIsMicroscopicOpen(false)}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-soft"
              >
                Return to 3D Viewport
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

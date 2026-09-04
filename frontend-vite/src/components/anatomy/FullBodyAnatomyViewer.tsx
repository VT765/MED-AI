// ─────────────────────────────────────────────────────────────────────────────
// FullBodyAnatomyViewer.tsx — Studio-Grade Full-Body Anatomy & Skeletal Explorer
// Medically styled, lightweight, high-performance, and dashboard-theme friendly.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Search,
  RotateCcw,
  Scan,
  CheckCircle2,
  X,
  MessageSquare,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Activity,
  Heart,
  Bone,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  FULL_BODY_STRUCTURES,
  SYSTEM_TABS,
  type AnatomicalStructure,
  type AnatomicalSystem,
} from "@/data/fullBodyAnatomyData";

export function FullBodyAnatomyViewer() {
  const [selectedStructure, setSelectedStructure] = useState<AnatomicalStructure | null>(
    FULL_BODY_STRUCTURES[1] // Heart default
  );
  const [hoveredStructure, setHoveredStructure] = useState<AnatomicalStructure | null>(null);
  const [activeSystem, setActiveSystem] = useState<AnatomicalSystem>("all");
  const [bioScanActive, setBioScanActive] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [xRayMode, setXRayMode] = useState(false);

  // Filtered structures based on system and search
  const filteredStructures = useMemo(() => {
    return FULL_BODY_STRUCTURES.filter((s) => {
      const matchesSystem = activeSystem === "all" || s.system === activeSystem;
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.latinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.region.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSystem && matchesSearch;
    });
  }, [activeSystem, searchQuery]);

  const showSkeletal = activeSystem === "all" || activeSystem === "skeletal";
  const showOrgans = activeSystem === "all" || activeSystem === "organ";
  const showVascular = activeSystem === "all" || activeSystem === "vascular";
  const showNervous = activeSystem === "all" || activeSystem === "nervous";

  const handleSelect = (s: AnatomicalStructure) => {
    setSelectedStructure(s);
  };

  return (
    <div
      id="full-body-anatomy"
      className="relative w-full rounded-3xl border border-stone-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-100/80 text-content-primary shadow-card overflow-hidden"
    >
      {/* ── Top Header Bar — Dashboard Theme Friendly ────────────────── */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 bg-white/90 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 border border-primary-200 text-primary-600 shadow-xs">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-content-primary tracking-tight">
                Full-Body Human Anatomy & Skeletal Explorer
              </h3>
              <span className="rounded-full bg-primary-100 border border-primary-200/70 px-2.5 py-0.5 text-[10px] font-bold text-primary-700">
                CLINICAL SPECIMEN
              </span>
            </div>
            <p className="text-xs text-content-secondary">
              Interactive Multi-Layer Skeletal Bones, Visceral Organs, Vascular & Neural Networks
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-xs sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bones or organs..."
            className="w-full rounded-xl border border-stone-200 bg-stone-50/90 pl-8 pr-3 py-1.5 text-xs text-content-primary placeholder:text-stone-400 focus:border-primary-500 focus:bg-white focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* ── System Layer Selector Strip ──────────────────────────────── */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 bg-stone-50/70 px-6 py-2.5 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1.5">
          {SYSTEM_TABS.map((tab) => {
            const isSelected = activeSystem === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSystem(tab.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-primary-600 text-white shadow-soft font-bold"
                    : "bg-white border border-stone-200/80 text-content-secondary hover:border-primary-200 hover:text-content-primary"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Tools & Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setXRayMode(!xRayMode)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-semibold border transition-all ${
              xRayMode
                ? "border-cyan-500 bg-cyan-50 text-cyan-700 font-bold"
                : "border-stone-200 bg-white text-content-secondary hover:bg-stone-50"
            }`}
            title="Toggle X-Ray Skeletal Focus"
          >
            <Layers className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">X-Ray Mode</span>
          </button>

          <button
            onClick={() => setBioScanActive(!bioScanActive)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-semibold border transition-all ${
              bioScanActive
                ? "border-primary-500 bg-primary-50 text-primary-700 font-bold"
                : "border-stone-200 bg-white text-content-secondary hover:bg-stone-50"
            }`}
            title="Toggle Holographic Bio-Scanner"
          >
            <Scan className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Bio-Scanner</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center rounded-xl border border-stone-200 bg-white p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.4))}
              className="p-1 text-content-secondary hover:text-content-primary rounded-lg hover:bg-stone-100"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="px-1.5 text-[10px] font-mono font-bold text-content-secondary hover:text-content-primary"
              title="Reset Zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.75))}
              className="p-1 text-content-secondary hover:text-content-primary rounded-lg hover:bg-stone-100"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Anatomy Canvas Stage + Clinical Details Panel ──────── */}
      <div className="relative h-[650px] w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">
        {/* Soft Clinical Grid & Pedestal Shadow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0596690a_1px,transparent_1px),linear-gradient(to_bottom,#0596690a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 h-10 rounded-full bg-slate-400/20 blur-xl pointer-events-none" />

        {/* ── Interactive Medical Full Body Structure SVG ────────────── */}
        <motion.div
          animate={{ scale: zoomLevel }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative h-full w-full max-w-[480px] flex items-center justify-center select-none"
        >
          {/* Bio-Scanner Laser Beam */}
          {bioScanActive && (
            <motion.div
              className="pointer-events-none absolute inset-x-8 z-10 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_15px_#06b6d4]"
              animate={{ top: ["8%", "92%", "8%"] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            />
          )}

          <svg
            viewBox="0 0 360 720"
            className="h-[92%] w-auto drop-shadow-md overflow-visible"
          >
            <defs>
              {/* Soft Organic Gradients for Realism */}
              <linearGradient id="bodySkinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={xRayMode ? "0.04" : "0.12"} />
                <stop offset="50%" stopColor="#0ea5e9" stopOpacity={xRayMode ? "0.03" : "0.09"} />
                <stop offset="100%" stopColor="#0284c7" stopOpacity={xRayMode ? "0.02" : "0.07"} />
              </linearGradient>

              <linearGradient id="boneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>

              <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>

              <linearGradient id="lungsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>

              <linearGradient id="liverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>

              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* ── 1. REALISTIC HUMAN BODY SILHOUETTE OUTLINE ── */}
            <path
              d="
                M 180,30
                C 200,30 216,46 216,74
                C 216,92 208,108 200,118
                C 198,124 196,134 200,138
                C 214,142 246,150 258,168
                C 268,184 274,218 280,260
                C 284,290 286,340 288,380
                C 290,400 282,410 274,410
                C 268,410 264,394 262,370
                C 256,310 248,260 242,228
                C 238,206 230,224 230,250
                C 230,286 234,330 236,368
                C 238,398 238,440 236,470
                C 234,510 228,570 224,620
                C 222,650 220,684 220,690
                C 220,696 212,698 206,698
                C 198,698 196,690 196,680
                C 196,650 198,600 198,540
                C 198,490 192,440 188,410
                C 184,386 182,386 180,386
                C 178,386 176,386 172,410
                C 168,440 162,490 162,540
                C 162,600 164,650 164,680
                C 164,690 162,698 154,698
                C 148,698 140,696 140,690
                C 140,684 138,650 136,620
                C 132,570 126,510 124,470
                C 122,440 122,398 124,368
                C 126,330 130,286 130,250
                C 130,224 122,206 118,228
                C 112,260 104,310 98,370
                C 96,394 92,410 86,410
                C 78,410 70,400 72,380
                C 74,340 76,290 80,260
                C 86,218 92,184 102,168
                C 114,150 146,142 160,138
                C 164,134 162,124 160,118
                C 152,108 144,92 144,74
                C 144,46 160,30 180,30
                Z
              "
              fill="url(#bodySkinGradient)"
              stroke="#0ea5e9"
              strokeWidth="1.2"
              strokeDasharray={xRayMode ? "4 3" : "none"}
              className="transition-all duration-500"
            />

            {/* ── 2. CARDIOVASCULAR & NERVOUS SYSTEMS ── */}
            {showVascular && (
              <g className="cursor-pointer" onClick={() => handleSelect(FULL_BODY_STRUCTURES[10])}>
                {/* Aortic Arch & Systemic Arteries (Red) */}
                <path
                  d="M 180,180 Q 188,160 184,148 Q 180,140 174,148 Q 170,165 178,210 Q 180,270 180,320 Q 170,360 156,440 Q 146,520 148,640"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 180,320 Q 190,360 204,440 Q 214,520 212,640"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Vena Cava & Systemic Veins (Cyan/Blue) */}
                <path
                  d="M 186,170 Q 186,260 185,320 Q 176,360 162,440 Q 152,520 154,640"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 185,320 Q 196,360 210,440 Q 220,520 218,640"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            )}

            {showNervous && (
              <g className="cursor-pointer" onClick={() => handleSelect(FULL_BODY_STRUCTURES[11])}>
                {/* Spinal Cord & Neural Trunks (Gold/Cyan) */}
                <path
                  d="M 180,90 L 180,340"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.8"
                  strokeDasharray="4 2"
                />
                {/* Branching peripheral nerves */}
                {[-1, 1].map((dir, i) => (
                  <g key={i}>
                    <path
                      d={`M 180,150 Q ${180 + 35 * dir},170 ${180 + 75 * dir},240 Q ${180 + 85 * dir},300 ${180 + 95 * dir},380`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                    <path
                      d={`M 180,340 Q ${180 + 20 * dir},400 ${180 + 32 * dir},500 Q ${180 + 36 * dir},600 ${180 + 34 * dir},660`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                  </g>
                ))}
              </g>
            )}

            {/* ── 3. SKELETAL SYSTEM (BONES) ── */}
            {showSkeletal && (
              <g className="transition-opacity duration-300">
                {/* Cranium / Skull */}
                <g
                  className="cursor-pointer group"
                  onClick={() => handleSelect(FULL_BODY_STRUCTURES[0])}
                  onMouseEnter={() => setHoveredStructure(FULL_BODY_STRUCTURES[0])}
                  onMouseLeave={() => setHoveredStructure(null)}
                >
                  <ellipse
                    cx="180"
                    cy="72"
                    rx="26"
                    ry="32"
                    fill="url(#boneGradient)"
                    stroke={selectedStructure?.id === "bone_cranium" ? "#0284c7" : "#64748b"}
                    strokeWidth={selectedStructure?.id === "bone_cranium" ? "2.5" : "1.2"}
                  />
                  {/* Orbits & Nasal */}
                  <ellipse cx="171" cy="74" rx="5" ry="6" fill="#334155" opacity="0.4" />
                  <ellipse cx="189" cy="74" rx="5" ry="6" fill="#334155" opacity="0.4" />
                  <path d="M 180,82 L 180,89" stroke="#334155" strokeWidth="2" opacity="0.5" />
                  {/* Mandible */}
                  <path
                    d="M 166,88 C 168,106 192,106 194,88 Z"
                    fill="#cbd5e1"
                    stroke="#64748b"
                    strokeWidth="1"
                  />
                </g>

                {/* Cervical & Thoracic Spine */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelect(FULL_BODY_STRUCTURES[1])}
                  onMouseEnter={() => setHoveredStructure(FULL_BODY_STRUCTURES[1])}
                  onMouseLeave={() => setHoveredStructure(null)}
                >
                  {Array.from({ length: 14 }).map((_, i) => (
                    <rect
                      key={i}
                      x="175"
                      y={120 + i * 14}
                      width="10"
                      height="9"
                      rx="2"
                      fill={selectedStructure?.id === "bone_spine" ? "#0284c7" : "#94a3b8"}
                      stroke="#475569"
                      strokeWidth="0.8"
                    />
                  ))}
                </g>

                {/* Clavicles & Arms Skeleton */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelect(FULL_BODY_STRUCTURES[4])}
                  onMouseEnter={() => setHoveredStructure(FULL_BODY_STRUCTURES[4])}
                  onMouseLeave={() => setHoveredStructure(null)}
                >
                  {/* Clavicles */}
                  <path
                    d="M 180,140 Q 155,136 130,146"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 180,140 Q 205,136 230,146"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Left Arm (Humerus, Radius, Ulna) */}
                  <line x1="126" y1="152" x2="108" y2="230" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="108" cy="232" r="4" fill="#94a3b8" />
                  <line x1="106" y1="236" x2="92" y2="330" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
                  {/* Right Arm */}
                  <line x1="234" y1="152" x2="252" y2="230" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="252" cy="232" r="4" fill="#94a3b8" />
                  <line x1="254" y1="236" x2="268" y2="330" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
                </g>

                {/* Thoracic Ribcage & Sternum */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelect(FULL_BODY_STRUCTURES[2])}
                  onMouseEnter={() => setHoveredStructure(FULL_BODY_STRUCTURES[2])}
                  onMouseLeave={() => setHoveredStructure(null)}
                >
                  {/* Sternum */}
                  <rect
                    x="177"
                    y="152"
                    width="6"
                    height="58"
                    rx="2"
                    fill={selectedStructure?.id === "bone_ribcage" ? "#0284c7" : "#f1f5f9"}
                    stroke="#64748b"
                    strokeWidth="1.2"
                  />
                  {/* Left & Right Rib Pairs */}
                  {[160, 172, 184, 196, 208].map((y, idx) => (
                    <g key={idx}>
                      <path
                        d={`M 177,${y} C ${155 - idx * 2},${y - 4} ${140 - idx * 2},${y + 12} ${175},${y + 16}`}
                        fill="none"
                        stroke={selectedStructure?.id === "bone_ribcage" ? "#0284c7" : "#94a3b8"}
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        opacity="0.85"
                      />
                      <path
                        d={`M 183,${y} C ${205 + idx * 2},${y - 4} ${220 + idx * 2},${y + 12} ${185},${y + 16}`}
                        fill="none"
                        stroke={selectedStructure?.id === "bone_ribcage" ? "#0284c7" : "#94a3b8"}
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        opacity="0.85"
                      />
                    </g>
                  ))}
                </g>

                {/* Pelvis & Sacrum */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelect(FULL_BODY_STRUCTURES[3])}
                  onMouseEnter={() => setHoveredStructure(FULL_BODY_STRUCTURES[3])}
                  onMouseLeave={() => setHoveredStructure(null)}
                >
                  <path
                    d="M 152,320 C 145,300 170,296 180,312 C 190,296 215,300 208,320 C 205,348 190,360 180,364 C 170,360 155,348 152,320 Z"
                    fill={selectedStructure?.id === "bone_pelvis" ? "#0284c7" : "url(#boneGradient)"}
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  {/* Obturator foramina */}
                  <ellipse cx="170" cy="344" rx="4" ry="6" fill="#334155" opacity="0.3" />
                  <ellipse cx="190" cy="344" rx="4" ry="6" fill="#334155" opacity="0.3" />
                </g>

                {/* Lower Limbs (Femur, Patella, Tibia, Fibula) */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelect(FULL_BODY_STRUCTURES[5])}
                  onMouseEnter={() => setHoveredStructure(FULL_BODY_STRUCTURES[5])}
                  onMouseLeave={() => setHoveredStructure(null)}
                >
                  {/* Left Leg Femur */}
                  <line x1="168" y1="356" x2="160" y2="480" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="160" cy="484" r="5" fill="#94a3b8" />
                  <line x1="160" y1="490" x2="154" y2="640" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                  {/* Right Leg Femur */}
                  <line x1="192" y1="356" x2="200" y2="480" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="200" cy="484" r="5" fill="#94a3b8" />
                  <line x1="200" y1="490" x2="206" y2="640" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                </g>
              </g>
            )}

            {/* ── 4. INTERNAL ORGANS (VISCERAL) ── */}
            {showOrgans && (
              <g className="transition-opacity duration-300">
                {/* Brain */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelect(FULL_BODY_STRUCTURES[6])}
                  onMouseEnter={() => setHoveredStructure(FULL_BODY_STRUCTURES[6])}
                  onMouseLeave={() => setHoveredStructure(null)}
                >
                  <path
                    d="M 166,66 C 162,50 174,44 180,48 C 186,44 198,50 194,66 C 192,76 168,76 166,66 Z"
                    fill="#f472b6"
                    stroke={selectedStructure?.id === "organ_brain" ? "#db2777" : "#be185d"}
                    strokeWidth={selectedStructure?.id === "organ_brain" ? "2.5" : "1"}
                    filter="url(#softGlow)"
                  />
                </g>

                {/* Lungs (Left & Right) */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelect(FULL_BODY_STRUCTURES[8])}
                  onMouseEnter={() => setHoveredStructure(FULL_BODY_STRUCTURES[8])}
                  onMouseLeave={() => setHoveredStructure(null)}
                >
                  {/* Left Lung */}
                  <path
                    d="M 152,158 C 144,170 142,204 154,222 C 164,222 168,206 168,180 Z"
                    fill="url(#lungsGradient)"
                    opacity="0.85"
                    stroke={selectedStructure?.id === "organ_lungs" ? "#0891b2" : "#0e7490"}
                    strokeWidth={selectedStructure?.id === "organ_lungs" ? "2" : "1"}
                  />
                  {/* Right Lung */}
                  <path
                    d="M 208,158 C 216,170 218,204 206,222 C 196,222 192,206 192,180 Z"
                    fill="url(#lungsGradient)"
                    opacity="0.85"
                    stroke={selectedStructure?.id === "organ_lungs" ? "#0891b2" : "#0e7490"}
                    strokeWidth={selectedStructure?.id === "organ_lungs" ? "2" : "1"}
                  />
                </g>

                {/* Heart (Beating Rhythmic Pulse) */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelect(FULL_BODY_STRUCTURES[7])}
                  onMouseEnter={() => setHoveredStructure(FULL_BODY_STRUCTURES[7])}
                  onMouseLeave={() => setHoveredStructure(null)}
                >
                  <motion.circle
                    cx="178"
                    cy="188"
                    r="12"
                    fill="url(#heartGradient)"
                    stroke={selectedStructure?.id === "organ_heart" ? "#b91c1c" : "#dc2626"}
                    strokeWidth={selectedStructure?.id === "organ_heart" ? "3" : "1.2"}
                    filter="url(#softGlow)"
                    animate={{ scale: [1, 1.12, 1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                  />
                  {/* Ascending Aorta Arch */}
                  <path d="M 178,176 C 182,166 188,168 186,176" fill="none" stroke="#ef4444" strokeWidth="3" />
                </g>

                {/* Liver */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelect(FULL_BODY_STRUCTURES[9])}
                  onMouseEnter={() => setHoveredStructure(FULL_BODY_STRUCTURES[9])}
                  onMouseLeave={() => setHoveredStructure(null)}
                >
                  <path
                    d="M 166,228 C 172,224 204,222 206,236 C 204,248 180,252 166,242 Z"
                    fill="url(#liverGradient)"
                    stroke={selectedStructure?.id === "organ_liver" ? "#92400e" : "#b45309"}
                    strokeWidth={selectedStructure?.id === "organ_liver" ? "2.2" : "1"}
                  />
                </g>

                {/* Stomach */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelect(FULL_BODY_STRUCTURES[10] || FULL_BODY_STRUCTURES[8])}
                >
                  <path
                    d="M 182,234 C 186,228 196,234 194,246 C 190,254 182,252 180,244 Z"
                    fill="#f59e0b"
                    opacity="0.9"
                  />
                </g>

                {/* Kidneys */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelect(FULL_BODY_STRUCTURES[10] || FULL_BODY_STRUCTURES[7])}
                >
                  <ellipse cx="166" cy="260" rx="5" ry="8" fill="#831843" stroke="#9d174d" strokeWidth="1" />
                  <ellipse cx="194" cy="262" rx="5" ry="8" fill="#831843" stroke="#9d174d" strokeWidth="1" />
                </g>

                {/* Intestines */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelect(FULL_BODY_STRUCTURES[11] || FULL_BODY_STRUCTURES[9])}
                >
                  <rect x="168" y="274" width="24" height="28" rx="6" fill="#ea580c" opacity="0.85" />
                  <path
                    d="M 172,282 Q 180,278 188,282 Q 180,288 172,292 Q 180,296 188,296"
                    fill="none"
                    stroke="#fed7aa"
                    strokeWidth="1.8"
                  />
                </g>

                {/* Bladder */}
                <ellipse cx="180" cy="336" rx="7" ry="6" fill="#eab308" opacity="0.9" />
              </g>
            )}

            {/* ── 5. INTERACTIVE HOTSPOT HIGHLIGHT MARKER ── */}
            {selectedStructure && (
              <g>
                <circle
                  cx={
                    selectedStructure.id === "bone_cranium" ? 180 :
                    selectedStructure.id === "organ_brain" ? 180 :
                    selectedStructure.id === "organ_heart" ? 178 :
                    selectedStructure.id === "organ_lungs" ? 154 :
                    selectedStructure.id === "organ_liver" ? 190 :
                    selectedStructure.id === "bone_ribcage" ? 180 :
                    selectedStructure.id === "bone_spine" ? 180 :
                    selectedStructure.id === "bone_pelvis" ? 180 :
                    selectedStructure.id === "bone_femur_legs" ? 160 : 180
                  }
                  cy={
                    selectedStructure.id === "bone_cranium" ? 72 :
                    selectedStructure.id === "organ_brain" ? 60 :
                    selectedStructure.id === "organ_heart" ? 188 :
                    selectedStructure.id === "organ_lungs" ? 180 :
                    selectedStructure.id === "organ_liver" ? 236 :
                    selectedStructure.id === "bone_ribcage" ? 180 :
                    selectedStructure.id === "bone_spine" ? 210 :
                    selectedStructure.id === "bone_pelvis" ? 330 :
                    selectedStructure.id === "bone_femur_legs" ? 420 : 200
                  }
                  r="8"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                  className="animate-ping"
                />
              </g>
            )}
          </svg>
        </motion.div>

        {/* ── Right-Side Clinical Specimen Sheet — Dashboard Theme Friendly ── */}
        <AnimatePresence>
          {selectedStructure && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.28 }}
              className="absolute top-4 right-4 z-20 w-80 max-h-[610px] overflow-y-auto rounded-2xl border border-stone-200/90 bg-white/95 p-5 shadow-card backdrop-blur-md scrollbar-thin text-left"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-stone-100 pb-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: selectedStructure.color }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 font-mono">
                      {selectedStructure.system} • {selectedStructure.region}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-content-primary mt-1">
                    {selectedStructure.name}
                  </h4>
                  <p className="text-xs italic text-content-secondary">
                    {selectedStructure.latinName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStructure(null)}
                  className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-content-primary transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs leading-relaxed text-content-secondary mb-3.5">
                {selectedStructure.description}
              </p>

              {/* Clinical Metrics Grid */}
              <div className="mb-3.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-content-secondary mb-1.5">
                  Clinical Metrics:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {selectedStructure.vitalMetrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-stone-100 bg-stone-50 p-2"
                    >
                      <div className="text-[10px] text-content-secondary">{m.label}</div>
                      <div className="text-xs font-bold text-primary-700 font-mono">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vital Functions */}
              <div className="mb-3.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-content-secondary mb-1.5">
                  Key Functions:
                </div>
                <ul className="space-y-1.5 text-xs text-content-secondary">
                  {selectedStructure.vitalFunctions.map((fn, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary-600 shrink-0 mt-0.5" />
                      <span>{fn}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Pathologies */}
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-content-secondary mb-1.5">
                  Associated Conditions:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStructure.commonPathologies.map((path, idx) => (
                    <span
                      key={idx}
                      className="rounded-md border border-red-100 bg-red-50/80 px-2 py-0.5 text-[10px] font-medium text-red-700"
                    >
                      {path}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  to={`/chat?q=${encodeURIComponent(selectedStructure.aiPrompt)}`}
                  className="w-full flex items-center justify-center gap-2 rounded-button bg-primary-500 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-primary-600 transition-all active:scale-98"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Ask MedAI About This Structure</span>
                </Link>

                <Link
                  to="/dashboard/anatomy"
                  className="w-full flex items-center justify-center gap-1.5 rounded-button border border-stone-200 bg-white py-2 text-xs font-semibold text-content-primary hover:bg-stone-50 transition-all shadow-xs"
                >
                  <Compass className="h-3.5 w-3.5 text-primary-600" />
                  <span>Deep Dive in 3D Specimen Lab</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom Quick Select Carousel ─────────────────────────────── */}
      <div className="relative z-10 border-t border-stone-200/80 bg-white/90 px-6 py-3 backdrop-blur-md">
        <div className="text-[10px] font-bold uppercase tracking-wider text-content-secondary mb-1.5">
          Select Anatomy to Inspect (Live Interactive Spotlight):
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {filteredStructures.map((struct) => {
            const isSelected = selectedStructure?.id === struct.id;
            return (
              <button
                key={struct.id}
                onClick={() => handleSelect(struct)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "border-primary-500 bg-primary-50 text-primary-800 shadow-xs font-bold"
                    : "border-stone-200 bg-white text-content-secondary hover:border-primary-200 hover:text-content-primary"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: struct.color }}
                />
                <span>{struct.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

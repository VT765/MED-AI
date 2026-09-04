// ─────────────────────────────────────────────────────────────────────────────
// InteractiveAnatomyHero.tsx — Compact, Hyper-Realistic Interactive Anatomy
// Directly matching the user reference with floating vitals and hover dots.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Bot,
  Zap,
  Activity,
  Brain,
  ShieldCheck,
  Compass,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

interface HotspotInfo {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  icon: React.ElementType;
  iconBg: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  cardPosition: "left" | "right";
}

const HOTSPOTS: HotspotInfo[] = [
  {
    id: "brain",
    x: 50,
    y: 12,
    icon: Brain,
    iconBg: "bg-pink-50 text-pink-600 border-pink-200",
    category: "Neural AI Core & Cranium",
    title: "Cognitive & Neuro-Diagnostic Index",
    description:
      "Real-time symptom mapping for cephalalgia, neuropathies, sleep patterns, and acute stroke risk indicators.",
    tags: ["FAST Protocol", "Neural Sync", "Instant Triage"],
    cardPosition: "right",
  },
  {
    id: "lungs",
    x: 43,
    y: 26,
    icon: Activity,
    iconBg: "bg-cyan-50 text-cyan-600 border-cyan-200",
    category: "Pulmonary & Respiratory",
    title: "Alveolar Respiratory Index",
    description:
      "SpO2 saturation monitoring, respiratory effort analysis, and automated bronchial pathology screening.",
    tags: ["SpO2 98%", "Auscultation AI", "COPD Screen"],
    cardPosition: "left",
  },
  {
    id: "heart",
    x: 52,
    y: 29,
    icon: Heart,
    iconBg: "bg-rose-50 text-rose-600 border-rose-200",
    category: "Cardiovascular & Hemodynamics",
    title: "Cardio-Vascular Assessment",
    description:
      "Continuous sinus rhythm monitoring, arterial blood pressure tracking, and coronary risk stratification.",
    tags: ["Sinus Rhythm", "72 BPM", "Lipid Screen"],
    cardPosition: "left",
  },
  {
    id: "metabolic",
    x: 51,
    y: 39,
    icon: Zap,
    iconBg: "bg-amber-50 text-amber-600 border-amber-200",
    category: "Metabolic, Lab OCR & Drug Shield",
    title: "Comprehensive Biomarker Index",
    description:
      "Automated OCR extraction for pathology reports, hepatic panels, and FDA RxNorm drug interaction checks.",
    tags: ["Smart OCR", "RxNorm Screen", "FDA Verified"],
    cardPosition: "right",
  },
  {
    id: "skeleton",
    x: 53,
    y: 68,
    icon: Sparkles,
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200",
    category: "Skeletal & Musculoskeletal",
    title: "Axial & Appendicular Biomechanics",
    description:
      "Bone mineral density evaluation, vertebral column alignment, and lower extremity joint mobility tracking.",
    tags: ["206 Bones", "Spine Health", "Joint Mobility"],
    cardPosition: "right",
  },
];

interface InteractiveAnatomyHeroProps {
  embedded?: boolean;
}

export function InteractiveAnatomyHero({ embedded = false }: InteractiveAnatomyHeroProps) {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const activeHotspot = activeHotspotId
    ? HOTSPOTS.find((h) => h.id === activeHotspotId) || null
    : null;

  return (
    <div
      className={`relative mx-auto w-full select-none overflow-hidden ${
        embedded
          ? "p-2 sm:p-4"
          : "max-w-2xl rounded-3xl border border-stone-200/90 bg-gradient-to-b from-white via-slate-50/80 to-cyan-50/20 p-4 sm:p-6 shadow-card"
      }`}
    >
      {/* Background Soft Medical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70a_1px,transparent_1px),linear-gradient(to_bottom,#0284c70a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* ── Top Floating Medical Widgets ─────────────────────────────── */}
      <div className="relative z-20 flex items-center justify-between gap-3">
        {/* Left Widget: Cardio Vitals */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-stone-200/90 bg-white/95 px-3.5 py-2 shadow-soft backdrop-blur-md"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 border border-rose-100 text-rose-500 shadow-xs">
            <Heart className="h-5 w-5 fill-rose-500 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-content-tertiary">
              Cardio Vitals
            </div>
            <div className="text-xs sm:text-sm font-bold text-content-primary">
              72 BPM <span className="text-emerald-600 font-semibold text-xs">Normal</span>
            </div>
          </div>
        </motion.div>

        {/* Center: Scanning Pill */}
        <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-cyan-200/80 bg-cyan-50/80 px-3 py-1 text-[10px] font-bold tracking-wider text-cyan-800 uppercase shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping" />
          <span>3D Biometric Scanning</span>
        </div>

        {/* Right Widget: AI Diagnosis */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-stone-200/90 bg-white/95 px-3.5 py-2 shadow-soft backdrop-blur-md"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 border border-primary-100 text-primary-600 shadow-xs">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-content-tertiary">
              AI Diagnosis
            </div>
            <div className="text-xs sm:text-sm font-bold text-content-primary">
              500+ Conditions
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Central Stage: Hyper-Realistic Anatomy with Hover Dots ───── */}
      <div
        className="relative mt-2 flex h-[480px] sm:h-[520px] w-full items-center justify-center"
        onMouseLeave={() => setActiveHotspotId(null)}
      >
        {/* Animated Laser Scanning Beam */}
        <motion.div
          className="pointer-events-none absolute inset-x-8 z-10 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4]"
          animate={{ top: ["8%", "88%", "8%"] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />

        {/* Hyper-Realistic Anatomical Body Image */}
        <div className="relative h-full flex items-center justify-center">
          <img
            src="/images/full_body_anatomy_realistic.jpg"
            alt="Hyper-realistic Human Anatomy Model"
            className="h-full w-auto object-contain drop-shadow-md mix-blend-multiply"
          />

          {/* Interactive Glowing Dots positioned precisely on anatomical landmarks */}
          {HOTSPOTS.map((hotspot) => {
            const isActive = activeHotspotId === hotspot.id;
            return (
              <div
                key={hotspot.id}
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer p-3"
                onMouseEnter={() => setActiveHotspotId(hotspot.id)}
                onMouseLeave={() => setActiveHotspotId(null)}
              >
                <div className="relative flex items-center justify-center">
                  {/* Outer Ripple Effect */}
                  <span
                    className={`absolute inline-flex h-7 w-7 rounded-full opacity-60 transition-transform ${
                      isActive
                        ? "bg-teal-400 animate-ping scale-110"
                        : "bg-teal-300 animate-pulse"
                    }`}
                  />
                  {/* Teal Circular Disc with White Center Core */}
                  <div
                    className={`relative flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all shadow-md ${
                      isActive
                        ? "bg-teal-600 border-white scale-125 ring-2 ring-teal-400"
                        : "bg-teal-500 border-white hover:scale-115"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white shadow-xs" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Floating Hover Information Popover Card — pointer-events-none ensures it never blocks cursor or pauses dismissal */}
          <AnimatePresence>
            {activeHotspot && (
              <motion.div
                key={activeHotspot.id}
                initial={{ opacity: 0, scale: 0.95, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 6 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={`pointer-events-none absolute z-30 w-72 sm:w-80 rounded-2xl border border-stone-200/90 bg-white/98 p-4 sm:p-5 shadow-cardHover backdrop-blur-lg text-left ${
                  activeHotspot.cardPosition === "right"
                    ? "right-2 sm:-right-4 top-[32%]"
                    : "left-2 sm:-left-4 top-[24%]"
                }`}
              >
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-lg border text-xs ${activeHotspot.iconBg}`}
                  >
                    <activeHotspot.icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-teal-700 tracking-tight">
                    {activeHotspot.category}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm sm:text-base font-bold text-content-primary leading-snug">
                  {activeHotspot.title}
                </h4>

                {/* Description */}
                <p className="mt-1.5 text-xs leading-relaxed text-content-secondary">
                  {activeHotspot.description}
                </p>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {activeHotspot.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom Strip: Quick CTA to 3D Body Atlas ─────────────────── */}
      <div className="relative z-20 mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/80 pt-3">
        <div className="flex items-center gap-2 text-xs text-content-secondary font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Clinical Anatomical Landmark Mapping</span>
        </div>

        <Link
          to="/dashboard/anatomy"
          className="group inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
        >
          <span>Open Full 3D Body Atlas</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

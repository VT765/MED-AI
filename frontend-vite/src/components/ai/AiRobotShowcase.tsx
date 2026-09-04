import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Activity,
  Cpu,
  Dna,
  ShieldCheck,
  MessageSquare,
  ChevronRight,
  Radio,
  Scan,
  Brain,
  Zap,
  Compass,
} from "lucide-react";
import { Link } from "react-router-dom";

import { InteractiveAnatomyHero } from "@/components/anatomy/InteractiveAnatomyHero";

interface DiagnosticMode {
  id: string;
  label: string;
  icon: React.ElementType;
  status: string;
  metric: string;
  metricLabel: string;
  message: string;
  tag: string;
}

const MODES: DiagnosticMode[] = [
  {
    id: "symptom",
    label: "Symptom Triage",
    icon: Activity,
    status: "Neural Diagnostic Engine Active",
    metric: "99.4%",
    metricLabel: "Diagnostic Precision",
    message:
      "Cross-referencing 100,000+ clinical guidelines. Describe your symptoms for instant differential insights.",
    tag: "Clinical Triaging",
  },
  {
    id: "anatomy",
    label: "3D Anatomy Sync",
    icon: Scan,
    status: "Full-Body Spatial Scan Ready",
    metric: "206 Bones / 78 Organs",
    metricLabel: "Real-Time Mapping",
    message:
      "Interactive multi-layer human anatomy synchronized with internal organs, vascular networks, and skeletal bones.",
    tag: "Bio-Spatial Intelligence",
  },
  {
    id: "labs",
    label: "Lab Decryption",
    icon: Dna,
    status: "Multimodal Lab Report OCR Online",
    metric: "< 2.4s",
    metricLabel: "Biomarker Extraction",
    message:
      "Upload CBC, Lipid, or Metabolic panels to extract normal ranges, out-of-spec flags, and clinical significance.",
    tag: "Automated Pathology",
  },
  {
    id: "pharma",
    label: "Drug Interactions",
    icon: Zap,
    status: "Pharmacology Knowledge Graph Active",
    metric: "Zero-Risk",
    metricLabel: "Contraindication Check",
    message:
      "Validating contraindications, dosage alerts, and safe alternatives tailored to patient medical history.",
    tag: "Safety Protocol",
  },
];

export function AiRobotShowcase() {
  const [viewMode, setViewMode] = useState<"robot" | "biometry">("robot");
  const [activeMode, setActiveMode] = useState<DiagnosticMode>(MODES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [heartRate, setHeartRate] = useState(74);

  // Simulate gentle vital pulse oscillation
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate((prev) => 72 + Math.floor(Math.sin(Date.now() / 1200) * 4));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleModeChange = (mode: DiagnosticMode) => {
    setActiveMode(mode);
    if (mode.id === "anatomy") {
      setViewMode("biometry");
      return;
    }
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 800);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-stone-200/90 bg-gradient-to-br from-white via-primary-50/20 to-teal-50/30 text-content-primary shadow-card">
      {/* Background Soft Medical Glows */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-cyan-100/40 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966908_1px,transparent_1px),linear-gradient(to_bottom,#05966908_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60" />

      {/* Top Header Bar — Dashboard Theme Friendly */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 bg-white/85 px-6 py-3.5 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 border border-primary-200 text-primary-600 shadow-xs">
            <Cpu className="h-5 w-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-500" />
            </span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-content-primary">
                MedAI Autonomous Medical Companion
              </span>
              <span className="rounded-full bg-primary-100 border border-primary-200/70 px-2.5 py-0.5 text-[10px] font-bold text-primary-700">
                ACTIVE
              </span>

              {/* Smooth Toggle: Robot Core vs 3D Biometry */}
              <div className="inline-flex items-center rounded-full border border-stone-200 bg-stone-100/90 p-0.5 shadow-xs ml-1 sm:ml-2">
                <button
                  type="button"
                  onClick={() => setViewMode("robot")}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    viewMode === "robot"
                      ? "bg-white text-primary-700 shadow-soft font-bold"
                      : "text-content-secondary hover:text-content-primary"
                  }`}
                >
                  <Cpu className="h-3.5 w-3.5" />
                  <span>AI Robot</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("biometry")}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    viewMode === "biometry"
                      ? "bg-white text-teal-700 shadow-soft font-bold"
                      : "text-content-secondary hover:text-content-primary"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                  <span>3D Biometry</span>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                </button>
              </div>
            </div>
            <p className="text-xs text-content-secondary">
              Clinical Reasoning & Bio-Spatial Health Intelligence
            </p>
          </div>
        </div>

        {/* Live Audio / Frequency Waveform */}
        <div className="hidden sm:flex items-center gap-2.5 rounded-full border border-stone-200 bg-white/90 px-3.5 py-1.5 shadow-xs">
          <Radio className="h-3.5 w-3.5 text-primary-600 animate-pulse" />
          <span className="text-xs font-semibold text-content-secondary">VOICE MATRIX</span>
          <div className="flex items-center gap-1 h-3">
            {[6, 12, 18, 9, 15, 8, 14, 10, 16].map((h, i) => (
              <motion.div
                key={i}
                className="w-0.5 rounded-full bg-primary-500"
                animate={{ height: [4, h, 6] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + (i % 3) * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic View Body: AI Robot Core vs 3D Biometry */}
      <AnimatePresence mode="wait">
        {viewMode === "robot" ? (
          <motion.div
            key="robot-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 grid gap-8 p-6 lg:grid-cols-12 lg:p-8 items-center"
          >
            {/* Left: AI Robot Avatar Display */}
            <div className="relative lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative mx-auto flex w-full max-w-[340px] items-center justify-center">
                {/* Soft Ambient Rings */}
                <motion.div
                  className="absolute -inset-3 rounded-full border border-primary-300/30"
                  animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute -inset-6 rounded-full border border-cyan-300/20"
                  animate={{ scale: [1.02, 1.07, 1.02], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.4 }}
                />

                {/* AI Robot Video / Image Container */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                  className="relative aspect-square w-full overflow-hidden rounded-3xl border border-stone-200/90 bg-stone-900 shadow-cardHover group"
                >
                  <img
                    src="/images/medical_ai_robot.jpg"
                    alt="MedAI Medical Robot Assistant"
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* High-Tech Overlay Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Status Tag */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full bg-black/50 border border-white/20 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                    <Radio className="h-3 w-3 text-cyan-400 animate-pulse" />
                    <span>AI SYNAPSE: 99.8%</span>
                  </div>

                  {/* Bottom Stats Overlay */}
                  <div className="absolute bottom-3.5 inset-x-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-xl bg-black/60 border border-white/10 px-3 py-1.5 backdrop-blur-md">
                      <Activity className="h-4 w-4 text-rose-400 animate-pulse" />
                      <div>
                        <div className="text-[9px] font-medium text-stone-300">PULSE</div>
                        <div className="text-xs font-bold text-white">{heartRate} <span className="text-[10px] font-normal text-stone-300">BPM</span></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/30 px-3 py-1.5 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>HIPAA ENCRYPTED</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Status Badge below Robot */}
              <div className="mt-4 flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-4 py-1 text-xs font-semibold text-teal-800 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                <span>{activeMode.status}</span>
              </div>
            </div>

            {/* Right: Interactive Diagnostics Matrix */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-content-tertiary">
                  Select AI Intelligence Matrix:
                </span>
                <span className="text-[11px] font-medium text-primary-600">
                  Adaptive Multimodal Engine
                </span>
              </div>

              {/* Mode Selector Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = activeMode.id === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => handleModeChange(mode)}
                      className={`group relative flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? "border-teal-500 bg-white shadow-soft ring-2 ring-teal-500/20"
                          : "border-stone-200 bg-white/70 hover:bg-white hover:border-stone-300"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isSelected
                            ? "bg-teal-500 text-white shadow-xs"
                            : "bg-stone-100 text-content-secondary group-hover:bg-primary-50 group-hover:text-primary-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-content-primary truncate">
                            {mode.label}
                          </h4>
                          {mode.id === "anatomy" && (
                            <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                              3D View
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-content-tertiary truncate">
                          {mode.tag}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Info Panel for Selected Mode */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMode.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 rounded-2xl border border-stone-200/90 bg-white/95 p-5 shadow-soft"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                        <activeMode.icon className="h-4 w-4" />
                      </div>
                      <h4 className="text-sm font-bold text-content-primary">
                        {activeMode.label} Intelligence
                      </h4>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-teal-700">
                        {activeMode.metric}
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-content-tertiary">
                        {activeMode.metricLabel}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-content-secondary">
                    {activeMode.message}
                  </p>

                  {/* Real-Time Bio Signal Waveform in Card */}
                  <div className="mt-4 rounded-xl border border-stone-100 bg-surface/80 p-2.5">
                    <div className="flex items-center justify-between text-[10px] font-medium text-content-secondary mb-1">
                      <span>REAL-TIME BIO-SIGNAL</span>
                      <span className="font-bold text-emerald-600">NORMAL SINUS RHYTHM</span>
                    </div>
                    <svg
                      className="w-full h-8 text-primary-600 overflow-visible"
                      viewBox="0 0 300 30"
                      fill="none"
                    >
                      <path
                        d="M0,15 L40,15 L50,15 L55,5 L60,25 L65,10 L70,18 L75,15 L120,15 L125,5 L130,25 L135,10 L140,18 L145,15 L190,15 L195,5 L200,25 L205,10 L210,18 L215,15 L260,15 L265,5 L270,25 L275,10 L280,18 L285,15 L300,15"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {/* Action Buttons inside Card */}
                  <div className="mt-4 flex flex-wrap items-center gap-2.5">
                    <Link
                      to="/chat"
                      className="inline-flex items-center gap-2 rounded-button bg-primary-500 px-4 py-2 text-xs font-semibold text-white shadow-soft hover:bg-primary-600 transition-all active:scale-95"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Consult MedAI Robot</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setViewMode("biometry")}
                      className="inline-flex items-center gap-1.5 rounded-button border border-teal-300 bg-teal-50 px-3.5 py-2 text-xs font-semibold text-teal-800 hover:bg-teal-100 transition-all shadow-xs"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                      <span>Switch to 3D Biometry</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="biometry-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 p-2 sm:p-6"
          >
            <InteractiveAnatomyHero embedded />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

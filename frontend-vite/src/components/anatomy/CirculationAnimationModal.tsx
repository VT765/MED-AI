// ─────────────────────────────────────────────────────────────────────────────
// CirculationAnimationModal.tsx — Animated Blood Circulation & Cardiac Cycle
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import {
  X,
  Play,
  Pause,
  Activity,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldCheck,
  Zap,
  Gauge,
  Info,
} from "lucide-react";
import { circulationSteps } from "@/data/anatomyData";
import { useViewerStore } from "@/stores/useViewerStore";

export function CirculationAnimationModal() {
  const isCirculationOpen = useViewerStore((s) => s.isCirculationOpen);
  const setIsCirculationOpen = useViewerStore((s) => s.setIsCirculationOpen);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [bpm, setBpm] = useState<number>(75);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [cyclePhase, setCyclePhase] = useState<"Systole" | "Diastole">("Systole");

  // Step advancement timer based on BPM
  useEffect(() => {
    if (!isCirculationOpen || !isPlaying) return;

    // Time per full cycle in ms = (60 / bpm) * 1000
    const stepDuration = Math.max(700, ((60 / bpm) * 1000) / circulationSteps.length);

    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        const next = (prev + 1) % circulationSteps.length;
        // Steps 1, 2, 5, 6 correlate with systole vs diastole
        if (next === 1 || next === 5) {
          setCyclePhase("Systole");
        } else if (next === 0 || next === 4) {
          setCyclePhase("Diastole");
        }
        return next;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isCirculationOpen, isPlaying, bpm]);

  if (!isCirculationOpen) return null;

  const currentStep = circulationSteps[activeStepIndex];
  const strokeVolume = 70; // mL
  const cardiacOutput = ((bpm * strokeVolume) / 1000).toFixed(2); // L/min

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm animate-fade-in select-none">
      <div className="border border-stone-200 w-full max-w-5xl h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-content-primary bg-white">
        {/* ── Modal Header ──────────────────────────────────────────── */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 shadow-xs">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-content-primary">
                  Blood Circulation & Cardiac Cycle
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-700 rounded-full border border-primary-200">
                  Real-time Hemodynamic Flow
                </span>
              </div>
              <p className="text-xs text-content-secondary">
                Interactive visual flow showing deoxygenated vs oxygenated transit through all 4 cardiac chambers and great vessels.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCirculationOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-content-primary hover:bg-stone-100 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Top Hemodynamic Telemetry Strip ───────────────────────── */}
        <div className="border-b border-stone-200 px-6 py-3 flex items-center justify-between flex-wrap gap-4 flex-shrink-0 bg-stone-50/60">
          <div className="flex items-center gap-6 text-xs">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-soft transition-all"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>Pause Cycle</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Resume Cycle</span>
                </>
              )}
            </button>

            {/* Heart Rate (BPM) Slider */}
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-bold text-content-tertiary">RATE:</span>
              <input
                type="range"
                min={50}
                max={150}
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value))}
                className="w-24 h-1.5 bg-stone-200 rounded-full accent-primary-600 cursor-pointer"
              />
              <span className="font-mono font-extrabold text-xs text-primary-700 min-w-[55px]">
                {bpm} BPM
              </span>
            </div>

            {/* Cardiac Output Readout */}
            <div className="flex items-center gap-1.5 border-l border-stone-200 pl-4">
              <Gauge className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] text-content-tertiary">CARDIAC OUTPUT:</span>
              <span className="font-mono font-extrabold text-xs text-emerald-700">
                {cardiacOutput} L/min
              </span>
            </div>

            {/* Active Cycle Phase */}
            <div className="flex items-center gap-1.5 border-l border-stone-200 pl-4">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] text-content-tertiary">PHASE:</span>
              <span className="font-bold text-xs text-content-primary px-2 py-0.5 rounded-md border border-stone-200 bg-white shadow-xs">
                {cyclePhase}
              </span>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors
              ${
                soundEnabled
                  ? "border-emerald-300 text-emerald-800 bg-emerald-50"
                  : "border-stone-200 text-content-secondary hover:bg-stone-50 bg-white"
              }
            `}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            )}
            <span>{soundEnabled ? "Lub-Dub (S1/S2) On" : "Heart Sound Muted"}</span>
          </button>
        </div>

        {/* ── Main Circulation Viewport & Steps ─────────────────────── */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* Left Canvas: Animated Schematic Circulatory Loop & Heart Chambers */}
          <div className="flex-1 bg-[#1A1817] relative flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Synchronized ECG Waveform Bar across top */}
            <div className="absolute top-4 left-6 right-6 h-12 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 px-4 flex items-center justify-between overflow-hidden z-20">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
                <span className="text-xs font-mono font-bold text-[#10b981]">
                  LEAD II ECG RHYTHM
                </span>
              </div>

              {/* Animated SVG ECG trace */}
              <svg className="w-64 h-8 overflow-visible" viewBox="0 0 240 30">
                <path
                  d="M 0 15 L 40 15 L 50 12 L 60 15 L 70 15 L 75 19 L 80 2 L 85 24 L 90 15 L 100 15 L 115 10 L 130 15 L 170 15 L 180 12 L 190 15 L 200 15 L 205 19 L 210 2 L 215 24 L 220 15 L 240 15"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="ecg-trace"
                />
              </svg>

              <div className="flex items-center gap-3 text-[10px] font-mono text-white/60">
                <span>P-WAVE (Atrial)</span>
                <span>QRS (Ventricular)</span>
                <span>T-WAVE (Repol)</span>
              </div>
            </div>

            {/* Central Circulatory Circuit Diagram */}
            <svg
              viewBox="0 0 700 460"
              className="w-full h-full max-h-[440px] filter drop-shadow-2xl"
            >
              <defs>
                {/* Flow glow filters */}
                <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* ── Pulmonary Loop (Upper Half) ───────────────────────── */}
              {/* Deoxygenated Flow to Lungs (Blue) */}
              <path
                d="M 280 180 C 280 90, 320 50, 350 50 C 380 50, 420 90, 420 180"
                fill="none"
                stroke="#2563eb"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Lungs Capillary Bed (Purple exchange node) */}
              <g transform="translate(350, 50)">
                <circle cx="0" cy="0" r="28" fill="#1e1b4b" stroke="#818cf8" strokeWidth="3" />
                <text x="0" y="4" textAnchor="middle" fill="#c7d2fe" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                  LUNGS
                </text>
              </g>

              {/* Oxygenated Flow from Lungs to Left Atrium (Red) */}
              <path
                d="M 370 50 C 400 50, 440 90, 440 200"
                fill="none"
                stroke="#dc2626"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* ── Central Heart Representation (4 Chambers) ─────────── */}
              {/* Heart Container Box */}
              <rect
                x="220"
                y="160"
                width="260"
                height="200"
                rx="28"
                fill="#262220"
                stroke="#443c39"
                strokeWidth="4"
              />

              {/* Right Atrium (RA) - Top Left */}
              <g
                className="cursor-pointer transition-all"
                onClick={() => setActiveStepIndex(0)}
              >
                <rect
                  x="230"
                  y="170"
                  width="115"
                  height="85"
                  rx="16"
                  fill={activeStepIndex === 0 ? "#1e3a8a" : "#1e293b"}
                  stroke={activeStepIndex === 0 ? "#60a5fa" : "#334155"}
                  strokeWidth={activeStepIndex === 0 ? "3" : "1.5"}
                />
                <text x="287" y="210" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                  RIGHT ATRIUM
                </text>
                <text x="287" y="228" textAnchor="middle" fill="#60a5fa" fontSize="9" fontFamily="sans-serif">
                  Deoxygenated 75%
                </text>
              </g>

              {/* Left Atrium (LA) - Top Right */}
              <g
                className="cursor-pointer transition-all"
                onClick={() => setActiveStepIndex(4)}
              >
                <rect
                  x="355"
                  y="170"
                  width="115"
                  height="85"
                  rx="16"
                  fill={activeStepIndex === 4 ? "#991b1b" : "#451a1a"}
                  stroke={activeStepIndex === 4 ? "#f87171" : "#7f1d1d"}
                  strokeWidth={activeStepIndex === 4 ? "3" : "1.5"}
                />
                <text x="412" y="210" textAnchor="middle" fill="#fca5a5" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                  LEFT ATRIUM
                </text>
                <text x="412" y="228" textAnchor="middle" fill="#f87171" fontSize="9" fontFamily="sans-serif">
                  Oxygenated 99%
                </text>
              </g>

              {/* Right Ventricle (RV) - Bottom Left */}
              <g
                className="cursor-pointer transition-all"
                onClick={() => setActiveStepIndex(1)}
              >
                <rect
                  x="230"
                  y="265"
                  width="115"
                  height="85"
                  rx="16"
                  fill={activeStepIndex === 1 ? "#2563eb" : "#1e293b"}
                  stroke={activeStepIndex === 1 ? "#93c5fd" : "#334155"}
                  strokeWidth={activeStepIndex === 1 ? "3" : "1.5"}
                />
                <text x="287" y="305" textAnchor="middle" fill="#bfdbfe" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                  RIGHT VENTRICLE
                </text>
                <text x="287" y="323" textAnchor="middle" fill="#93c5fd" fontSize="9" fontFamily="sans-serif">
                  Low Pressure (25 mmHg)
                </text>
              </g>

              {/* Left Ventricle (LV) - Bottom Right */}
              <g
                className="cursor-pointer transition-all"
                onClick={() => setActiveStepIndex(5)}
              >
                <rect
                  x="355"
                  y="265"
                  width="115"
                  height="85"
                  rx="16"
                  fill={activeStepIndex === 5 ? "#dc2626" : "#451a1a"}
                  stroke={activeStepIndex === 5 ? "#fca5a5" : "#7f1d1d"}
                  strokeWidth={activeStepIndex === 5 ? "3" : "1.5"}
                />
                <text x="412" y="305" textAnchor="middle" fill="#fecaca" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                  LEFT VENTRICLE
                </text>
                <text x="412" y="323" textAnchor="middle" fill="#fca5a5" fontSize="9" fontFamily="sans-serif">
                  High Pressure (120 mmHg)
                </text>
              </g>

              {/* ── Systemic Loop (Lower Half) ────────────────────────── */}
              {/* High Pressure Aorta to Body Tissues (Red) */}
              <path
                d="M 440 350 C 440 420, 390 440, 350 440 C 310 440, 260 420, 260 350"
                fill="none"
                stroke="#dc2626"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Systemic Tissue Capillary Bed */}
              <g transform="translate(350, 440)">
                <circle cx="0" cy="0" r="28" fill="#312e81" stroke="#a78bfa" strokeWidth="3" />
                <text x="0" y="4" textAnchor="middle" fill="#ede9fe" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  BODY TISSUES
                </text>
              </g>

              {/* Deoxygenated Return via Vena Cava (Blue) */}
              <path
                d="M 330 440 C 290 440, 240 400, 240 255"
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Dynamic Blood Flow Particles */}
              {isPlaying && (
                <>
                  {/* Moving Blue Particle */}
                  <circle r="6" fill="#60a5fa" filter="url(#glow-blue)">
                    <animateMotion
                      path="M 240 440 C 200 350, 240 220, 280 200 L 280 300 C 280 90, 320 50, 350 50"
                      dur={`${(60 / bpm) * 2.5}s`}
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Moving Red Particle */}
                  <circle r="6" fill="#f87171" filter="url(#glow-red)">
                    <animateMotion
                      path="M 350 50 C 420 90, 440 200, 420 200 L 420 300 C 440 420, 390 440, 350 440"
                      dur={`${(60 / bpm) * 2.5}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </>
              )}
            </svg>

            {/* Bottom Overlay Info */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-white/70 bg-black/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 pointer-events-auto">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                  Deoxygenated Blood (Venous)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" />
                  Oxygenated Blood (Arterial)
                </span>
              </div>
              <span className="text-white/40 italic">
                Step {activeStepIndex + 1} of {circulationSteps.length}
              </span>
            </div>
          </div>

          {/* Right Panel: Step-by-Step Pathway Navigator & Chamber Specs */}
          <div className="w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-stone-200 flex flex-col justify-between overflow-y-auto p-5 scrollbar-thin bg-white">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700">
                  CIRCULATION STAGE {currentStep.step} / {circulationSteps.length}
                </span>
                <h3 className="text-lg font-black text-content-primary mt-0.5">
                  {currentStep.name}
                </h3>
                <p className="text-xs text-content-tertiary italic font-serif">
                  {currentStep.latinName}
                </p>
              </div>

              {/* Step Sequence Bar */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {circulationSteps.map((step, idx) => (
                  <button
                    key={step.step}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`
                      px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex-shrink-0
                      ${
                        activeStepIndex === idx
                          ? "bg-primary-600 text-white font-bold shadow-soft"
                          : "text-content-secondary border border-stone-200 bg-white hover:text-content-primary hover:bg-stone-50"
                      }
                    `}
                  >
                    Stage {step.step}
                  </button>
                ))}
              </div>

              {/* Chamber Hemodynamic Specs Card */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4 shadow-xs space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl border border-stone-200 bg-white">
                    <span className="text-[10px] font-bold text-content-tertiary uppercase block mb-0.5">
                      Intracardiac Pressure
                    </span>
                    <span className="font-extrabold text-content-primary">
                      {currentStep.pressure}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-stone-200 bg-white">
                    <span className="text-[10px] font-bold text-content-tertiary uppercase block mb-0.5">
                      Oxygen Saturation
                    </span>
                    <span className="font-extrabold text-primary-700">
                      {currentStep.oxygenSat}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-content-secondary pt-1">
                  <div>
                    <span className="font-bold text-content-primary block">Valve Action:</span>
                    <p className="text-[11px] leading-snug text-content-secondary">{currentStep.valveAction}</p>
                  </div>
                  <div className="pt-1">
                    <span className="font-bold text-content-primary block">Chamber State:</span>
                    <p className="text-[11px] leading-snug text-content-secondary">{currentStep.chamberState}</p>
                  </div>
                  <div className="pt-2">
                    <span className="font-bold text-content-primary block">Physiological Flow:</span>
                    <p className="text-xs text-content-secondary leading-relaxed mt-0.5">
                      {currentStep.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Heart Sounds Callout */}
              <div className="border border-stone-200 bg-stone-50/60 rounded-2xl p-3.5 space-y-1 text-xs text-content-secondary">
                <div className="flex items-center gap-1.5 font-bold text-primary-700">
                  <Activity className="w-3.5 h-3.5 text-primary-600" />
                  <span>Auscultation: Lub-Dub Mechanics</span>
                </div>
                <p className="text-[11px] leading-snug text-content-secondary">
                  • <strong className="text-content-primary">S1 ("Lub")</strong>: Sudden closure of Mitral and Tricuspid valves at the start of ventricular systole.
                </p>
                <p className="text-[11px] leading-snug text-content-secondary">
                  • <strong className="text-content-primary">S2 ("Dub")</strong>: Sharp closure of Aortic and Pulmonary semilunar valves at the onset of diastole.
                </p>
              </div>
            </div>

            {/* Bottom Stepper Buttons */}
            <div className="pt-4 border-t border-stone-200 flex gap-2">
              <button
                onClick={() =>
                  setActiveStepIndex(
                    (prev) => (prev - 1 + circulationSteps.length) % circulationSteps.length
                  )
                }
                className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl text-xs font-semibold text-content-primary transition-colors"
              >
                Previous Stage
              </button>
              <button
                onClick={() =>
                  setActiveStepIndex((prev) => (prev + 1) % circulationSteps.length)
                }
                className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs shadow-soft transition-all"
              >
                Next Stage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

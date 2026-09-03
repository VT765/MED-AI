// ─────────────────────────────────────────────────────────────────────────────
// HeartBrainComparisonModal.tsx — Side-by-Side Heart vs Brain Comparison
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import {
  X,
  Heart,
  Brain,
  Activity,
  Zap,
  Flame,
  ShieldAlert,
  ArrowRightLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { heartBrainComparisonData } from "@/data/anatomyData";
import { useViewerStore } from "@/stores/useViewerStore";

export function HeartBrainComparisonModal() {
  const isComparisonOpen = useViewerStore((s) => s.isComparisonOpen);
  const setIsComparisonOpen = useViewerStore((s) => s.setIsComparisonOpen);
  const [selectedParamId, setSelectedParamId] = useState<string>("function");

  if (!isComparisonOpen) return null;

  const activeParam =
    heartBrainComparisonData.find((p) => p.id === selectedParamId) ||
    heartBrainComparisonData[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm animate-fade-in select-none">
      <div className="border border-stone-200 w-full max-w-5xl h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-content-primary bg-white">
        {/* ── Modal Header ──────────────────────────────────────────── */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 shadow-xs">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-content-primary">
                  Heart versus Brain Comparison
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-700 rounded-full border border-primary-200">
                  Cardiovascular vs Nervous System
                </span>
              </div>
              <p className="text-xs text-content-secondary">
                Detailed comparative analysis across structure, cellular synchronization, electrophysiology, fuel metabolism, and ischemic vulnerability.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsComparisonOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-content-primary hover:bg-stone-100 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Visual Comparison Banner (Heart vs Brain) ─────────────── */}
        <div className="border-b border-stone-200 px-6 py-4 flex-shrink-0 bg-stone-50/70">
          <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Heart Quick Badge */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-primary-200 bg-white shadow-xs">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-stone-50 border border-stone-200 flex-shrink-0">
                <img
                  src="/organs/heart.jpg"
                  alt="Heart"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/logo.png";
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary-700">
                  <Heart className="w-3.5 h-3.5 fill-primary-600" />
                  <span>THE HEART (COR)</span>
                </div>
                <p className="text-xs font-extrabold text-content-primary mt-0.5">
                  The Tireless Hydraulic Pump
                </p>
                <p className="text-[10px] text-content-tertiary">
                  ~100,000 beats/day · 5 L/min cardiac output
                </p>
              </div>
            </div>

            {/* Brain Quick Badge */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-blue-200 bg-white shadow-xs">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-stone-50 border border-stone-200 flex-shrink-0">
                <img
                  src="/organs/brain.jpg"
                  alt="Brain"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/logo.png";
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                  <Brain className="w-3.5 h-3.5" />
                  <span>THE BRAIN (ENCEPHALON)</span>
                </div>
                <p className="text-xs font-extrabold text-content-primary mt-0.5">
                  The Central Neural Processor
                </p>
                <p className="text-[10px] text-content-tertiary">
                  86B neurons · 20% body glucose & oxygen consumption
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Comparison Matrix ────────────────────────────────── */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Navigation: Comparison Categories */}
          <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-stone-200 p-4 overflow-y-auto space-y-1.5 flex-shrink-0 scrollbar-thin bg-stone-50/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-content-tertiary px-2 block mb-1">
              COMPARISON PARAMETERS
            </span>

            {heartBrainComparisonData.map((param) => {
              const isSelected = param.id === selectedParamId;
              return (
                <button
                  key={param.id}
                  onClick={() => setSelectedParamId(param.id)}
                  className={`
                    w-full text-left p-3 rounded-2xl text-xs transition-all duration-150 flex items-center justify-between
                    ${
                      isSelected
                        ? "bg-primary-50/80 border border-primary-300 text-primary-950 font-bold shadow-xs"
                        : "bg-white hover:bg-stone-50 text-content-secondary hover:text-content-primary border border-stone-200/80"
                    }
                  `}
                >
                  <div>
                    <span className="text-[10px] font-semibold text-content-tertiary block">
                      {param.category}
                    </span>
                    <span className="font-bold text-xs">{param.parameter}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? "text-primary-600 translate-x-0.5" : "text-stone-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Content: Dual Side-by-Side Comparison Cards */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin bg-white">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700">
                {activeParam.category}
              </span>
              <h3 className="text-xl font-black text-content-primary mt-0.5">
                {activeParam.parameter}
              </h3>
            </div>

            {/* Side-by-Side Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Heart Card */}
              <div className="rounded-3xl border border-primary-200 bg-gradient-to-br from-primary-50/50 to-primary-100/30 p-5 shadow-xs space-y-3 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary-700 mb-1.5">
                    <Heart className="w-4 h-4 fill-primary-600 text-primary-600" />
                    <span>HEART DYNAMICS</span>
                  </div>
                  <h4 className="text-base font-extrabold text-content-primary">
                    {activeParam.heart.title}
                  </h4>
                  {activeParam.heart.metric && (
                    <div className="inline-block mt-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-primary-100 text-primary-800 border border-primary-200">
                      {activeParam.heart.metric}
                    </div>
                  )}
                  <p className="text-xs text-content-secondary leading-relaxed mt-3">
                    {activeParam.heart.details}
                  </p>
                </div>
              </div>

              {/* Brain Card */}
              <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/50 to-blue-100/30 p-5 shadow-xs space-y-3 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-1.5">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span>BRAIN COMPUTATION</span>
                  </div>
                  <h4 className="text-base font-extrabold text-content-primary">
                    {activeParam.brain.title}
                  </h4>
                  {activeParam.brain.metric && (
                    <div className="inline-block mt-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      {activeParam.brain.metric}
                    </div>
                  )}
                  <p className="text-xs text-content-secondary leading-relaxed mt-3">
                    {activeParam.brain.details}
                  </p>
                </div>
              </div>
            </div>

            {/* High-Yield Clinical Takeaway Alert */}
            <div className="p-4 border border-amber-200 rounded-2xl bg-amber-50/70 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>CLINICAL PEARL & VULNERABILITY INTERACTION</span>
              </div>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                {activeParam.clinicalTakeaway}
              </p>
            </div>

            {/* Complete Quick Matrix Overview Table */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4 shadow-xs">
              <h4 className="text-xs font-bold text-content-tertiary uppercase tracking-wider mb-3">
                SUMMARY COMPARISON MATRIX
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-stone-200 text-content-tertiary">
                      <th className="py-2 pr-3 font-semibold">Parameter</th>
                      <th className="py-2 px-3 font-semibold text-primary-700">Heart</th>
                      <th className="py-2 pl-3 font-semibold text-blue-700">Brain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/70">
                    <tr>
                      <td className="py-2.5 pr-3 font-bold text-content-primary">Primary Substrate</td>
                      <td className="py-2.5 px-3 text-content-secondary">Fatty acids (60–70%) & lactate</td>
                      <td className="py-2.5 pl-3 text-content-secondary">Glucose (~120g/day) & ketones</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-bold text-content-primary">Impulse Mechanism</td>
                      <td className="py-2.5 px-3 text-content-secondary">SA node intrinsic automaticity</td>
                      <td className="py-2.5 pl-3 text-content-secondary">Synaptic neurotransmitter firing</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-bold text-content-primary">Cell Organization</td>
                      <td className="py-2.5 px-3 text-content-secondary">Intercalated disc syncytium</td>
                      <td className="py-2.5 pl-3 text-content-secondary">Discrete plastic neural networks</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-bold text-content-primary">Emergency Window</td>
                      <td className="py-2.5 px-3 text-content-secondary">PCI door-to-balloon ≤ 90 min</td>
                      <td className="py-2.5 pl-3 text-content-secondary">IV tPA thrombolytic ≤ 4.5 hrs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ── Modal Footer ──────────────────────────────────────────── */}
        <div className="px-6 py-3.5 border-t border-stone-200 flex items-center justify-between flex-shrink-0 bg-stone-50/60">
          <p className="text-xs text-content-tertiary">
            Select any parameter on the left to drill down into specific physiological differences.
          </p>
          <button
            onClick={() => setIsComparisonOpen(false)}
            className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-soft"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}

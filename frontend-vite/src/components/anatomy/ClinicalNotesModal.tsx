// ─────────────────────────────────────────────────────────────────────────────
// ClinicalNotesModal.tsx — Clinical Atlas & Common Cardiovascular Pathologies
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import {
  X,
  Stethoscope,
  AlertTriangle,
  FileText,
  Search,
  CheckCircle2,
  Activity,
  HeartCrack,
  ShieldCheck,
  ChevronRight,
  Flame,
} from "lucide-react";
import { clinicalConditions, type ClinicalCondition } from "@/data/anatomyData";
import { useViewerStore } from "@/stores/useViewerStore";

export function ClinicalNotesModal() {
  const isClinicalNotesOpen = useViewerStore((s) => s.isClinicalNotesOpen);
  const setIsClinicalNotesOpen = useViewerStore((s) => s.setIsClinicalNotesOpen);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedConditionId, setSelectedConditionId] = useState<string>("myocardial-infarction");
  const [searchFilter, setSearchFilter] = useState<string>("");

  if (!isClinicalNotesOpen) return null;

  const categories = ["All", "Ischemic", "Arrhythmic", "Structural", "Valvular", "Inflammatory"];

  const filteredConditions = clinicalConditions.filter((c) => {
    const matchesCat = selectedCategory === "All" || c.category === selectedCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.pathophysiology.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.hallmarkSymptoms.some((s) => s.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const activeCondition =
    clinicalConditions.find((c) => c.id === selectedConditionId) ||
    clinicalConditions[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm animate-fade-in select-none">
      <div className="border border-stone-200 w-full max-w-5xl h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-content-primary bg-white">
        {/* ── Modal Header ──────────────────────────────────────────── */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-content-primary">
                  Cardiovascular Clinical Atlas & Pathology
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-700 rounded-full border border-primary-200">
                  Evidence-Based Medicine
                </span>
              </div>
              <p className="text-xs text-content-secondary">
                High-yield clinical diagnostics, ECG patterns, emergency interventions, and pearls for major heart conditions.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsClinicalNotesOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-content-primary hover:bg-stone-100 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Filter Bar ────────────────────────────────────────────── */}
        <div className="border-b border-stone-200 px-6 py-2.5 flex items-center justify-between flex-wrap gap-3 flex-shrink-0 bg-stone-50/60">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-3 py-1 rounded-xl text-xs font-semibold transition-all flex-shrink-0
                  ${
                    selectedCategory === cat
                      ? "bg-primary-600 text-white font-bold shadow-soft"
                      : "text-content-secondary border border-stone-200 bg-white hover:text-content-primary hover:bg-stone-50"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search condition..."
              className="w-full pl-7 pr-2.5 py-1 text-xs border border-stone-200 rounded-xl text-content-primary bg-white placeholder:text-stone-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* ── Main Content Area ─────────────────────────────────────── */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Column: Condition List */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-stone-200 p-3.5 overflow-y-auto space-y-1.5 flex-shrink-0 scrollbar-thin bg-stone-50/40">
            {filteredConditions.map((cond) => {
              const isSelected = cond.id === activeCondition.id;
              return (
                <button
                  key={cond.id}
                  onClick={() => setSelectedConditionId(cond.id)}
                  className={`
                    w-full text-left p-3 rounded-2xl text-xs transition-all duration-150 flex items-center justify-between group
                    ${
                      isSelected
                        ? "bg-primary-50/80 border border-primary-300 shadow-xs"
                        : "bg-white hover:bg-stone-50 text-content-secondary hover:text-content-primary border border-stone-200/80"
                    }
                  `}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cond.severityColor }}
                      />
                      <span className="text-[10px] uppercase font-bold text-content-tertiary">
                        {cond.category}
                      </span>
                    </div>
                    <h4 className={`font-extrabold text-xs truncate ${isSelected ? "text-primary-950" : "text-content-primary"}`}>
                      {cond.name.split("(")[0].trim()}
                    </h4>
                    <p className="text-[10px] text-content-tertiary truncate mt-0.5">
                      {cond.subtitle}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${
                      isSelected ? "text-primary-600 translate-x-0.5" : "text-stone-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: In-depth Condition Dossier */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin bg-white">
            {/* Title & Classification Banner */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                  {activeCondition.category} Condition
                </span>
                <span className="text-xs text-content-tertiary font-mono">
                  Prevalence: {activeCondition.prevalence}
                </span>
              </div>
              <h3 className="text-2xl font-black text-content-primary tracking-tight">
                {activeCondition.name}
              </h3>
              <p className="text-sm font-semibold text-content-secondary mt-0.5">
                {activeCondition.subtitle}
              </p>
            </div>

            {/* Pathophysiology */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-content-tertiary mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary-600" />
                <span>PATHOPHYSIOLOGY & CELLULAR MECHANISM</span>
              </h4>
              <p className="text-xs text-content-secondary leading-relaxed">
                {activeCondition.pathophysiology}
              </p>
            </div>

            {/* Hallmark Symptoms Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-content-tertiary mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>HALLMARK SYMPTOMS & CLINICAL PRESENTATION</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activeCondition.hallmarkSymptoms.map((sym, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-xl border border-stone-200 bg-stone-50/60 text-xs text-content-secondary"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>{sym}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Gold Standard & 12-Lead ECG Findings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>DIAGNOSTIC GOLD STANDARD</span>
                </div>
                <p className="text-xs text-blue-900 leading-relaxed">
                  {activeCondition.diagnosticGoldStandard}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <Activity className="w-4 h-4 text-amber-600" />
                  <span>12-LEAD ECG FINDINGS</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed font-mono text-[11px]">
                  {activeCondition.ecgFindings}
                </p>
              </div>
            </div>

            {/* Acute Treatment Protocol */}
            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ACUTE INTERVENTION & MANAGEMENT PROTOCOL</span>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed">
                {activeCondition.acuteTreatment}
              </p>
            </div>

            {/* High-Yield Clinical Pearls */}
            <div className="p-4 rounded-2xl border border-primary-200 bg-primary-50/60 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary-800">
                <Flame className="w-4 h-4 text-primary-600" />
                <span>HIGH-YIELD CLINICAL PEARLS</span>
              </div>
              <ul className="space-y-1.5 text-xs text-primary-950 list-disc pl-4">
                {activeCondition.clinicalPearls.map((pearl, i) => (
                  <li key={i} className="leading-snug">
                    {pearl}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Modal Footer ──────────────────────────────────── */}
        <div className="px-6 py-3.5 border-t border-stone-200 flex items-center justify-between flex-shrink-0 bg-stone-50/60">
          <p className="text-xs text-content-tertiary">
            Select any pathology from the list to review evidence-based guidelines and clinical pearls.
          </p>
          <button
            onClick={() => setIsClinicalNotesOpen(false)}
            className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-soft"
          >
            Return to Anatomy
          </button>
        </div>
      </div>
    </div>
  );
}

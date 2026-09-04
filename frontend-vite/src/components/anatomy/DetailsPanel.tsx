// ─────────────────────────────────────────────────────────────────────────────
// DetailsPanel.tsx — Right Specimen Details Panel matching the reference UI
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import {
  Heart,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Play,
  HelpCircle,
  Share2,
  CheckCircle2,
  XCircle,
  X,
  ChevronsRight,
} from "lucide-react";
import { useViewerStore } from "@/stores/useViewerStore";
import { getOrganById } from "@/data/anatomyData";

export function DetailsPanel() {
  const activeOrganId = useViewerStore((s) => s.activeOrganId);
  const activeHotspot = useViewerStore((s) => s.activeHotspot);
  const setActiveHotspot = useViewerStore((s) => s.setActiveHotspot);
  const heartbeatAnimation = useViewerStore((s) => s.heartbeatAnimation);
  const toggleHeartbeat = useViewerStore((s) => s.toggleHeartbeat);
  const isQuizOpen = useViewerStore((s) => s.isQuizOpen);
  const setIsQuizOpen = useViewerStore((s) => s.setIsQuizOpen);
  const isLessonOpen = useViewerStore((s) => s.isLessonOpen);
  const setIsLessonOpen = useViewerStore((s) => s.setIsLessonOpen);
  const toggleCompareMode = useViewerStore((s) => s.toggleCompareMode);
  const setIsMicroscopicOpen = useViewerStore((s) => s.setIsMicroscopicOpen);
  const setIsCirculationOpen = useViewerStore((s) => s.setIsCirculationOpen);
  const setIsComparisonOpen = useViewerStore((s) => s.setIsComparisonOpen);
  const setIsClinicalNotesOpen = useViewerStore((s) => s.setIsClinicalNotesOpen);
  const setIsAiAssistantOpen = useViewerStore((s) => s.setIsAiAssistantOpen);
  const setIsDetailsExpanded = useViewerStore((s) => s.setIsDetailsExpanded);

  const organ = getOrganById(activeOrganId);

  return (
    <aside className="w-[340px] h-full flex flex-col justify-between select-none overflow-hidden border-l border-stone-200 bg-surface-elevated">
      {/* ── Main Content Area ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
        {/* ── Top Header Section ────────────────────────────────────── */}
        <div>
          <button
            onClick={() => setIsDetailsExpanded(false)}
            className="mb-2 flex items-center gap-1 text-[10px] font-semibold text-content-tertiary hover:text-content-primary transition-colors"
            title="Collapse panel"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
            <span>Collapse</span>
          </button>
          <div className="flex items-start justify-between gap-3">
            <div>
              {/* Category / Sub-badge in Teal */}
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary-600 tracking-wider uppercase mb-1">
                <Heart className="w-3 h-3 fill-primary-600" />
                <span>THE {organ.name.toUpperCase()}</span>
              </div>

              {/* Title & Tagline */}
              <h1 className="text-2xl font-black text-content-primary tracking-tight">
                {organ.name}
              </h1>
              <p className="text-xs text-primary-700 italic font-serif mt-0.5">
                {organ.tagline}
              </p>
            </div>

            {/* Circular Organ Thumbnail with Border */}
            <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-stone-50 border border-stone-200 shadow-xs">
              <img
                src={organ.thumbnail}
                alt={organ.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Description Paragraph */}
          <p className="text-xs text-content-secondary leading-relaxed mt-3">
            {organ.description}
          </p>
        </div>

        {/* ── Active Hotspot Callout (If a pin is selected) ─────────── */}
        {activeHotspot && (
          <div className="p-3.5 rounded-2xl border border-primary-200 bg-primary-50/60 shadow-xs relative animate-fade-up">
            <button
              onClick={() => setActiveHotspot(null)}
              className="absolute top-2.5 right-2.5 text-stone-400 hover:text-stone-700 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: activeHotspot.color }}
              />
              <h4 className="text-xs font-bold text-content-primary">
                {activeHotspot.label}
              </h4>
            </div>
            {activeHotspot.anatomicalTerm && (
              <p className="text-[10px] italic text-content-tertiary font-serif mb-1">
                {activeHotspot.anatomicalTerm}
              </p>
            )}
            <p className="text-xs text-content-secondary leading-snug">
              {activeHotspot.description}
            </p>
            {activeHotspot.details && (
              <p className="text-[11px] text-content-tertiary mt-1 italic">
                {activeHotspot.details}
              </p>
            )}
          </div>
        )}

        {/* ── Key Facts Section ─────────────────────────────────────── */}
        <div>
          <h2 className="text-[11px] font-bold text-content-tertiary tracking-widest uppercase mb-3">
            KEY FACTS
          </h2>

          <div className="space-y-2">
            {organ.keyFacts.map((fact, index) => (
              <div
                key={index}
                className="grid grid-cols-[100px_1fr] items-start text-xs leading-snug py-0.5"
              >
                <div className="flex items-center gap-1.5 text-content-tertiary">
                  <span className="text-[10px]">{fact.icon}</span>
                  <span className="font-medium">{fact.label}</span>
                </div>
                <div className="font-semibold text-content-primary">
                  {fact.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Medical Importance Callout (Matches Dashboard AI Insight card) ── */}
        <div className="p-4 rounded-2xl border border-primary-200/80 bg-gradient-to-br from-primary-50 to-primary-100/50 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary-700 tracking-wider uppercase mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
            <span>MEDICAL IMPORTANCE</span>
          </div>
          <p className="text-xs text-primary-900 font-medium leading-relaxed">
            {organ.medicalImportance}
          </p>
        </div>

        {/* ── Did You Know Callout (Matches Dashboard Daily Tip card) ── */}
        <div className="p-4 rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-amber-100/40 shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>DID YOU KNOW</span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            {organ.didYouKnow}
          </p>
        </div>

        {/* ── Enriched Specialty Modules Grid (Matches Dashboard Quick Actions) ── */}
        <div className="space-y-2 pt-1">
          <h3 className="text-[11px] font-bold text-content-tertiary tracking-widest uppercase">
            SPECIALIZED EXPLORATION
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setIsMicroscopicOpen(true)}
              className="p-3 rounded-2xl border border-stone-200 bg-white hover:border-primary-300 hover:bg-primary-50/40 text-left transition-all group shadow-xs hover:shadow-cardHover"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-content-primary group-hover:text-primary-700 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-primary-600" />
                <span>Microscopic View</span>
              </div>
              <p className="text-[10px] text-content-tertiary leading-tight">
                Tissue histology (40x–1000x)
              </p>
            </button>

            <button
              onClick={() => setIsCirculationOpen(true)}
              className="p-3 rounded-2xl border border-stone-200 bg-white hover:border-primary-300 hover:bg-primary-50/40 text-left transition-all group shadow-xs hover:shadow-cardHover"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-content-primary group-hover:text-primary-700 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Circulation Flow</span>
              </div>
              <p className="text-[10px] text-content-tertiary leading-tight">
                Animated cardiac cycle & ECG
              </p>
            </button>

            <button
              onClick={() => setIsComparisonOpen(true)}
              className="p-3 rounded-2xl border border-stone-200 bg-white hover:border-primary-300 hover:bg-primary-50/40 text-left transition-all group shadow-xs hover:shadow-cardHover"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-content-primary group-hover:text-primary-700 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Heart vs Brain</span>
              </div>
              <p className="text-[10px] text-content-tertiary leading-tight">
                Side-by-side comparative matrix
              </p>
            </button>

            <button
              onClick={() => setIsClinicalNotesOpen(true)}
              className="p-3 rounded-2xl border border-stone-200 bg-white hover:border-primary-300 hover:bg-primary-50/40 text-left transition-all group shadow-xs hover:shadow-cardHover"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-content-primary group-hover:text-primary-700 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Clinical Notes</span>
              </div>
              <p className="text-[10px] text-content-tertiary leading-tight">
                Pathologies, ECGs & pearls
              </p>
            </button>
          </div>

          {/* AI Anatomy Copilot Banner Button */}
          <button
            onClick={() => setIsAiAssistantOpen(true)}
            className="w-full p-3 rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-600 to-teal-700 text-white shadow-soft hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center flex-shrink-0 shadow-xs font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">
                  AI Anatomy Copilot
                </h4>
                <p className="text-[10px] text-primary-100">
                  Ask questions with medical citations
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── Bottom Action Controls ──────────────────────────────────── */}
      <div className="p-4 border-t border-stone-200 bg-surface-elevated space-y-2.5">
        {/* Primary Action Button */}
        <button
          onClick={() => setIsLessonOpen(true)}
          className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 active:scale-[0.99] text-white rounded-xl font-semibold text-xs flex items-center justify-between shadow-soft transition-all duration-150 group"
        >
          <span>View full anatomy lesson</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* 3 Action Pill Buttons (Animate, Quiz, Compare) */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={toggleHeartbeat}
            className={`
              flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold border transition-all
              ${
                heartbeatAnimation
                  ? "bg-primary-50 text-primary-700 border-primary-300 font-bold"
                  : "border-stone-200 bg-white hover:bg-stone-50 text-content-primary"
              }
            `}
          >
            <Play className={`w-3.5 h-3.5 ${heartbeatAnimation ? "fill-primary-700" : ""}`} />
            <span>{heartbeatAnimation ? "Beating" : "Animate"}</span>
          </button>

          <button
            onClick={() => setIsQuizOpen(!isQuizOpen)}
            className={`
              flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold border transition-all
              ${
                isQuizOpen
                  ? "bg-primary-50 text-primary-700 border-primary-300 font-bold"
                  : "border-stone-200 bg-white hover:bg-stone-50 text-content-primary"
              }
            `}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quiz</span>
          </button>

          <button
            onClick={() => setIsComparisonOpen(true)}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold text-content-primary hover:bg-stone-50 border border-stone-200 bg-white transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compare</span>
          </button>
        </div>
      </div>

      {/* ── Interactive Quiz Modal / Drawer ─────────────────────────── */}
      {isQuizOpen && (
        <div className="absolute inset-0 z-30 p-5 flex flex-col justify-between animate-fade-up bg-white">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary-600" />
              <h3 className="text-sm font-bold text-content-primary">
                {organ.name} Quiz
              </h3>
            </div>
            <button
              onClick={() => setIsQuizOpen(false)}
              className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-content-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {organ.quizQuestions.length === 0 ? (
              <p className="text-xs text-content-tertiary text-center py-6">
                Quiz questions coming soon for this organ!
              </p>
            ) : (
              organ.quizQuestions.map((q) => <QuizQuestionCard key={q.id} q={q} />)
            )}
          </div>

          <button
            onClick={() => setIsQuizOpen(false)}
            className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-content-primary rounded-xl text-xs font-semibold transition-colors border border-stone-200"
          >
            Close Quiz
          </button>
        </div>
      )}

      {/* ── Interactive Lesson Drawer ───────────────────────────────── */}
      {isLessonOpen && (
        <div className="absolute inset-0 z-30 p-5 flex flex-col justify-between animate-fade-up bg-white">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h3 className="text-sm font-bold text-content-primary">
              {organ.name} Anatomy Lesson
            </h3>
            <button
              onClick={() => setIsLessonOpen(false)}
              className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-content-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs text-content-secondary">
            <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50">
              <h4 className="font-bold text-content-primary mb-1">
                Microscopic & Cellular Architecture
              </h4>
              <p className="leading-relaxed text-content-secondary">{organ.microscopicDescription}</p>
            </div>

            <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50">
              <h4 className="font-bold text-content-primary mb-1">Clinical Pathology</h4>
              <ul className="space-y-1.5 list-disc pl-4 text-content-secondary">
                {organ.clinicalNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => setIsLessonOpen(false)}
            className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-soft"
          >
            Complete Lesson
          </button>
        </div>
      )}
    </aside>
  );
}

// ── Quiz Question Card ───────────────────────────────────────────────────────

function QuizQuestionCard({ q }: { q: ReturnType<typeof getOrganById>["quizQuestions"][0] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const isAnswered = selected !== null;
  const isCorrect = selected === q.correctIndex;

  return (
    <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50 space-y-2.5 shadow-xs">
      <p className="text-xs font-bold text-content-primary">{q.question}</p>

      <div className="space-y-1.5">
        {q.options.map((opt, i) => {
          const isThisSelected = selected === i;
          const isThisCorrect = i === q.correctIndex;

          let btnClass = "border-stone-200 bg-white text-content-primary hover:bg-stone-100/70";

          if (isAnswered) {
            if (isThisCorrect) {
              btnClass = "border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold";
            } else if (isThisSelected && !isCorrect) {
              btnClass = "border-red-300 bg-red-50 text-red-800";
            } else {
              btnClass = "border-stone-200 bg-stone-50 text-content-tertiary opacity-60";
            }
          }

          return (
            <button
              key={i}
              onClick={() => !isAnswered && setSelected(i)}
              disabled={isAnswered}
              className={`w-full text-left flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${btnClass}`}
            >
              <span>{opt}</span>
              {isAnswered && isThisCorrect && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
              {isAnswered && isThisSelected && !isCorrect && (
                <XCircle className="w-3.5 h-3.5 text-red-600" />
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <p
          className={`text-[11px] p-2.5 rounded-xl border ${
            isCorrect
              ? "border-emerald-200 text-emerald-800 bg-emerald-50"
              : "border-red-200 text-red-800 bg-red-50"
          }`}
        >
          {q.explanation}
        </p>
      )}
    </div>
  );
}

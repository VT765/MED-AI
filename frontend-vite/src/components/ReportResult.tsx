import { motion } from "framer-motion";
import {
  CheckCircle2,
  BrainCircuit,
  RefreshCw,
  FileText,
  AlertTriangle,
  Stethoscope,
  BarChart3,
  ClipboardCheck,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReportAnalysisResponse, AbnormalValue } from "@/types/report";
import { cn } from "@/lib/utils";

const EMPTY_LABEL = "No data available";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

// ── Range meter ──────────────────────────────────────────────────────────────
// Parses "36 - 46 %" / "0 - 149.99 mg/dL" style ranges and the observed value,
// and renders a small bullet meter: gray track, green normal band, and a
// status-colored marker dot showing where the patient's value falls.

function parseRange(rangeText: string): { lo: number; hi: number } | null {
  const m = rangeText?.match(/(-?[\d.]+)\s*[-–]\s*(-?[\d.]+)/);
  if (!m) return null;
  const lo = parseFloat(m[1]);
  const hi = parseFloat(m[2]);
  if (!isFinite(lo) || !isFinite(hi) || hi <= lo) return null;
  return { lo, hi };
}

function parseValue(valueText: string): number | null {
  const m = valueText?.match(/-?[\d.]+/);
  if (!m) return null;
  const v = parseFloat(m[0]);
  return isFinite(v) ? v : null;
}

function RangeMeter({ row }: { row: AbnormalValue }) {
  const range = parseRange(row.normal_range);
  const value = parseValue(row.observed_value);
  if (!range || value === null) return null;

  const span = range.hi - range.lo;
  const domainLo = Math.min(range.lo, value) - span * 0.25;
  const domainHi = Math.max(range.hi, value) + span * 0.25;
  const domain = domainHi - domainLo;
  const pct = (v: number) => ((v - domainLo) / domain) * 100;

  const markerColor =
    row.status === "high" ? "bg-red-500" : row.status === "low" ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="relative h-1.5 w-full rounded-full bg-stone-100" aria-hidden>
      {/* Normal band */}
      <div
        className="absolute inset-y-0 rounded-full bg-emerald-200/80"
        style={{ left: `${pct(range.lo)}%`, width: `${pct(range.hi) - pct(range.lo)}%` }}
      />
      {/* Patient's value — 2px white ring separates the marker from the band */}
      <span
        className={cn(
          "absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white shadow-sm",
          markerColor
        )}
        style={{ left: `${Math.min(98, Math.max(2, pct(value)))}%` }}
      />
    </div>
  );
}

// ── Status pill ──────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: AbnormalValue["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        status === "high" && "bg-red-100 text-red-700",
        status === "low" && "bg-amber-100 text-amber-700",
        status === "normal" && "bg-emerald-100 text-emerald-700"
      )}
    >
      {status === "high" ? "▲ High" : status === "low" ? "▼ Low" : "● Normal"}
    </span>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────

function Empty() {
  return (
    <p className="text-xs text-stone-400 italic py-3 px-3 rounded-xl bg-stone-50 border border-dashed border-stone-200">
      {EMPTY_LABEL}
    </p>
  );
}

interface ReportResultProps {
  analysis: ReportAnalysisResponse;
  onRemove: () => void;
}

export function ReportResult({ analysis, onRemove }: ReportResultProps) {
  const hasSummary = !!analysis.summary?.trim();
  const findings = Array.isArray(analysis.key_findings) ? analysis.key_findings : [];
  const abnormal = Array.isArray(analysis.abnormal_values) ? analysis.abnormal_values : [];
  const conditions = Array.isArray(analysis.possible_conditions) ? analysis.possible_conditions : [];
  const recommendations = Array.isArray(analysis.recommendations) ? analysis.recommendations : [];

  const flaggedCount = abnormal.filter((r) => r.status === "high" || r.status === "low").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full rounded-2xl border border-stone-200 bg-white shadow-xl shadow-stone-200/50 overflow-hidden"
    >
      {/* ── Header: identity + verdict + action ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-primary-50/70 via-white to-white border-b border-stone-200">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-teal-600 shadow-soft">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-content-primary leading-tight">AI Analysis Report</h3>
            {flaggedCount > 0 ? (
              <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 mt-0.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                {flaggedCount} value{flaggedCount > 1 ? "s" : ""} outside the normal range
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                All values within normal limits
              </p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="rounded-xl px-4 py-2 font-medium border-stone-200"
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Scan another
        </Button>
      </div>

      <div className="p-4 sm:p-6">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          {/* ── Summary ── */}
          <motion.section variants={item}>
            <div className="rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50/60 to-white p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-1.5">
                <FileText className="h-4 w-4 text-primary-600" />
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary-800/80">Summary</h4>
              </div>
              <p className="text-content-primary text-sm sm:text-[15px] leading-relaxed">
                {hasSummary ? analysis.summary : EMPTY_LABEL}
              </p>
            </div>
          </motion.section>

          {/* ── Abnormal values with range meters ── */}
          <motion.section variants={item}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-red-500 shrink-0" />
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-content-tertiary">
                  Test Results
                </h4>
              </div>
              {abnormal.length > 0 && (
                <div className="hidden sm:flex items-center gap-3 text-[10px] text-content-tertiary">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-4 rounded-full bg-emerald-200" /> normal range
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-500 ring-2 ring-white shadow-sm" /> your value
                  </span>
                </div>
              )}
            </div>
            {abnormal.length > 0 ? (
              <div className="rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
                {abnormal.map((row, i) => (
                  <motion.div
                    key={i}
                    variants={item}
                    className="grid grid-cols-[1fr_auto] sm:grid-cols-[180px_1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-3 bg-white hover:bg-stone-50/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-content-primary truncate">
                        {row.test_name || EMPTY_LABEL}
                      </p>
                      <p className="text-[11px] text-content-tertiary">
                        Normal: {row.normal_range || "—"}
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1 order-3 sm:order-none">
                      <RangeMeter row={row} />
                    </div>
                    <div className="flex items-center gap-2.5 justify-end">
                      <span className="text-sm font-bold text-content-primary tabular-nums">
                        {row.observed_value || "—"}
                      </span>
                      <StatusPill status={row.status} />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Empty />
            )}
          </motion.section>

          {/* ── Findings + Conditions side by side ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.section variants={item} className="min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-content-tertiary">
                  Key Findings
                </h4>
              </div>
              {findings.length > 0 ? (
                <ul className="space-y-2">
                  {findings.map((finding, i) => (
                    <motion.li
                      key={i}
                      variants={item}
                      className="flex items-start gap-2.5 py-2.5 px-3.5 rounded-xl bg-amber-50/60 border border-amber-100 text-content-primary text-sm"
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{finding}</span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <Empty />
              )}
            </motion.section>

            <motion.section variants={item} className="min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="h-4 w-4 text-violet-500 shrink-0" />
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-content-tertiary">
                  Possible Conditions
                </h4>
              </div>
              {conditions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {conditions.map((cond, i) => (
                    <motion.span
                      key={i}
                      variants={item}
                      className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50/70 px-3.5 py-2 text-sm text-violet-900"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                      {cond}
                    </motion.span>
                  ))}
                </div>
              ) : (
                <Empty />
              )}
              <p className="mt-3 text-[11px] leading-relaxed text-content-tertiary">
                These are possibilities suggested by the values above — not a diagnosis.
              </p>
            </motion.section>
          </div>

          {/* ── Recommendations ── */}
          <motion.section variants={item}>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-content-tertiary">
                Recommendations
              </h4>
            </div>
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    variants={item}
                    className="flex items-start gap-2.5 py-3 px-4 rounded-xl bg-emerald-50/60 border border-emerald-100"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-content-primary text-sm leading-snug">{rec}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Empty />
            )}
          </motion.section>

          {/* ── Disclaimer footer ── */}
          <motion.div
            variants={item}
            className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-content-tertiary"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            AI-generated analysis — always confirm results with your doctor.
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

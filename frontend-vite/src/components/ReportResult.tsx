import { motion } from "framer-motion";
import {
  CheckCircle2,
  BrainCircuit,
  RefreshCw,
  HeartPulse,
  FileText,
  AlertTriangle,
  Stethoscope,
  BarChart3,
  ClipboardCheck,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { ReportAnalysisResponse } from "@/types/report";
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

interface ReportResultProps {
  analysis: ReportAnalysisResponse;
  onRemove: () => void;
}

export function ReportResult({ analysis, onRemove }: ReportResultProps) {
  const hasSummary = !!analysis.summary?.trim();
  const hasKeyFindings = Array.isArray(analysis.key_findings) && analysis.key_findings.length > 0;
  const hasAbnormalValues = Array.isArray(analysis.abnormal_values) && analysis.abnormal_values.length > 0;
  const hasConditions = Array.isArray(analysis.possible_conditions) && analysis.possible_conditions.length > 0;
  const hasRecommendations = Array.isArray(analysis.recommendations) && analysis.recommendations.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full rounded-xl border border-stone-200 bg-white shadow-xl shadow-stone-200/50 overflow-hidden"
    >
      {/* Header with actions inline */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 bg-stone-50 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-md">
            <BrainCircuit className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            AI Analysis Report
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </h3>
        </div>
        <div className="flex gap-2">
          <Link
            to="/dashboard/appointment"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary-700 transition-colors"
          >
            <HeartPulse className="h-3.5 w-3.5" />
            Consult doctor
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="rounded-lg px-4 py-2 font-medium border-stone-200"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Scan another
          </Button>
        </div>
      </div>

      {/* Content - rectangular grid layout */}
      <div className="p-4 sm:p-5">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* Summary - full width, compact */}
          <motion.section variants={item} className="lg:col-span-3">
            <div className="rounded-lg border border-stone-200 bg-gradient-to-br from-primary-50/50 to-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary-800/80">Summary</h4>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {hasSummary ? analysis.summary : EMPTY_LABEL}
              </p>
            </div>
          </motion.section>

          {/* Key Findings - column 1 */}
          <motion.section variants={item} className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">Key Findings</h4>
            </div>
            {hasKeyFindings ? (
              <ul className="space-y-1.5">
                {analysis.key_findings.map((finding, i) => (
                  <motion.li
                    key={i}
                    variants={item}
                    className="flex items-start gap-2 py-2 px-3 rounded-lg bg-amber-50/50 border border-amber-100 text-gray-700 text-sm"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{finding}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 italic py-3 px-3 rounded-lg bg-stone-50 border border-dashed border-stone-200">
                {EMPTY_LABEL}
              </p>
            )}
          </motion.section>

          {/* Abnormal Values - column 2, takes more horizontal space */}
          <motion.section variants={item} className="min-w-0 lg:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-red-600 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">Abnormal Values</h4>
            </div>
            {hasAbnormalValues ? (
              <div className="rounded-lg border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto max-h-[200px] overflow-y-auto">
                  <table className="w-full text-sm min-w-[400px]">
                    <thead className="sticky top-0 bg-stone-50 z-10">
                      <tr className="border-b border-stone-200">
                        <th className="text-left py-2.5 px-3 font-semibold text-gray-700">Test</th>
                        <th className="text-left py-2.5 px-3 font-semibold text-gray-700">Value</th>
                        <th className="text-left py-2.5 px-3 font-semibold text-gray-700">Normal Range</th>
                        <th className="text-left py-2.5 px-3 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.abnormal_values.map((row, i) => {
                        const isAbnormal = row.status === "high" || row.status === "low";
                        return (
                          <motion.tr
                            key={i}
                            variants={item}
                            className={cn(
                              "border-b border-stone-100 last:border-0",
                              isAbnormal ? "bg-red-50/50" : "bg-white"
                            )}
                          >
                            <td className="py-2 px-3 font-medium text-gray-800 text-xs">{row.test_name || EMPTY_LABEL}</td>
                            <td
                              className={cn(
                                "py-2 px-3 font-semibold text-xs",
                                isAbnormal ? "text-red-600" : "text-gray-800"
                              )}
                            >
                              {row.observed_value || EMPTY_LABEL}
                            </td>
                            <td className="py-2 px-3 text-gray-600 text-xs">{row.normal_range || EMPTY_LABEL}</td>
                            <td className="py-2 px-3">
                              <span
                                className={cn(
                                  "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                  row.status === "high" && "bg-red-100 text-red-800",
                                  row.status === "low" && "bg-amber-100 text-amber-800",
                                  row.status === "normal" && "bg-emerald-100 text-emerald-800"
                                )}
                              >
                                {row.status}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic py-3 px-3 rounded-lg bg-stone-50 border border-dashed border-stone-200">
                {EMPTY_LABEL}
              </p>
            )}
          </motion.section>

          {/* Possible Conditions - column 3 */}
          <motion.section variants={item} className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="h-4 w-4 text-violet-600 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">Possible Conditions</h4>
            </div>
            {hasConditions ? (
              <ul className="space-y-1.5">
                {analysis.possible_conditions.map((cond, i) => (
                  <motion.li
                    key={i}
                    variants={item}
                    className="flex items-start gap-2 py-2 px-3 rounded-lg bg-violet-50/50 border border-violet-100 text-gray-700 text-sm"
                  >
                    <span className="text-violet-500 font-bold text-xs mt-0.5">•</span>
                    <span className="leading-snug">{cond}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 italic py-3 px-3 rounded-lg bg-stone-50 border border-dashed border-stone-200">
                {EMPTY_LABEL}
              </p>
            )}
          </motion.section>

          {/* Recommendations - full width, compact row */}
          <motion.section variants={item} className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">Recommendations</h4>
            </div>
            {hasRecommendations ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {analysis.recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    variants={item}
                    className="flex items-start gap-2 py-2.5 px-4 rounded-lg bg-emerald-50/60 border border-emerald-100"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200/80 text-emerald-800 text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 text-sm leading-snug">{rec}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic py-3 px-3 rounded-lg bg-stone-50 border border-dashed border-stone-200">
                {EMPTY_LABEL}
              </p>
            )}
          </motion.section>
        </motion.div>
      </div>
    </motion.div>
  );
}

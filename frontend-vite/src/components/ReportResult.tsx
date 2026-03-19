import { motion } from "framer-motion";
import { CheckCircle2, BrainCircuit, RefreshCw, HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { ReportAnalysisResponse } from "@/types/report";

const EMPTY_LABEL = "Not Available";

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto w-full space-y-6"
    >
      <div className="flex justify-start w-full">
        <div className="flex items-start gap-4 max-w-[90%] sm:max-w-[85%]">
          <div className="h-9 w-9 mt-1 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md shrink-0 border-2 border-white ring-1 ring-primary-100">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>
          <div className="bg-white rounded-3xl rounded-tl-sm border border-gray-100 p-6 shadow-card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-gray-50 pb-4">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
                Analysis Complete
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </h3>
            </div>

            <div className="space-y-6">
              {/* Summary Card */}
              <Card className="border-primary-100 bg-primary-50/30">
                <CardContent className="pt-4 pb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary-700/70 mb-2">Summary</h4>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {hasSummary ? analysis.summary : EMPTY_LABEL}
                  </p>
                </CardContent>
              </Card>

              {/* Key Findings - Bullet list */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Key Findings</h4>
                {hasKeyFindings ? (
                  <ul className="space-y-2 list-disc list-inside text-sm text-gray-700">
                    {analysis.key_findings.map((item, i) => (
                      <li key={i} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">{EMPTY_LABEL}</p>
                )}
              </div>

              {/* Abnormal Values - Table with highlight */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Abnormal Values</h4>
                {hasAbnormalValues ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Test</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Value</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Normal Range</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.abnormal_values.map((row, i) => (
                          <tr
                            key={i}
                            className={`border-b border-gray-100 last:border-0 ${
                              row.status === "high" || row.status === "low"
                                ? "bg-red-50/50"
                                : "bg-white"
                            }`}
                          >
                            <td className="py-3 px-4 text-gray-800">{row.test_name || EMPTY_LABEL}</td>
                            <td
                              className={`py-3 px-4 font-medium ${
                                row.status === "high" || row.status === "low"
                                  ? "text-red-600"
                                  : "text-gray-800"
                              }`}
                            >
                              {row.observed_value || EMPTY_LABEL}
                            </td>
                            <td className="py-3 px-4 text-gray-600">{row.normal_range || EMPTY_LABEL}</td>
                            <td>
                              <span
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                                  row.status === "high"
                                    ? "bg-red-100 text-red-800 border-red-200"
                                    : row.status === "low"
                                    ? "bg-amber-100 text-amber-800 border-amber-200"
                                    : "bg-gray-100 text-gray-700 border-gray-200"
                                }`}
                              >
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">{EMPTY_LABEL}</p>
                )}
              </div>

              {/* Possible Conditions - List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Possible Conditions</h4>
                {hasConditions ? (
                  <ul className="space-y-2 text-sm text-gray-700">
                    {analysis.possible_conditions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary-500 mt-0.5">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">{EMPTY_LABEL}</p>
                )}
              </div>

              {/* Recommendations - Checklist */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Recommendations</h4>
                {hasRecommendations ? (
                  <ul className="space-y-3">
                    {analysis.recommendations.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-700 items-start p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <Checkbox id={`rec-${i}`} className="mt-0.5 shrink-0" disabled />
                        <label htmlFor={`rec-${i}`} className="leading-relaxed pt-0.5 cursor-default">
                          {item}
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">{EMPTY_LABEL}</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-5 border-t border-gray-100 flex flex-wrap gap-2 sm:gap-3">
              <Link
                to="/dashboard/appointment"
                className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-all hover:bg-primary-700 hover:shadow-cardHover hover:-translate-y-0.5 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <HeartPulse className="w-4 h-4" />
                Consult Doctor
              </Link>
              <Button
                variant="outline"
                onClick={onRemove}
                className="rounded-full px-5 py-2.5 bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 shadow-sm font-medium"
              >
                <RefreshCw className="mr-2 h-4 w-4 text-gray-400" />
                Scan Another Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

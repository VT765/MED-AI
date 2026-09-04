import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  X,
  CheckCircle2,
  ShieldAlert,
  BrainCircuit,
  Microscope,
  RefreshCw,
  Activity,
  ArrowRight,
  ImagePlus,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportResult } from "@/components/ReportResult";
import type { ReportAnalysisResponse } from "@/types/report";
import { apiUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

const ACCEPT = "application/pdf,image/jpeg,image/png,image/jpg";
const FORMATS = "PDF, JPG, PNG";

const SCANNING_STEPS = [
  { text: "Extracting text from your document...", icon: FileCode },
  { text: "Identifying key health metrics...", icon: Microscope },
  { text: "Analyzing findings & patterns...", icon: BrainCircuit },
  { text: "Generating structured summary...", icon: Activity },
  { text: "Finalizing recommendations...", icon: CheckCircle2 },
];

export function UploadCard() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ReportAnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultTopRef = useRef<HTMLDivElement>(null);

  // Scroll result into comfortable view when analysis loads
  useLayoutEffect(() => {
    if (analysis && resultTopRef.current) {
      resultTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [analysis]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setScanStep((prev) => (prev < SCANNING_STEPS.length - 1 ? prev + 1 : prev));
      }, 1400);
    } else {
      setScanStep(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleFile = useCallback((selected: File) => {
    setFile(selected);
    setAnalysis(null);
    setAnalysisError(null);
    if (selected.type.startsWith("image/")) setPreview(URL.createObjectURL(selected));
    else setPreview(null);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && (ACCEPT.includes(f.type) || /\.(pdf|jpg|jpeg|png)$/i.test(f.name))) handleFile(f);
  };

  const handleRemove = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setAnalysis(null);
    setAnalysisError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Keep the scan animation on screen for at least this long, even if the
  // backend responds faster — otherwise the animation flashes and vanishes.
  const MIN_SCAN_MS = 5000;

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    const scanStartedAt = Date.now();
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(apiUrl("api/reports/analyze"), {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      const errMsg = Array.isArray(data.detail) ? data.detail[0]?.msg : data.detail || data.message || "Analysis failed";
      if (!res.ok) throw new Error(typeof errMsg === "string" ? errMsg : "Analysis failed");
      setAnalysis(data as ReportAnalysisResponse);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      const elapsed = Date.now() - scanStartedAt;
      if (elapsed < MIN_SCAN_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_SCAN_MS - elapsed));
      }
      setIsAnalyzing(false);
    }
  };

  // ——— Analyzing state — live document scan ———
  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mx-auto"
      >
        <div className="relative overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-xl shadow-stone-200/50">
          {/* Progress bar */}
          <div className="h-1 bg-stone-100">
            <motion.div
              className="h-full bg-primary-600 rounded-r-full"
              initial={{ width: "0%" }}
              animate={{ width: "92%" }}
              transition={{ duration: 8, ease: "easeOut" }}
            />
          </div>

          <div className="grid sm:grid-cols-[260px_1fr] gap-8 items-center px-6 sm:px-10 py-10 sm:py-12">
            {/* ── Document under the scanner ── */}
            <div className="relative mx-auto w-[200px] sm:w-[220px]">
              {/* Viewfinder corner brackets */}
              <div className="absolute -inset-3 pointer-events-none z-20">
                <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-primary-500 rounded-tl" />
                <span className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-primary-500 rounded-tr" />
                <span className="absolute left-0 bottom-0 h-5 w-5 border-l-2 border-b-2 border-primary-500 rounded-bl" />
                <span className="absolute right-0 bottom-0 h-5 w-5 border-r-2 border-b-2 border-primary-500 rounded-br" />
              </div>

              <div className="relative overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg aspect-[3/4]">
                {preview ? (
                  <img src={preview} alt="Document being scanned" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  /* Stylized PDF page */
                  <div className="absolute inset-0 p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-red-600">PDF</span>
                      <FileText className="h-3.5 w-3.5 text-stone-300" />
                    </div>
                    <div className="h-2.5 w-3/4 rounded bg-stone-200 mb-3" />
                    <div className="space-y-1.5">
                      {[100, 92, 96, 60, 0, 88, 95, 72, 0, 90, 65].map((w, i) =>
                        w === 0 ? (
                          <div key={i} className="h-2" />
                        ) : (
                          <div key={i} className="h-1.5 rounded bg-stone-100" style={{ width: `${w}%` }} />
                        )
                      )}
                    </div>
                    <div className="mt-auto grid grid-cols-3 gap-1.5">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-3 rounded bg-primary-50 border border-primary-100/60" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Scan beam sweeping the page */}
                <motion.div
                  className="absolute left-0 right-0 z-10 pointer-events-none"
                  animate={{ top: ["-18%", "96%", "-18%"] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="h-10 w-full bg-gradient-to-t from-primary-400/30 to-transparent" />
                  <div className="h-[3px] w-full bg-primary-500 shadow-[0_0_16px_3px_rgba(13,148,136,0.55)]" />
                  <div className="h-10 w-full bg-gradient-to-b from-primary-400/30 to-transparent" />
                </motion.div>

                {/* Subtle flicker tint over the whole page */}
                <motion.div
                  className="absolute inset-0 z-[5] bg-primary-500/5 pointer-events-none"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Filename under the page */}
              {file && (
                <p className="mt-3 text-center text-[11px] font-medium text-content-tertiary truncate" title={file.name}>
                  {file.name}
                </p>
              )}
            </div>

            {/* ── Status column ── */}
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-200 px-3 py-1 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary-700">Scanning document</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5">
                Analyzing your report
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Our AI is reading and structuring your medical data
              </p>

              {/* Step checklist */}
              <ul className="space-y-2.5 text-left">
                {SCANNING_STEPS.map((step, i) => {
                  const StepIcon = step.icon;
                  const isDone = i < scanStep;
                  const isCurrent = i === scanStep;
                  return (
                    <li
                      key={i}
                      className={cn(
                        "flex items-center gap-2.5 text-sm transition-all duration-300",
                        isDone ? "text-primary-700" : isCurrent ? "text-gray-900 font-semibold" : "text-stone-400"
                      )}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-600" />
                      ) : isCurrent ? (
                        <motion.span
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="flex shrink-0"
                        >
                          <StepIcon className="h-4 w-4 text-primary-600" />
                        </motion.span>
                      ) : (
                        <StepIcon className="h-4 w-4 shrink-0" />
                      )}
                      <span>{step.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ——— Result / Error state ———
  if (file && (analysis || analysisError)) {
    return (
      <motion.div
        ref={resultTopRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full scroll-mt-4"
      >
        {analysisError ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="rounded-2xl border-2 border-red-200 bg-red-50/80 p-6 sm:p-8 shadow-lg shadow-red-100/50">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100">
                  <ShieldAlert className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-red-900">Analysis failed</h4>
                  <p className="mt-2 text-sm text-red-700">{analysisError}</p>
                  <Button
                    variant="outline"
                    onClick={handleRemove}
                    className="mt-4 border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try again
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          analysis && <ReportResult analysis={analysis} onRemove={handleRemove} />
        )}
      </motion.div>
    );
  }

  // ——— File selected, ready to analyze ———
  if (file && !analysis && !analysisError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="rounded-2xl border border-stone-200 bg-white shadow-xl shadow-stone-200/50 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl object-cover border border-stone-200 shrink-0"
                />
              ) : (
                <div className="flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-xl bg-primary-50 border border-primary-100">
                  <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-primary-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900 truncate" title={file.name}>
                      {file.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {(file.size / 1024).toFixed(1)} KB • {file.type.split("/")[1]?.toUpperCase() || "File"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemove}
                    className="shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <p className="mt-3 text-sm font-medium text-primary-600 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Ready to analyze
                </p>
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              className="w-full mt-6 h-14 text-base font-semibold rounded-xl bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Start AI Analysis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              Analysis is secure and private
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // ——— Default upload zone ———
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload medical report"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          "group relative w-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 py-16 sm:py-20 px-8 overflow-hidden",
          isDragging
            ? "border-primary-500 bg-primary-50/60 scale-[1.02] shadow-lg shadow-primary-200/50"
            : "border-stone-300 bg-white hover:border-primary-400 hover:bg-stone-50/80 shadow-sm hover:shadow-md"
        )}
      >
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-primary-500/5"
          />
        )}
        <div
          className={cn(
            "relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl mb-6 transition-all duration-300",
            isDragging ? "bg-primary-600 text-white scale-110 shadow-lg" : "bg-primary-50 text-primary-600 group-hover:bg-primary-100 group-hover:scale-105"
          )}
        >
          <ImagePlus className="h-10 w-10 sm:h-12 sm:w-12" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Upload your medical report
        </h3>
        <p className="text-sm sm:text-base text-gray-500 text-center max-w-sm mb-6">
          Drag & drop a file here, or click to browse. We accept PDF and image files.
        </p>
        <div className="flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-gray-600">
          <FileText className="h-4 w-4" />
          {FORMATS}
        </div>
      </button>
    </motion.div>
  );
}

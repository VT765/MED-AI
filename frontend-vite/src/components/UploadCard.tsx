import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  ShieldAlert,
  HeartPulse,
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
      }, 800);
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

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
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
      setIsAnalyzing(false);
    }
  };

  // ——— Analyzing state ———
  if (isAnalyzing) {
    const CurrentIcon = SCANNING_STEPS[scanStep].icon;
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="relative overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-xl shadow-stone-200/50">
          {/* Progress bar */}
          <div className="h-1.5 bg-stone-100">
            <motion.div
              className="h-full bg-primary-600 rounded-r-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "easeInOut" }}
            />
          </div>

          <div className="px-6 sm:px-10 py-12 sm:py-16">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary-400/20 rounded-full blur-2xl scale-150" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 border border-primary-400/30">
                  <HeartPulse className="h-10 w-10 text-white" />
                </div>
              </motion.div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
              Analyzing your report
            </h3>
            <p className="text-sm text-gray-500 text-center mb-8">
              Our AI is reading and structuring your medical data
            </p>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-3 py-4 px-5 rounded-xl bg-stone-50 border border-stone-100">
              <CurrentIcon className="h-5 w-5 text-primary-600 shrink-0" />
              <span className="text-sm font-medium text-gray-700">
                {SCANNING_STEPS[scanStep].text}
              </span>
            </div>

            <div className="mt-6 flex justify-center gap-1.5">
              {SCANNING_STEPS.map((_, i) => (
                <motion.div
                  key={i}
                  layout
                  className={cn(
                    "h-1.5 rounded-full transition-colors duration-300",
                    scanStep >= i ? "w-8 bg-primary-500" : "w-1.5 bg-stone-200"
                  )}
                />
              ))}
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

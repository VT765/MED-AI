"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MOCK_REPORT_ANALYSIS } from "@/lib/mockData";
import Link from "next/link";

const ACCEPT = "application/pdf,image/jpeg,image/png,image/jpg";
const FORMATS = "PDF, JPG, PNG";

export function UploadCard() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<typeof MOCK_REPORT_ANALYSIS | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selected: File) => {
    setFile(selected);
    setAnalysis(null);
    if (selected.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && (ACCEPT.includes(f.type) || f.name.match(/\.(pdf|jpg|jpeg|png)$/i)))
      handleFile(f);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemove = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysis(MOCK_REPORT_ANALYSIS);
      setIsAnalyzing(false);
    }, 2000);
  };

  const severityLabels: Record<string, string> = {
    normal: "Normal",
    mild: "Mild",
    moderate: "Moderate",
    high: "High",
  };
  const severityColors: Record<string, string> = {
    normal: "bg-green-100 text-green-800",
    mild: "bg-amber-100 text-amber-800",
    moderate: "bg-orange-100 text-orange-800",
    high: "bg-red-100 text-red-800",
  };

  if (file && analysis) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid gap-6 lg:grid-cols-2"
      >
        {/* Left: document preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold">Document Preview</h3>
            <Button variant="ghost" size="icon" onClick={handleRemove} aria-label="Remove file">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent>
            {preview ? (
              <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-80 w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-12">
                <FileText className="h-12 w-12 text-primary-600" aria-hidden />
                <p className="mt-2 font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: AI analysis card – Summary, key metrics, severity badge, CTA */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">AI Analysis</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-700">{analysis.summary}</p>
            {analysis.keyMetrics && analysis.keyMetrics.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-900">
                  Key metrics
                </h4>
                <ul className="space-y-2">
                  {analysis.keyMetrics.map((m, i) => (
                    <li
                      key={i}
                      className={`flex justify-between rounded-lg px-3 py-2 text-sm ${
                        m.status === "elevated"
                          ? "bg-amber-50 text-amber-900"
                          : m.status === "low"
                            ? "bg-blue-50 text-blue-900"
                            : "bg-gray-50 text-gray-900"
                      }`}
                    >
                      <span>{m.label}</span>
                      <span className="font-medium">{m.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.severity && (
              <div>
                <span className="text-sm font-medium text-gray-700">Severity: </span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    severityColors[analysis.severity] ?? "bg-gray-100 text-gray-800"
                  }`}
                >
                  {severityLabels[analysis.severity] ?? analysis.severity}
                </span>
              </div>
            )}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-900">
                Suggested next steps
              </h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                {analysis.suggestedSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
            <Link
              href="/dashboard/appointment"
              className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Consult Doctor
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (file && !analysis) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleRemove} aria-label="Remove file">
                <X className="h-5 w-5" />
              </Button>
            </div>
            {preview && (
              <div className="mt-4 rounded-lg border border-gray-200 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 w-full object-contain bg-gray-50"
                />
              </div>
            )}
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="mt-4 w-full rounded-xl"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Report"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT}
          onChange={handleFileChange}
          className="hidden"
          aria-label="Choose file"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 transition-colors ${
            isDragging
              ? "border-primary-500 bg-primary-50"
              : "border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50/50"
          }`}
        >
          <Upload className="h-12 w-12 text-primary-600" aria-hidden />
          <p className="mt-4 text-base font-medium text-gray-700">
            Drag & drop medical reports or upload files
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Supported formats: {FORMATS}
          </p>
        </button>
      </CardContent>
    </Card>
  );
}

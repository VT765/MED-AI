import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, FileText, X, CheckCircle2, ShieldAlert, HeartPulse, 
  BrainCircuit, Microscope, RefreshCw, Activity, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MOCK_REPORT_ANALYSIS } from "@/lib/mockData";

const ACCEPT = "application/pdf,image/jpeg,image/png,image/jpg";
const FORMATS = "PDF, JPG, PNG";

const SCANNING_STEPS = [
  { text: "Initializing diagnostic scanners...", icon: BrainCircuit },
  { text: "Extracting vital health data...", icon: FileText },
  { text: "Cross-referencing medical databases...", icon: Microscope },
  { text: "Synthesizing diagnostic summary...", icon: Activity },
  { text: "Finalizing health report...", icon: CheckCircle2 }
];

export function UploadCard() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<typeof MOCK_REPORT_ANALYSIS | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setScanStep((prev) => (prev < SCANNING_STEPS.length - 1 ? prev + 1 : prev));
      }, 1000);
    } else {
      setScanStep(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleFile = useCallback((selected: File) => {
    setFile(selected);
    setAnalysis(null);
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysis(MOCK_REPORT_ANALYSIS);
      setIsAnalyzing(false);
    }, 5500); // Wait enough time for the full animation
  };

  const severityLabels: Record<string, string> = { normal: "Normal Result", mild: "Mild Concern", moderate: "Moderate Risk", high: "High Priority" };
  const severityColors: Record<string, string> = { normal: "bg-emerald-100 text-emerald-800 border-emerald-200", mild: "bg-amber-100 text-amber-800 border-amber-200", moderate: "bg-orange-100 text-orange-800 border-orange-200", high: "bg-red-100 text-red-800 border-red-200" };
  const SeverityIcon = analysis?.severity === "normal" ? CheckCircle2 : ShieldAlert;

  // Render the animated Analyzing state
  if (isAnalyzing) {
    const CurrentIcon = SCANNING_STEPS[scanStep].icon;
    
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto w-full">
        <Card className="overflow-hidden border-primary-200 shadow-card relative bg-white">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary-100">
            <motion.div 
              className="h-full bg-primary-600 rounded-r-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5.5, ease: "linear" }}
            />
          </div>
          <CardContent className="pt-16 pb-14 flex flex-col items-center justify-center text-center">
            
            {/* Pulsating Heart/ Medical Icon */}
            <div className="relative mb-8">
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }} 
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-primary-200 rounded-full blur-xl"
              />
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 border border-dashed border-primary-300 rounded-full opacity-50"
              />
              <div className="relative bg-white p-5 rounded-3xl shadow-soft border border-primary-100 flex items-center justify-center">
                <HeartPulse className="h-10 w-10 text-primary-600 drop-shadow-sm" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">AI Medical Analysis in progress</h3>
            
            {/* Dynamic Scanning Text */}
            <div className="h-8 mb-4 overflow-hidden flex items-center justify-center w-full">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={scanStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full"
                >
                  <CurrentIcon className="w-4 h-4" />
                  {SCANNING_STEPS[scanStep].text}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Step Indicators */}
            <div className="mt-6 flex items-center justify-center gap-2 w-full max-w-xs">
               {SCANNING_STEPS.map((_, i) => (
                 <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${scanStep >= i ? 'bg-primary-500 shadow-sm shadow-primary-500/30' : 'bg-gray-100'}`} />
               ))}
            </div>

          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Render Result generated state
  if (file && analysis) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto w-full space-y-6">
        
        {/* User Message showing the uploaded document */}
        <div className="flex justify-end w-full">
          <div className="flex items-end gap-3 max-w-[80%]">
             <div className="bg-primary-50 rounded-2xl rounded-tr-sm border border-primary-100 p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-primary-100/60 pb-3 mb-3">
                   <span className="text-sm font-medium text-primary-800">Uploaded Document</span>
                   <Button variant="ghost" size="icon" onClick={handleRemove} className="text-gray-400 hover:text-red-600 hover:bg-white/50 -mr-2 h-7 w-7 rounded-full">
                     <X className="h-4 w-4" />
                   </Button>
                </div>
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-48 w-auto rounded-lg border border-primary-200 shadow-sm" />
                ) : (
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-primary-100">
                    <FileText className="h-8 w-8 text-primary-400" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm max-w-[200px] truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1]?.toUpperCase() || 'DOCUMENT'}</p>
                    </div>
                  </div>
                )}
             </div>
             <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center shadow-sm shrink-0 border border-white">
                <span className="text-xs font-bold text-white">ME</span>
             </div>
          </div>
        </div>

        {/* AI Response Message */}
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
                  {analysis.severity && (
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${severityColors[analysis.severity] || "bg-gray-100 text-gray-800"}`}>
                      <SeverityIcon className="w-3 h-3" />
                      {severityLabels[analysis.severity]}
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Summary Chat Bubble */}
                  <div className="prose prose-sm prose-primary">
                    <p className="text-gray-700 leading-relaxed font-medium">{analysis.summary}</p>
                  </div>

                  {/* Extracted Metrics */}
                  {analysis.keyMetrics && analysis.keyMetrics.length > 0 && (
                    <div className="bg-primary-50/50 rounded-2xl p-4 border border-primary-50">
                      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-primary-700/70">Key Metrics Detected</h4>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {analysis.keyMetrics.map((m, i) => (
                          <div key={i} className={`flex flex-col justify-between rounded-xl p-3 bg-white border shadow-xs ${m.status === "elevated" ? "border-amber-200" : m.status === "low" ? "border-blue-200" : "border-gray-100"}`}>
                            <span className="text-xs font-medium text-gray-500 mb-1">{m.label}</span>
                            <span className={`text-base font-bold ${m.status === "elevated" ? "text-amber-600" : m.status === "low" ? "text-blue-600" : "text-gray-900"}`}>
                              {m.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Action Plan */}
                  <div>
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Recommended Next Steps</h4>
                    <ul className="space-y-3">
                      {analysis.suggestedSteps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-700 items-start p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 ring-2 ring-white shadow-xs">
                              {i + 1}
                          </span>
                          <span className="leading-relaxed pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Quick Actions (Chat buttons) */}
                <div className="mt-8 pt-5 border-t border-gray-100 flex flex-wrap gap-2 sm:gap-3">
                   <Link to="/dashboard/appointment" className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-all hover:bg-primary-700 hover:shadow-cardHover hover:-translate-y-0.5 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                      <HeartPulse className="w-4 h-4" />
                      Consult Doctor
                   </Link>
                   <Button variant="outline" onClick={handleRemove} className="rounded-full px-5 py-2.5 bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 shadow-sm font-medium">
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

  // Render Pre-upload / Ready to analyze state
  if (file && !analysis) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto w-full">
        <Card className="shadow-soft border-gray-200 overflow-hidden bg-white hover:shadow-cardHover transition-shadow duration-300">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center py-10 px-6 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
              <div className="relative mb-5">
                 <div className="bg-primary-100 p-4 rounded-2xl text-primary-600 shadow-inner">
                   <FileText className="h-10 w-10" />
                 </div>
                 <button onClick={handleRemove} className="absolute -top-3 -right-3 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full h-8 w-8 flex items-center justify-center border shadow-sm transition-colors">
                   <X className="h-4 w-4" />
                 </button>
              </div>
              
              <h4 className="font-bold text-gray-900 text-lg text-center truncate w-full max-w-sm" title={file.name}>
                {file.name}
              </h4>
              <p className="text-sm font-medium text-gray-500 mt-1.5 flex items-center gap-2">
                 {(file.size / 1024).toFixed(1)} KB <span className="w-1 h-1 bg-gray-300 rounded-full"/> Ready to scan
              </p>
            </div>
            
            {preview && (
              <div className="bg-gray-50 border-b border-gray-100 overflow-hidden flex justify-center p-4">
                <img src={preview} alt="Preview" className="max-h-56 w-auto object-contain rounded-lg shadow-sm border border-gray-200" />
              </div>
            )}
            
            <div className="p-6 bg-white">
              <Button 
                onClick={handleAnalyze} 
                className="w-full rounded-xl h-14 text-base font-bold shadow-card hover:shadow-cardHover bg-primary-600 hover:bg-primary-700 transition-all hover:-translate-y-0.5 group"
              >
                Start AI Analysis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-xs text-center text-gray-400 mt-4 font-medium flex items-center justify-center gap-1.5">
                 <ShieldAlert className="w-3.5 h-3.5" /> All analysis is secure and private
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Default Upload area
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto w-full">
      <Card className="shadow-none border border-transparent bg-transparent">
        <CardContent className="p-0">
          <input ref={fileInputRef} type="file" accept={ACCEPT} onChange={handleFileChange} className="hidden" aria-label="Choose file" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            className={`group flex w-full flex-col items-center justify-center rounded-3xl border-2 py-20 px-6 transition-all duration-300 outline-none
              ${isDragging ? "bg-primary-50/50 border-primary-500 border-solid scale-[1.02] shadow-soft" : "bg-white border-dashed border-gray-300 hover:border-primary-400 hover:bg-gray-50/80 shadow-sm hover:shadow-soft"}`}
          >
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl mb-8 transition-all duration-300 shadow-sm
              ${isDragging ? "bg-primary-600 text-white scale-110 shadow-primary-500/25" : "bg-primary-50 text-primary-600 group-hover:scale-105 group-hover:bg-primary-100"}`}>
               <Upload className="h-10 w-10" aria-hidden />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 text-center tracking-tight">
              Upload Medical Report
            </h3>
            <p className="mt-3 text-base text-gray-500 text-center max-w-sm leading-relaxed">
              Drag & drop your PDF or image file here, or click to browse from your device.
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-2.5 rounded-full border border-gray-200 bg-white shadow-sm px-5 py-2 group-hover:border-gray-300 transition-colors">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-600">Supported formats: {FORMATS}</span>
            </div>
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCard } from "@/components/UploadCard";
import { ReportResult } from "@/components/ReportResult";
import { Plus, Search, FileText, History, X, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getReportHistory, getReportById, type ReportSummary } from "@/lib/api";
import type { ReportAnalysisResponse } from "@/types/report";

function groupReportsByDate(reports: ReportSummary[]): Record<string, ReportSummary[]> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const last7 = new Date(today.getTime() - 7 * 86400000);

  const groups: Record<string, ReportSummary[]> = {};

  for (const report of reports) {
    const d = new Date(report.created_at);
    let group: string;
    if (d >= today) group = "Today";
    else if (d >= yesterday) group = "Yesterday";
    else if (d >= last7) group = "Last 7 Days";
    else group = "Older";

    if (!groups[group]) groups[group] = [];
    groups[group].push(report);
  }

  return groups;
}

export function ReportsPage() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ReportAnalysisResponse | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReportHistory();
      setReports(data.reports);
    } catch {
      // silently fail — empty state will show
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (historyOpen) fetchReports();
  }, [historyOpen, fetchReports]);

  const handleSelectReport = async (reportId: string) => {
    setSelectedReportId(reportId);
    setHistoryOpen(false);
    setLoadingReport(true);
    try {
      const data = await getReportById(reportId);
      setSelectedAnalysis(data.analysis as ReportAnalysisResponse);
    } catch {
      setSelectedAnalysis(null);
      setSelectedReportId(null);
    } finally {
      setLoadingReport(false);
    }
  };

  const filteredReports = reports.filter((r) =>
    r.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const groupedReports = groupReportsByDate(filteredReports);

  const GROUP_ORDER = ["Today", "Yesterday", "Last 7 Days", "Older"];
  const orderedGroups = GROUP_ORDER.filter((g) => groupedReports[g]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case "Processing": return <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />;
      case "Failed": return <XCircle className="h-3 w-3 text-red-500" />;
      default: return null;
    }
  };

  const HistoryPanel = (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      className="absolute inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-surface/90 backdrop-blur-xl shadow-2xl border-l border-stone-200 flex flex-col"
    >
      <div className="p-4 flex items-center justify-between border-b border-stone-200">
        <h3 className="font-semibold text-content-primary">Report History</h3>
        <Button variant="ghost" size="icon" onClick={() => setHistoryOpen(false)}>
          <X className="h-5 w-5 text-content-secondary" />
        </Button>
      </div>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-tertiary" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-surface-elevated rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-content-tertiary" />
          </div>
        ) : orderedGroups.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-8 w-8 mx-auto text-content-tertiary mb-2" />
            <p className="text-sm text-content-tertiary">No reports yet</p>
          </div>
        ) : (
          orderedGroups.map((group) => (
            <div key={group}>
              <h4 className="px-1 mb-2 text-[10px] font-bold uppercase tracking-wider text-content-tertiary">
                {group}
              </h4>
              <div className="space-y-1">
                {groupedReports[group].map((report) => {
                  const isActive = selectedReportId === report.report_id;
                  return (
                    <button
                      key={report.report_id}
                      onClick={() => {
                        if (report.status === "Completed") {
                          handleSelectReport(report.report_id);
                        }
                      }}
                      className={cn(
                        "w-full flex items-start gap-3 px-3 py-2 rounded-xl text-sm text-left transition-colors",
                        isActive
                          ? "bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-200"
                          : "text-content-secondary hover:bg-surface-muted hover:text-content-primary"
                      )}
                    >
                      <FileText className={cn("h-4 w-4 shrink-0 mt-0.5", isActive ? "text-primary-600" : "text-content-tertiary")} />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="truncate font-medium">{report.filename}</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-content-tertiary">
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(report.status)}
                            <span className="text-[10px] text-content-tertiary">{report.status}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-surface">
      {/* Top Header */}
      <header className="shrink-0 h-14 border-b border-stone-200 bg-surface/80 backdrop-blur-md px-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-content-primary hidden sm:block">Medical Reports</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex gap-2 rounded-xl"
            onClick={() => { setSelectedReportId(null); setSelectedAnalysis(null); }}
          >
            <Plus className="h-4 w-4" />
            <span>Upload Report</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="sm:hidden rounded-xl"
            onClick={() => { setSelectedReportId(null); setSelectedAnalysis(null); }}
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          <Button variant="secondary" size="sm" onClick={() => setHistoryOpen(true)} className="gap-2 rounded-xl">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </Button>
        </div>
      </header>

      {/* History Overlay */}
      <AnimatePresence>
        {historyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHistoryOpen(false)}
              className="absolute inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />
            {HistoryPanel}
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="w-full max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8 pb-28 lg:pb-12 h-full flex flex-col">
          {loadingReport ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : selectedAnalysis ? (
            <ReportResult analysis={selectedAnalysis} onRemove={() => { setSelectedReportId(null); setSelectedAnalysis(null); }} />
          ) : (
            <UploadCard />
          )}
        </div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { UploadCard } from "@/components/UploadCard";

export function ReportsPage() {
  return (
    <div className="flex flex-1 flex-col min-h-0 w-full h-full overflow-hidden">
      {/* Hero / Header */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="shrink-0 px-4 py-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-stone-50/80 border-b border-stone-100"
      >
        <div className="w-full max-w-[1600px]">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Medical Report Analysis
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-gray-600 max-w-2xl">
            Upload your lab reports, imaging scans, or discharge summaries. Get a clear, structured AI analysis with key findings and recommendations.
          </p>
        </div>
      </motion.header>

      {/* Scrollable content area */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="w-full px-4 py-4 sm:px-6 lg:px-8 pb-28 lg:pb-12">
          <UploadCard />
        </div>
      </div>
    </div>
  );
}

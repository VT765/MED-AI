"use client";

import { motion } from "framer-motion";
import { UploadCard } from "@/components/UploadCard";

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-gray-900">
          Scan & Understand Medical Reports
        </h2>
        <p className="mt-1 text-gray-600">
          Upload a report (camera or file) to get a mock AI analysis with
          summary, observations, and suggested next steps.
        </p>
      </motion.div>
      <UploadCard />
    </div>
  );
}

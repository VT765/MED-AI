"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function HealthPlanPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Personalized Health Plan
          </h2>
          <Badge variant="comingSoon">Coming Soon</Badge>
        </div>
        <p className="mt-1 text-gray-600">
          AI-powered fitness and diet plans tailored to you. We&apos;re building
          this feature.
        </p>
      </motion.div>

      <Card className="border-amber-200 bg-amber-50/30">
        <CardHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <Activity className="h-6 w-6" aria-hidden />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Coming Soon</h3>
          <p className="text-sm text-gray-600">
            You&apos;ll be able to get personalized AI fitness and diet plans
            based on your health profile. Stay tuned.
          </p>
        </CardHeader>
        <CardContent>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

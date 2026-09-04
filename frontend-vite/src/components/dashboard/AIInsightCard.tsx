import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardInsight } from "./dashboardTypes";

interface AIInsightCardProps {
  insight: DashboardInsight;
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.12 }}
      aria-labelledby="ai-insight-title"
    >
      <Card className="relative overflow-hidden border-primary-100 bg-gradient-to-br from-primary-50 via-white to-primary-100/45 shadow-card">
        <div className="absolute right-6 top-5 text-primary-100" aria-hidden>
          <Brain className="h-28 w-28" />
        </div>
        <CardContent className="relative p-6 sm:p-7">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-700 shadow-soft">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            AI Health Insight
          </div>
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-content-secondary">Your personalized health companion</p>
            <h3 id="ai-insight-title" className="mt-2 text-2xl font-bold tracking-tight text-content-primary">{insight.title}</h3>
            <p className="mt-4 max-w-2xl text-base leading-7 text-content-secondary">&ldquo;{insight.body}&rdquo;</p>
          </div>
          <Link
            to={insight.href}
            className="group mt-6 inline-flex items-center gap-2 rounded-button bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-card focus-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {insight.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
          </Link>
        </CardContent>
      </Card>
    </motion.section>
  );
}

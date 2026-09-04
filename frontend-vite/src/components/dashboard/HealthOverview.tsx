import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { OverviewMetric } from "./dashboardTypes";

interface HealthOverviewProps {
  metrics: OverviewMetric[];
}

export function HealthOverview({ metrics }: HealthOverviewProps) {
  return (
    <section aria-labelledby="health-overview-title" className="space-y-3">
      <div>
        <h3 id="health-overview-title" className="text-lg font-semibold text-content-primary">Health Overview</h3>
        <p className="text-sm text-content-secondary">Your key MedAI signals in one scan.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.06 * index }}
            >
              <Link to={metric.href} className="group block h-full focus-ring">
                <Card className="h-full border-stone-200/80 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-cardHover motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <CardContent className="flex h-full flex-col justify-between p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0", metric.iconClassName)}>
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <ArrowRight className="h-4 w-4 text-content-tertiary transition-transform group-hover:translate-x-1 group-hover:text-primary-600 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
                    </div>
                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-content-tertiary">{metric.label}</p>
                      <div className="mt-2 flex items-end gap-2">
                        <span className="text-3xl font-bold tracking-tight text-content-primary">{metric.value}</span>
                        <span className="pb-1 text-xs font-medium text-content-secondary">{metric.detail}</span>
                      </div>
                      {typeof metric.progress === "number" && (
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100">
                          <motion.div
                            className="h-full rounded-full bg-primary-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.progress}%` }}
                            transition={{ duration: 0.75, ease: "easeOut", delay: 0.15 }}
                          />
                        </div>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
                        {metric.cta}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

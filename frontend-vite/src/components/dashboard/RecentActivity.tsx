import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "./dashboardTypes";

interface RecentActivityProps {
  items: ActivityItem[];
}

export function RecentActivity({ items }: RecentActivityProps) {
  const visibleItems = items.slice(0, 5);

  return (
    <Card className="h-full border-stone-200/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <p className="mt-1 text-sm text-content-secondary">Latest care touchpoints from your workspace.</p>
          </div>
          <History className="h-5 w-5 text-primary-600" aria-hidden />
        </div>
      </CardHeader>
      <CardContent>
        {visibleItems.length > 0 ? (
          <ol className="space-y-4">
            {visibleItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="relative flex gap-3"
                >
                  {index < visibleItems.length - 1 && <span className="absolute left-4 top-9 h-[calc(100%+0.25rem)] w-px bg-stone-200" aria-hidden />}
                  <span className={cn("relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", item.className)}>
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1 rounded-xl border border-stone-100 bg-stone-50/50 px-3 py-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-content-tertiary">{item.label}</p>
                        <p className="mt-1 truncate text-sm font-semibold text-content-primary">{item.title}</p>
                        <p className="mt-1 text-xs text-content-secondary">{item.date}</p>
                      </div>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        ) : (
          <div className="rounded-card border border-dashed border-primary-200 bg-primary-50/50 p-5">
            <p className="text-sm font-semibold text-content-primary">No activity yet</p>
            <p className="mt-1 text-sm leading-5 text-content-secondary">Start an AI Doctor chat or upload a report to build your health timeline.</p>
            <Link to="/dashboard/chat" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 focus-ring">
              Ask AI Doctor <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

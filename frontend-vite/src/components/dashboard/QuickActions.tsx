import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { QuickAction } from "./dashboardTypes";

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <section aria-labelledby="quick-actions-title" className="space-y-3">
      <div>
        <h3 id="quick-actions-title" className="text-lg font-semibold text-content-primary">Quick Actions</h3>
        <p className="text-sm text-content-secondary">Start with the most useful MedAI tools.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
            >
              <Link to={action.href} className="group block h-full focus-ring">
                <Card className="h-full border-stone-200/80 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-cardHover motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <CardContent className="flex h-full min-h-44 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0", action.className)}>
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <ArrowRight className="h-4 w-4 text-content-tertiary transition-transform group-hover:translate-x-1 group-hover:text-primary-600 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
                    </div>
                    <div className="mt-auto pt-6">
                      <h4 className="text-base font-semibold text-content-primary">{action.title}</h4>
                      <p className="mt-2 text-sm leading-5 text-content-secondary">{action.description}</p>
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

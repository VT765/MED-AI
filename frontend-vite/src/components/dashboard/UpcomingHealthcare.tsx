import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UpcomingItem } from "./dashboardTypes";

interface UpcomingHealthcareProps {
  items: UpcomingItem[];
}

export function UpcomingHealthcare({ items }: UpcomingHealthcareProps) {
  return (
    <Card className="h-full border-stone-200/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Upcoming Healthcare</CardTitle>
            <p className="mt-1 text-sm text-content-secondary">Appointments and mock care bookings stay here.</p>
          </div>
          <CalendarCheck className="h-5 w-5 text-primary-600" aria-hidden />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.href}
              className="group block rounded-card border border-stone-100 bg-stone-50/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white hover:shadow-card focus-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="flex gap-3">
                <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", item.className)}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-content-tertiary">{item.label}</p>
                  <p className="mt-1 truncate text-sm font-semibold text-content-primary">{item.title}</p>
                  <p className="mt-1 text-xs text-content-secondary">{item.detail}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-content-tertiary">{item.meta}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700">
                      View <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}

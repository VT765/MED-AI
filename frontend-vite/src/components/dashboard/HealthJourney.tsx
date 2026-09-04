import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Route } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JourneyMilestone } from "./dashboardTypes";

interface HealthJourneyProps {
  milestones: JourneyMilestone[];
}

export function HealthJourney({ milestones }: HealthJourneyProps) {
  const completed = milestones.filter((item) => item.complete).length;

  return (
    <Card className="h-full border-stone-200/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Your Health Journey</CardTitle>
            <p className="mt-1 text-sm text-content-secondary">{completed} of {milestones.length} milestones complete.</p>
          </div>
          <Route className="h-5 w-5 text-primary-600" aria-hidden />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {milestones.map((item) => (
            <div key={item.id} className="flex items-start gap-3 rounded-xl border border-stone-100 bg-white px-3 py-3">
              {item.complete ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-stone-300" aria-hidden />
              )}
              <div>
                <p className="text-sm font-semibold text-content-primary">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-content-secondary">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <Link to="/dashboard/profile" className="mt-5 inline-flex items-center text-sm font-semibold text-primary-700 focus-ring">
          Continue profile setup
        </Link>
      </CardContent>
    </Card>
  );
}

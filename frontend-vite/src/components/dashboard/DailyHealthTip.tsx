import { Link } from "react-router-dom";
import { ArrowRight, Droplets } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DailyHealthTipProps {
  tip: string;
}

export function DailyHealthTip({ tip }: DailyHealthTipProps) {
  return (
    <Card className="border-stone-200/80 bg-white">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
            <Droplets className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-content-primary">Daily Health Tip</p>
            <p className="mt-2 text-sm leading-6 text-content-secondary">{tip}</p>
            <Link to="/dashboard/health-plan" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 focus-ring">
              Learn more <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

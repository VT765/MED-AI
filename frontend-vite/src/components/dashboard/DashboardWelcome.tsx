import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, HeartPulse, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { HealthScoreStyle } from "./dashboardTypes";

interface DashboardWelcomeProps {
  firstName: string;
  currentDate?: string;
  healthScore: number;
  scoreStyle: HealthScoreStyle;
  profileComplete: number;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function DashboardWelcome({
  firstName,
  currentDate: initialDate,
  healthScore,
  scoreStyle,
  profileComplete,
}: DashboardWelcomeProps) {
  const [greeting, setGreeting] = useState(() => getGreeting());
  const [formattedDate, setFormattedDate] = useState(() => initialDate || getFormattedDate());

  useEffect(() => {
    const updateTimeAndDate = () => {
      setGreeting(getGreeting());
      setFormattedDate(getFormattedDate());
    };
    updateTimeAndDate();
    // Refresh greeting and date automatically every 30 seconds
    const timer = setInterval(updateTimeAndDate, 30000);
    return () => clearInterval(timer);
  }, []);

  const circumference = 2 * Math.PI * 42;
  const progressOffset = circumference - (healthScore / 100) * circumference;

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)]">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-card border border-primary-100 bg-gradient-to-br from-white via-primary-50/60 to-white p-6 shadow-soft sm:p-7"
      >
        <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-[5rem] bg-primary-100/50" aria-hidden />
        <div className="relative">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-3 py-1 text-xs font-semibold text-primary-700 shadow-soft">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            <span>{formattedDate}</span>
          </div>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-content-primary sm:text-4xl">
            {greeting}, {firstName}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-content-secondary sm:text-base">
            Here&apos;s your personal health overview for today. Stay informed, stay healthy, and keep your care journey moving.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-card border border-white bg-white/75 p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                  <ShieldCheck className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-content-tertiary">Profile status</p>
                  <p className="text-sm font-semibold text-content-primary">{profileComplete}% complete</p>
                </div>
              </div>
            </div>
            <Link
              to="/dashboard/profile"
              className="group rounded-card border border-primary-100 bg-white/75 p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-cardHover focus-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="flex items-center justify-between gap-3">
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-content-tertiary">Next best step</span>
                  <span className="mt-1 block text-sm font-semibold text-primary-700">Review health profile</span>
                </span>
                <ArrowRight className="h-4 w-4 text-primary-600 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
      >
        <Card className={cn("h-full overflow-hidden border-primary-100 shadow-card", scoreStyle.softBg)}>
          <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-content-tertiary">
              <HeartPulse className="h-4 w-4 text-primary-600" aria-hidden />
              Health Score
            </div>
            <div className="relative h-36 w-36">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" role="img" aria-label={`Health score ${healthScore} out of 100`}>
                <circle cx="50" cy="50" r="42" className="fill-none stroke-stone-100" strokeWidth="9" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={cn("fill-none", scoreStyle.ring)}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: progressOffset }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("text-4xl font-extrabold tracking-tight", scoreStyle.text)}>{healthScore}</span>
                <span className={cn("mt-1 rounded-full border px-2.5 py-1 text-xs font-bold", scoreStyle.badgeColor)}>{scoreStyle.badge}</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-content-secondary">Based on your existing profile, reports, and AI chat activity.</p>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}

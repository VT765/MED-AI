import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  FileText,
  Calendar,
  Ambulance,
  Activity,
  FlaskConical,
  ArrowRight,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const modules = [
  { href: "/dashboard/chat", title: "Chat with AI Doctor", description: "Describe symptoms and get initial guidance. Not a replacement for certified doctors.", icon: MessageCircle, color: "bg-primary-100 text-primary-600" },
  { href: "/dashboard/reports", title: "Scan Medical Reports", description: "Upload reports (camera or file) and get AI-powered analysis.", icon: FileText, color: "bg-green-100 text-green-700" },
  { href: "/dashboard/appointment", title: "Book Doctor Appointment", description: "Choose a certified doctor, pick date & time, minimal consultation fee.", icon: Calendar, color: "bg-blue-100 text-blue-700" },
  { href: "/dashboard/emergency", title: "Inter-City Patient Transport", description: "Book ambulance services for safe patient transport between cities.", icon: Ambulance, color: "bg-red-100 text-red-700" },
  { href: "/dashboard/lab-tests", title: "Book Lab Test at Home", description: "Select test, address, and time slot. Mock location supported.", icon: FlaskConical, color: "bg-purple-100 text-purple-700" },
  { href: "/dashboard/health-plan", title: "Personalized Healthcare Plan", description: "AI fitness & diet plans tailored to you.", icon: Activity, color: "bg-amber-100 text-amber-700", disabled: true, badge: "Coming Soon", tooltip: "Personalized AI fitness and diet plans based on your health profile. Coming soon." },
];

export function DashboardPage() {
  const [hoveredComingSoon, setHoveredComingSoon] = useState(false);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-2xl font-bold tracking-tight text-content-primary">Dashboard</h2>
        <p className="mt-1 text-content-secondary">Choose a service below to get started.</p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module, i) => {
          const Icon = module.icon;
          const isComingSoon = module.disabled;
          const cardContent = (
            <Card className={cn("relative flex flex-col transition-all", isComingSoon ? "cursor-not-allowed border-stone-200 bg-surface-muted/80 opacity-90" : "hover:border-primary-200 hover:shadow-cardHover")}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", isComingSoon ? "bg-amber-100 text-amber-700" : module.color)}>
                    {isComingSoon ? <Lock className="h-5 w-5" aria-hidden /> : <Icon className="h-5 w-5" aria-hidden />}
                  </div>
                  {isComingSoon && <Badge variant="comingSoon">{module.badge}</Badge>}
                </div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                {isComingSoon ? (
                  <p className="text-sm text-amber-800">This feature is under development. Stay tuned.</p>
                ) : (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-600">
                    Open <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </CardContent>
            </Card>
          );

          if (isComingSoon) {
            return (
              <motion.div key={module.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="relative" onMouseEnter={() => setHoveredComingSoon(true)} onMouseLeave={() => setHoveredComingSoon(false)}>
                <div className="h-full" title={module.tooltip}>{cardContent}</div>
                {hoveredComingSoon && (
                  <div role="tooltip" className="absolute bottom-full left-1/2 z-50 mb-2 max-w-xs -translate-x-1/2 rounded-input border border-stone-200 bg-content-primary px-3 py-2 text-xs text-white shadow-cardHover">{module.tooltip}</div>
                )}
              </motion.div>
            );
          }

          return (
            <motion.div key={module.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={module.href} className="block h-full">{cardContent}</Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

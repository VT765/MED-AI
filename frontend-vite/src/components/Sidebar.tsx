import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageCircle,
  FileText,
  Calendar,
  Ambulance,
  Activity,
  FlaskConical,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

const primaryItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const careItems = [
  { href: "/dashboard/chat", label: "AI Doctor", icon: MessageCircle },
  { href: "/dashboard/reports", label: "Medical Reports", icon: FileText },
  { href: "/dashboard/appointment", label: "Book Doctor Appointment", icon: Calendar },
  { href: "/dashboard/emergency", label: "Emergency", icon: Ambulance },
  { href: "/dashboard/lab-tests", label: "Lab Tests", icon: FlaskConical },
  { href: "/dashboard/health-plan", label: "Health Plan", icon: Activity, disabled: true },
];

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-stone-200 bg-surface lg:flex" aria-label="Dashboard navigation">
      <div className="flex h-14 items-center border-b border-stone-200 px-6">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Logo size={32} className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight text-content-primary">MedAI</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-600 text-white shadow-soft"
                    : "text-content-secondary hover:bg-surface-muted hover:text-content-primary"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-content-tertiary")} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-content-tertiary">
            Care Services
          </h3>
          <div className="mt-2 space-y-1">
            {careItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const isDisabled = item.disabled;

              if (isDisabled) {
                return (
                  <div key={item.href} className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-content-tertiary opacity-60">
                    <Icon className="h-5 w-5 shrink-0" aria-hidden />
                    <span>{item.label}</span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-200"
                      : "text-content-secondary hover:bg-surface-muted hover:text-content-primary"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary-600" : "text-content-tertiary")} aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary-600 shadow-sm">
            <Activity className="h-4 w-4" />
          </div>
          <h4 className="mt-3 text-sm font-semibold text-primary-900">Health Plan</h4>
          <p className="mt-1 text-xs text-primary-700/80">
            Get personalized AI health insights coming soon.
          </p>
        </div>
      </nav>
    </aside>
  );
}

import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

const primaryItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const careItems = [
  { href: "/dashboard/chat", label: "AI Doctor", icon: MessageCircle },
  { href: "/dashboard/reports", label: "Medical Reports", icon: FileText },
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
      </nav>
    </aside>
  );
}

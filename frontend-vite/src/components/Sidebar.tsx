import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  MessageCircle,
  FileText,
  Calendar,
  Ambulance,
  Activity,
  FlaskConical,
  Home,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const [careOpen, setCareOpen] = useState(false);
  const careRef = useRef<HTMLDivElement>(null);

  const isCareActive = careItems.some((item) => !item.disabled && pathname === item.href);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (careRef.current && !careRef.current.contains(e.target as Node)) {
        setCareOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-stone-200 bg-surface-elevated lg:flex" aria-label="Dashboard navigation">
      <nav className="flex flex-1 flex-col gap-0.5 p-4">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-button px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-primary-100 text-primary-700" : "text-content-secondary hover:bg-surface-muted hover:text-content-primary"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}

        <div className="mt-3" ref={careRef}>
          <button
            type="button"
            onClick={() => setCareOpen((open) => !open)}
            className={cn(
              "flex w-full items-center justify-between rounded-button px-3 py-2.5 text-sm font-medium transition-colors",
              careOpen || isCareActive ? "bg-surface-muted text-content-primary" : "text-content-secondary hover:bg-surface-muted hover:text-content-primary"
            )}
            aria-expanded={careOpen}
            aria-controls="care-services-menu"
            aria-haspopup="true"
            id="care-services-trigger"
          >
            <span className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
              <span>Care services</span>
            </span>
            <ChevronDown className={cn("h-4 w-4 shrink-0 text-content-tertiary transition-transform duration-200", careOpen && "rotate-180")} aria-hidden />
          </button>

          <AnimatePresence>
            {careOpen && (
              <motion.div
                id="care-services-menu"
                role="menu"
                aria-label="Care services"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-1 space-y-0.5 pl-10">
                  {careItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    const isDisabled = item.disabled;

                    if (isDisabled) {
                      return (
                        <div
                          key={item.href}
                          role="menuitem"
                          aria-disabled="true"
                          className="flex cursor-not-allowed items-center gap-2 rounded-button px-2 py-1.5 text-xs text-content-tertiary"
                          title="Coming soon: AI fitness & diet plans"
                        >
                          <Icon className="h-4 w-4 shrink-0" aria-hidden />
                          <span>{item.label}</span>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        role="menuitem"
                        className={cn(
                          "flex items-center gap-2 rounded-button px-2 py-1.5 text-xs transition-colors focus:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
                          isActive ? "bg-primary-50 text-primary-700" : "text-content-secondary hover:bg-surface-muted hover:text-content-primary"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </aside>
  );
}

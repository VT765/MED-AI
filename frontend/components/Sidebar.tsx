"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/chat", label: "AI Doctor", icon: MessageCircle },
  { href: "/dashboard/reports", label: "Medical Reports", icon: FileText },
  { href: "/dashboard/appointment", label: "Book Doctor", icon: Calendar },
  { href: "/dashboard/emergency", label: "Emergency", icon: Ambulance },
  { href: "/dashboard/lab-tests", label: "Lab Tests", icon: FlaskConical },
  { href: "/dashboard/health-plan", label: "Health Plan", icon: Activity, disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden w-64 flex-shrink-0 flex-col border-r border-stone-200 bg-surface-elevated lg:flex"
      aria-label="Dashboard navigation"
    >
      <nav className="flex flex-1 flex-col gap-0.5 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isDisabled = item.disabled;

          if (isDisabled) {
            return (
              <div
                key={item.href}
                className="flex items-center gap-3 rounded-button px-3 py-2.5 text-content-tertiary cursor-not-allowed"
                title="Coming soon: AI fitness & diet plans"
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-button px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-100 text-primary-700"
                  : "text-content-secondary hover:bg-surface-muted hover:text-content-primary"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

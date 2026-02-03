"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  FileText,
  Calendar,
  Ambulance,
  Activity,
  FlaskConical,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Home,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/Sidebar";
import { getCurrentUser, clearUser } from "@/lib/auth";
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.replace("/auth/login");
    }
  }, [mounted, user, router]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    clearUser();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const dropdownItems = [
    { icon: User, label: "My Profile", href: "/dashboard/profile" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    { icon: HelpCircle, label: "Help & Support", href: "/dashboard/help" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
      <Sidebar />

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-stone-200 bg-surface-elevated px-2 py-2 lg:hidden"
        aria-label="Mobile navigation"
      >
        {navItems
          .filter((item) => !item.disabled)
          .slice(0, 5)
          .map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-button px-2 py-2 text-xs font-medium transition-colors",
                  isActive ? "text-primary-600" : "text-content-tertiary hover:text-content-primary"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
      </nav>

      <div className="flex flex-1 flex-col lg:ml-0">
        {/* Top bar: no username text. Circular avatar only; click opens dropdown. */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-stone-200 bg-surface-elevated px-4 lg:px-8">
          <h1 className="text-lg font-semibold text-content-primary lg:text-xl">
            MedAI
          </h1>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              aria-label="Open profile menu"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary-400 bg-primary-100 text-primary-700">
                <User className="h-5 w-5" aria-hidden />
              </div>
              <ChevronDown
                className={cn("h-4 w-4 text-gray-500 transition-transform", dropdownOpen && "rotate-180")}
                aria-hidden
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-48 rounded-card border border-stone-200 bg-surface-elevated py-1 shadow-cardHover"
                >
                  {dropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-content-primary hover:bg-surface-muted"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <item.icon className="h-4 w-4 text-gray-500" aria-hidden />
                      {item.label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main className="flex-1 p-4 pb-24 lg:p-8 lg:pb-8 lg:max-w-6xl lg:mx-auto lg:w-full">{children}</main>
      </div>
    </div>
  );
}

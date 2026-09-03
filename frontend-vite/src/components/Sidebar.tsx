import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageCircle,
  FileText,
  Clock,
  Activity,
  Calendar,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { getChatSessions, getReportHistory } from "@/lib/api";
import { getAppointments } from "@/lib/appointments";

const primaryItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const careItems = [
  { href: "/dashboard/chat", label: "AI Doctor", icon: MessageCircle },
  { href: "/dashboard/reports", label: "Medical Reports", icon: FileText },
  { href: "/dashboard/anatomy", label: "Body Atlas 3D", icon: Compass },
];

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const [activities, setActivities] = useState<{ id: string; title: string; date: string; icon: any; color: string }[]>([]);

  useEffect(() => {
    async function loadActivities() {
      try {
        const [chatsRes, reportsRes] = await Promise.allSettled([
          getChatSessions(),
          getReportHistory(),
        ]);
        const appointments = getAppointments();
        const list: { id: string; title: string; date: string; timestamp: number; icon: any; color: string }[] = [];

        if (chatsRes.status === "fulfilled") {
          (chatsRes.value.sessions || []).forEach((s) => {
            const d = new Date(s.updated_at || s.created_at);
            list.push({
              id: `chat-${s.session_id}`,
              title: s.title || "AI Chat Session",
              date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              timestamp: d.getTime(),
              icon: MessageCircle,
              color: "text-purple-600 bg-purple-50",
            });
          });
        }

        if (reportsRes.status === "fulfilled") {
          (reportsRes.value.reports || []).forEach((r) => {
            const d = new Date(r.created_at);
            list.push({
              id: `report-${r.report_id}`,
              title: r.filename || "Medical Report",
              date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              timestamp: d.getTime(),
              icon: FileText,
              color: "text-blue-600 bg-blue-50",
            });
          });
        }

        appointments.forEach((a) => {
          const d = new Date(a.createdAt || Date.now());
          list.push({
            id: `apt-${a.id}`,
            title: `Dr. ${a.doctorName}`,
            date: a.date,
            timestamp: d.getTime(),
            icon: Calendar,
            color: "text-amber-600 bg-amber-50",
          });
        });

        list.sort((a, b) => b.timestamp - a.timestamp);
        setActivities(list);
      } catch {
        // fail silently
      }
    }

    loadActivities();
  }, []);

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-stone-200 bg-surface lg:flex" aria-label="Dashboard navigation">
      <div className="flex h-14 items-center border-b border-stone-200 px-6 shrink-0">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Logo size={32} className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight text-content-primary">MedAI</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {/* Top Nav Items */}
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

        {/* Care Services */}
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

        {/* Recent Activity Section in Left Sidebar (Below Medical Reports) */}
        <div className="mt-8">
          <div className="flex items-center justify-between px-3 mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-content-tertiary flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-primary-600" />
              Recent Activity
            </h3>
            {activities.length > 0 && (
              <span className="text-[10px] font-bold text-content-tertiary bg-stone-100 px-1.5 py-0.5 rounded-full">
                {activities.length}
              </span>
            )}
          </div>

          <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <p className="px-3 py-2 text-xs text-content-tertiary">No activity recorded yet</p>
            ) : (
              activities.slice(0, 5).map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.id}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs text-content-secondary hover:bg-surface-muted transition-colors"
                  >
                    <div className={cn("p-1.5 rounded-lg shrink-0", act.color)}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-content-primary truncate">{act.title}</p>
                      <p className="text-[10px] text-content-tertiary flex items-center gap-1 mt-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {act.date}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}

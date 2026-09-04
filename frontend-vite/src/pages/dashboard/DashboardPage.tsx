import { useEffect, useMemo, useState } from "react";
import {
  Brain,
  Calendar,
  Compass,
  FileText,
  Heart,
  MessageCircle,
  UserRound,
} from "lucide-react";
import { AIInsightCard } from "@/components/dashboard/AIInsightCard";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { DashboardWelcome } from "@/components/dashboard/DashboardWelcome";
import { HealthJourney } from "@/components/dashboard/HealthJourney";
import { HealthOverview } from "@/components/dashboard/HealthOverview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import type {
  ActivityItem,
  DashboardInsight,
  HealthScoreStyle,
  JourneyMilestone,
  OverviewMetric,
  QuickAction,
} from "@/components/dashboard/dashboardTypes";
import { getAppointments, type Appointment } from "@/lib/appointments";
import { getChatSessions, getReportHistory, type ChatSessionSummary, type ReportSummary } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { getProfile, type ProfileResponse } from "@/lib/profile";


function calcHealthScore(profile: ProfileResponse | null, reportCount: number, chatCount: number): number {
  if (!profile) return 0;
  let score = 0;
  score += Math.round(profile.profileComplete * 0.4);
  score += Math.min(reportCount * 10, 30);
  score += Math.min(chatCount * 5, 30);
  return Math.min(score, 100);
}

function getHealthScoreStyle(score: number): HealthScoreStyle {
  if (score < 50) {
    return {
      text: "text-red-600",
      badge: "Needs attention",
      badgeColor: "border-red-200 bg-red-50 text-red-700",
      ring: "stroke-red-500",
      bar: "bg-red-500",
      softBg: "bg-red-50/20",
    };
  }

  if (score < 75) {
    return {
      text: "text-amber-600",
      badge: "Fair",
      badgeColor: "border-amber-200 bg-amber-50 text-amber-700",
      ring: "stroke-amber-500",
      bar: "bg-amber-500",
      softBg: "bg-amber-50/20",
    };
  }

  return {
    text: "text-emerald-600",
    badge: "Good",
    badgeColor: "border-emerald-200 bg-emerald-50 text-emerald-700",
    ring: "stroke-emerald-500",
    bar: "bg-emerald-500",
    softBg: "bg-emerald-50/20",
  };
}

function formatActivityDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFirstName(profile: ProfileResponse | null, username?: string): string {
  if (profile?.fullName?.trim()) {
    const first = profile.fullName.trim().split(" ")[0];
    return first.charAt(0).toUpperCase() + first.slice(1);
  }

  if (username?.trim()) {
    const raw = username.trim();
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  return "there";
}

function getInsight(profile: ProfileResponse | null, chatCount: number, reportCount: number): DashboardInsight {
  const conditions = profile?.conditions || {};

  if (conditions.diabetes?.yes) {
    return {
      title: "Monitor Blood Sugar",
      body: "Since diabetes is listed in your profile, keep tracking your health information and discuss changes with a certified doctor.",
      cta: "Ask AI Doctor",
      href: "/dashboard/chat",
    };
  }

  if (conditions.hypertension?.yes) {
    return {
      title: "Watch Your Blood Pressure",
      body: "High blood pressure is listed in your profile. Use MedAI to organize questions before speaking with a certified doctor.",
      cta: "Ask AI Doctor",
      href: "/dashboard/chat",
    };
  }

  if (chatCount > 0) {
    return {
      title: "Follow-up Care Recommendation",
      body: "You have active AI Doctor conversations. Review recent guidance or start a new chat if your symptoms change.",
      cta: "Resume Chat",
      href: "/dashboard/chat",
    };
  }

  if (reportCount > 0) {
    return {
      title: "Medical Report Insights",
      body: `You have ${reportCount} report${reportCount === 1 ? "" : "s"} uploaded. You can review results and discuss key metrics with AI Doctor anytime.`,
      cta: "View Reports",
      href: "/dashboard/reports",
    };
  }

  return {
    title: "Preventive Care Tip",
    body: "Consistent daily wellness habits and routine health tracking are useful foundations for long-term health awareness.",
    cta: "Consult AI Doctor",
    href: "/dashboard/chat",
  };
}

function buildRecentActivity(
  chatSessions: ChatSessionSummary[],
  reports: ReportSummary[],
  appointments: Appointment[]
): ActivityItem[] {
  const items: ActivityItem[] = [];

  chatSessions.forEach((session) => {
    const dateValue = session.updated_at || session.created_at;
    const date = new Date(dateValue);
    items.push({
      id: `chat-${session.session_id}`,
      label: "AI Doctor",
      title: session.title || "AI Chat Session",
      date: formatActivityDate(dateValue),
      timestamp: Number.isNaN(date.getTime()) ? 0 : date.getTime(),
      icon: MessageCircle,
      className: "border border-primary-100 bg-primary-50 text-primary-700",
    });
  });

  reports.forEach((report) => {
    const date = new Date(report.created_at);
    items.push({
      id: `report-${report.report_id}`,
      label: "Medical Report",
      title: report.filename || "Medical Report",
      date: formatActivityDate(report.created_at),
      timestamp: Number.isNaN(date.getTime()) ? 0 : date.getTime(),
      icon: FileText,
      className: "border border-sky-100 bg-sky-50 text-sky-700",
    });
  });

  appointments.forEach((appointment) => {
    const date = new Date(appointment.createdAt);
    items.push({
      id: `appointment-${appointment.id}`,
      label: "Appointment",
      title: `Dr. ${appointment.doctorName}`,
      date: `${appointment.date} at ${appointment.time}`,
      timestamp: Number.isNaN(date.getTime()) ? 0 : date.getTime(),
      icon: Calendar,
      className: "border border-amber-100 bg-amber-50 text-amber-700",
    });
  });

  return items.sort((a, b) => b.timestamp - a.timestamp);
}

function buildJourney(profile: ProfileResponse | null, chatCount: number, reportCount: number): JourneyMilestone[] {
  const profileStarted = Boolean(profile);
  const profileComplete = (profile?.profileComplete ?? 0) >= 100;

  return [
    {
      id: "profile-started",
      title: "Profile started",
      detail: profileStarted ? "Your health profile is available." : "Create your profile to personalize MedAI.",
      complete: profileStarted,
    },
    {
      id: "ai-consultation",
      title: "First AI consultation",
      detail: chatCount > 0 ? `${chatCount} AI Doctor conversation${chatCount === 1 ? "" : "s"} recorded.` : "Ask AI Doctor your first health question.",
      complete: chatCount > 0,
    },
    {
      id: "report-analyzed",
      title: "First report analyzed",
      detail: reportCount > 0 ? `${reportCount} medical report${reportCount === 1 ? "" : "s"} uploaded.` : "Upload a report when you are ready.",
      complete: reportCount > 0,
    },
    {
      id: "profile-complete",
      title: "Complete your health profile",
      detail: `${profile?.profileComplete ?? 0}% complete based on your saved profile.`,
      complete: profileComplete,
    },
  ];
}

export function DashboardPage() {
  const user = getCurrentUser();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSessionSummary[]>([]);
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [profileRes, chatsRes, reportsRes] = await Promise.allSettled([
          getProfile(),
          getChatSessions(),
          getReportHistory(),
        ]);

        if (profileRes.status === "fulfilled") setProfile(profileRes.value);
        if (chatsRes.status === "fulfilled") setChatSessions(chatsRes.value.sessions || []);
        if (reportsRes.status === "fulfilled") setReports(reportsRes.value.reports || []);
        setAppointments(getAppointments());
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const reportCount = reports.length;
  const chatCount = chatSessions.length;
  const profileComplete = profile?.profileComplete ?? 0;
  const healthScore = calcHealthScore(profile, reportCount, chatCount);
  const scoreStyle = getHealthScoreStyle(healthScore);
  const firstName = getFirstName(profile, user?.username);

  const overviewMetrics: OverviewMetric[] = useMemo(
    () => [
      {
        href: "/dashboard/profile",
        label: "Health Score",
        value: `${healthScore}`,
        detail: scoreStyle.badge,
        cta: "View score",
        icon: Heart,
        iconClassName: "bg-emerald-50 text-emerald-700",
        progress: healthScore,
      },
      {
        href: "/dashboard/reports",
        label: "Reports",
        value: `${reportCount}`,
        detail: "uploaded",
        cta: reportCount === 0 ? "Upload report" : "Open reports",
        icon: FileText,
        iconClassName: "bg-sky-50 text-sky-700",
      },
      {
        href: "/dashboard/chat",
        label: "AI Chats",
        value: `${chatCount}`,
        detail: chatCount === 1 ? "consultation" : "consultations",
        cta: chatCount === 0 ? "Start chat" : "Resume care",
        icon: Brain,
        iconClassName: "bg-primary-50 text-primary-700",
      },
      {
        href: "/dashboard/profile",
        label: "Profile",
        value: `${profileComplete}%`,
        detail: "complete",
        cta: "Improve profile",
        icon: UserRound,
        iconClassName: "bg-green-50 text-green-700",
        progress: profileComplete,
      },
    ],
    [chatCount, healthScore, profileComplete, reportCount, scoreStyle.badge]
  );

  const quickActions: QuickAction[] = [
    {
      href: "/dashboard/chat",
      title: "AI Doctor",
      description: "Ask a health question and continue your saved conversations.",
      icon: MessageCircle,
      className: "bg-primary-50 text-primary-700",
    },
    {
      href: "/dashboard/reports",
      title: "Reports",
      description: "Understand uploaded medical reports and review analysis history.",
      icon: FileText,
      className: "bg-sky-50 text-sky-700",
    },
    {
      href: "/dashboard/anatomy",
      title: "Body Atlas",
      description: "Explore human anatomy through the interactive 3D viewer.",
      icon: Compass,
      className: "bg-rose-50 text-rose-700",
    },
  ];

  const recentActivity = useMemo(
    () => buildRecentActivity(chatSessions, reports, appointments),
    [appointments, chatSessions, reports]
  );
  const journey = useMemo(() => buildJourney(profile, chatCount, reportCount), [chatCount, profile, reportCount]);
  const insight = useMemo(() => getInsight(profile, chatCount, reportCount), [chatCount, profile, reportCount]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-7">
      <DashboardWelcome
        firstName={firstName}
        healthScore={healthScore}
        scoreStyle={scoreStyle}
        profileComplete={profileComplete}
      />

      <HealthOverview metrics={overviewMetrics} />

      <AIInsightCard insight={insight} />

      <QuickActions actions={quickActions} />

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <RecentActivity items={recentActivity} />
        <HealthJourney milestones={journey} />
      </section>
    </div>
  );
}

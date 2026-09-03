import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  FileText,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  Heart,
  Droplets,
  Brain,
  Loader2,
  Calendar,
  Compass,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { getProfile, type ProfileResponse } from "@/lib/profile";
import { getChatSessions, getReportHistory, type ChatSessionSummary, type ReportSummary } from "@/lib/api";
import { getAppointments, type Appointment } from "@/lib/appointments";

const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

const quickActions = [
  { href: "/dashboard/chat", title: "Chat with AI Doctor", description: "Describe symptoms and get initial guidance.", icon: MessageCircle, color: "bg-primary-100 text-primary-600" },
  { href: "/dashboard/reports", title: "Scan Medical Reports", description: "Upload reports and get AI-powered analysis.", icon: FileText, color: "bg-green-100 text-green-700" },
  { href: "/dashboard/anatomy", title: "3D Body Atlas", description: "Explore interactive 3D human anatomy & organ systems.", icon: Compass, color: "bg-rose-100 text-rose-600" },
];

function calcHealthScore(profile: ProfileResponse | null, reportCount: number, chatCount: number): number {
  if (!profile) return 0;
  let score = 0;
  // Profile completeness contributes up to 40
  score += Math.round(profile.profileComplete * 0.4);
  // Having reports contributes up to 30
  score += Math.min(reportCount * 10, 30);
  // Having chats contributes up to 30
  score += Math.min(chatCount * 5, 30);
  return Math.min(score, 100);
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

  const getFirstName = () => {
    if (profile?.fullName && profile.fullName.trim()) {
      const first = profile.fullName.trim().split(" ")[0];
      return first.charAt(0).toUpperCase() + first.slice(1);
    }
    if (user?.username) {
      const raw = user.username.trim();
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    }
    return "there";
  };

  const firstName = getFirstName();
  const reportCount = reports.length;
  const chatCount = chatSessions.length;
  const profileComplete = profile?.profileComplete ?? 0;
  const healthScore = calcHealthScore(profile, reportCount, chatCount);

  // Dynamic styling for Health Score severity
  const getHealthScoreColor = (score: number) => {
    if (score < 50) {
      return {
        text: "text-red-600",
        badge: "Low",
        badgeColor: "bg-red-100 text-red-700 border-red-200",
        iconColor: "bg-red-100 text-red-600",
        bar: "bg-red-500",
        cardBorder: "border-red-200/80 bg-red-50/10",
      };
    }
    if (score < 75) {
      return {
        text: "text-amber-600",
        badge: "Fair",
        badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
        iconColor: "bg-amber-100 text-amber-600",
        bar: "bg-amber-500",
        cardBorder: "border-amber-200/80 bg-amber-50/10",
      };
    }
    return {
      text: "text-emerald-600",
      badge: "Good",
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      iconColor: "bg-emerald-100 text-emerald-600",
      bar: "bg-emerald-500",
      cardBorder: "border-emerald-200/80 bg-emerald-50/10",
    };
  };

  const scoreStyle = getHealthScoreColor(healthScore);

  // Build recent activity timeline from real data with distinct icons & colors
  const recentActivity: { id: string; type: string; title: string; date: string; timestamp: number; icon: any; color: string }[] = [];

  chatSessions.forEach((s) => {
    const d = new Date(s.updated_at || s.created_at);
    recentActivity.push({
      id: `chat-${s.session_id}`,
      type: "chat",
      title: s.title || "AI Chat Session",
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      timestamp: d.getTime(),
      icon: MessageCircle,
      color: "text-purple-600 bg-purple-50 border border-purple-100",
    });
  });

  reports.forEach((r) => {
    const d = new Date(r.created_at);
    recentActivity.push({
      id: `report-${r.report_id}`,
      type: "report",
      title: r.filename || "Medical Report",
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      timestamp: d.getTime(),
      icon: FileText,
      color: "text-blue-600 bg-blue-50 border border-blue-100",
    });
  });

  appointments.forEach((a) => {
    const d = new Date(a.createdAt || Date.now());
    recentActivity.push({
      id: `apt-${a.id}`,
      type: "appointment",
      title: `Doctor Booking: Dr. ${a.doctorName}`,
      date: `${a.date} at ${a.time}`,
      timestamp: d.getTime(),
      icon: Calendar,
      color: "text-amber-600 bg-amber-50 border border-amber-100",
    });
  });

  // Sort by timestamp descending
  recentActivity.sort((a, b) => b.timestamp - a.timestamp);

  // Build continue where you left off (up to 3 items)
  const continueItems: { type: string; title: string; date: string; href: string }[] = [];
  chatSessions.slice(0, 3).forEach((s) => {
    continueItems.push({
      type: "chat",
      title: s.title || "AI Chat Session",
      date: `Active ${new Date(s.updated_at || s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      href: "/dashboard/chat",
    });
  });

  if (continueItems.length < 3 && reports.length > 0) {
    const latest = reports[0];
    continueItems.push({
      type: "report",
      title: latest.filename || "Medical Report",
      date: `Analyzed ${new Date(latest.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      href: "/dashboard/reports",
    });
  }

  // Generate personalized AI insight based on health data (no duplicate profile completion message)
  const getInsight = () => {
    const conditions = profile?.conditions || {};
    if (conditions.diabetes?.yes) {
      return { title: "Monitor Blood Sugar", body: "Since you've reported diabetes, we recommend regular monitoring of your blood sugar levels and maintaining a balanced diet low in refined sugars.", cta: "Discuss with AI", href: "/dashboard/chat" };
    }
    if (conditions.hypertension?.yes) {
      return { title: "Watch Your Blood Pressure", body: "With high blood pressure on your profile, consider reducing sodium intake, exercising regularly, and monitoring your BP at home.", cta: "Discuss with AI", href: "/dashboard/chat" };
    }
    if (profile?.bmi) {
      const bmi = parseFloat(profile.bmi);
      if (bmi > 25) {
        return { title: "Stay Active", body: `Your BMI of ${profile.bmi} suggests you could benefit from increased physical activity. Even 30 minutes of walking daily can make a big difference.`, cta: "Discuss with AI", href: "/dashboard/chat" };
      }
    }
    if (chatSessions.length > 0) {
      return { title: "Follow-up Care Recommendation", body: "You have active conversations with AI Doctor. Review recent recommendations or start a new chat if your symptoms change.", cta: "Resume Chat", href: "/dashboard/chat" };
    }
    if (reports.length > 0) {
      return { title: "Medical Report Insights", body: `You have ${reports.length} report(s) uploaded. You can discuss lab results and key metrics directly with AI Doctor anytime.`, cta: "View Reports", href: "/dashboard/reports" };
    }
    return { title: "Preventive Care Tip", body: "Consistent daily wellness habits and routine health tracking are key to long-term health. Ask AI Doctor for personalized advice.", cta: "Consult AI Doctor", href: "/dashboard/chat" };
  };

  const insight = getInsight();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-3xl font-bold tracking-tight text-content-primary">Welcome back, {firstName}</h2>
        <p className="mt-1 text-content-secondary">{currentDate} • Here is your health overview.</p>
      </motion.div>

      {/* Main Grid: Left 2 Cols (Stat cards + main content), Right 1 Col (Sidebar aligned at top) */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        
        {/* Left Column (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Overview Cards (2x2 grid) */}
          <div className="grid gap-4 sm:grid-cols-2">
            
            {/* 1. Health Score Card (Visually distinct & color-coded) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Link to="/dashboard/profile" className="block h-full">
                <Card className={cn("hover:shadow-cardHover transition-all h-full cursor-pointer relative overflow-hidden border", scoreStyle.cardBorder)}>
                  <CardContent className="p-5 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", scoreStyle.iconColor)}>
                          <Heart className="h-5 w-5 fill-current" aria-hidden />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-content-secondary">Health Score</p>
                          <span className={cn("inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5", scoreStyle.badgeColor)}>
                            {scoreStyle.badge}
                          </span>
                        </div>
                      </div>
                      <h3 className={cn("text-3xl font-extrabold tracking-tight", scoreStyle.text)}>
                        {healthScore}
                      </h3>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-content-tertiary mb-1">
                        <span>Score rating</span>
                        <span className="font-medium">{healthScore}/100</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                        <div
                          className={cn("h-full rounded-full transition-all duration-500", scoreStyle.bar)}
                          style={{ width: `${healthScore}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            {/* 2. Reports Stat Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Link to="/dashboard/reports" className="block h-full">
                <Card className="hover:shadow-cardHover transition-all h-full cursor-pointer border-border/50">
                  <CardContent className="p-5 flex items-center gap-4 h-full">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <FileText className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-content-secondary">Reports</p>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <h3 className="text-2xl font-bold text-content-primary">{reportCount}</h3>
                      </div>
                      {reportCount === 0 ? (
                        <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                          Upload your first report <ArrowRight className="h-3 w-3" />
                        </span>
                      ) : (
                        <span className="text-xs text-content-tertiary">Uploaded</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            {/* 3. AI Chats Stat Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Link to="/dashboard/chat" className="block h-full">
                <Card className="hover:shadow-cardHover transition-all h-full cursor-pointer border-border/50">
                  <CardContent className="p-5 flex items-center gap-4 h-full">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                      <MessageCircle className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-content-secondary">AI Chats</p>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <h3 className="text-2xl font-bold text-content-primary">{chatCount}</h3>
                        <span className="text-xs text-content-tertiary">Consultations</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            {/* 4. Profile Completion Stat Card (Clickable to /dashboard/profile) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Link to="/dashboard/profile" className="block h-full">
                <Card className="hover:shadow-cardHover transition-all h-full cursor-pointer border-border/50">
                  <CardContent className="p-5 flex items-center gap-4 h-full">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                      <CheckCircle className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-content-secondary">Profile</p>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <h3 className="text-2xl font-bold text-content-primary">{profileComplete}%</h3>
                        <span className="text-xs text-content-tertiary">Completed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

          </div>

          {/* Continue Where You Left Off (Up to 2-3 recent conversations) */}
          {continueItems.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="text-lg font-semibold mb-3 text-content-primary">Continue Where You Left Off</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {continueItems.map((item, i) => (
                  <Link key={i} to={item.href} className="block">
                    <Card className="hover:border-primary-200 hover:shadow-cardHover transition-all cursor-pointer border-border/50 h-full">
                      <CardContent className="p-4 flex items-center justify-between gap-3 h-full">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={cn("p-2 rounded-lg shrink-0", item.type === 'chat' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600')}>
                            {item.type === 'chat' ? <MessageCircle className="h-4 w-4"/> : <FileText className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-content-primary text-xs sm:text-sm truncate">{item.title}</p>
                            <p className="text-[11px] text-content-secondary truncate">{item.date}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-content-tertiary" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-lg font-semibold mb-3 text-content-primary">Quick Actions</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {quickActions.map((module) => {
                const Icon = module.icon;
                return (
                  <Link key={module.href} to={module.href} className="block h-full">
                    <Card className="relative flex flex-col h-full transition-all hover:border-primary-200 hover:shadow-cardHover border-border/50">
                      <CardHeader className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", module.color)}>
                            <Icon className="h-5 w-5" aria-hidden />
                          </div>
                          <div>
                            <CardTitle className="text-base">{module.title}</CardTitle>
                            <CardDescription className="text-xs mt-1 line-clamp-2">{module.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          
          {/* AI Health Insights */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-100 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-primary-200/40">
                <Brain className="h-32 w-32" />
              </div>
              <CardHeader className="relative z-10 pb-2">
                <div className="flex items-center gap-2 text-primary-700 font-semibold mb-1">
                  <Sparkles className="h-4 w-4" />
                  AI Insight
                </div>
                <CardTitle className="text-xl">{insight.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-sm text-primary-800/80 mb-4 leading-relaxed">
                  {insight.body}
                </p>
                <Link to={insight.href} className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  {insight.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Daily Health Tip */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-content-primary font-semibold">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  Daily Tip
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-content-secondary leading-relaxed">
                  Taking a 5-minute walk every hour can significantly reduce back pain and improve focus if you have a desk job.
                </p>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

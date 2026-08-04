import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  FileText,
  ArrowRight,
  Activity,
  CheckCircle,
  Clock,
  Sparkles,
  Heart,
  Droplets,
  Brain,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { getProfile, type ProfileResponse } from "@/lib/profile";
import { getChatSessions, getReportHistory, type ChatSessionSummary, type ReportSummary } from "@/lib/api";

const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

const quickActions = [
  { href: "/dashboard/chat", title: "Chat with AI Doctor", description: "Describe symptoms and get initial guidance.", icon: MessageCircle, color: "bg-primary-100 text-primary-600" },
  { href: "/dashboard/reports", title: "Scan Medical Reports", description: "Upload reports and get AI-powered analysis.", icon: FileText, color: "bg-green-100 text-green-700" },
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
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const userName = profile?.fullName || user?.username || "there";
  const reportCount = reports.length;
  const chatCount = chatSessions.length;
  const profileComplete = profile?.profileComplete ?? 0;
  const healthScore = calcHealthScore(profile, reportCount, chatCount);

  const overviewCards = [
    { title: "Health Score", value: String(healthScore), subtitle: "out of 100", icon: Heart, color: "bg-red-100 text-red-600" },
    { title: "Reports", value: String(reportCount), subtitle: "Uploaded", icon: FileText, color: "bg-blue-100 text-blue-600" },
    { title: "AI Chats", value: String(chatCount), subtitle: "Consultations", icon: MessageCircle, color: "bg-purple-100 text-purple-600" },
    { title: "Profile", value: `${profileComplete}%`, subtitle: "Completed", icon: CheckCircle, color: "bg-green-100 text-green-600" },
  ];

  // Build recent activity from real data
  const recentActivity: { id: string; type: string; title: string; date: string; icon: any; color: string }[] = [];

  chatSessions.slice(0, 3).forEach((s) => {
    recentActivity.push({
      id: `chat-${s.session_id}`,
      type: "chat",
      title: s.title || "AI Chat Session",
      date: new Date(s.updated_at || s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      icon: MessageCircle,
      color: "text-purple-500 bg-purple-50",
    });
  });

  reports.slice(0, 3).forEach((r) => {
    recentActivity.push({
      id: `report-${r.report_id}`,
      type: "report",
      title: r.filename || "Medical Report",
      date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      icon: FileText,
      color: "text-blue-500 bg-blue-50",
    });
  });

  // Sort by date descending
  recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Build continue where you left off
  const continueItems: { type: string; title: string; date: string; href: string }[] = [];
  if (chatSessions.length > 0) {
    const latest = chatSessions[0];
    continueItems.push({
      type: "chat",
      title: latest.title || "AI Chat Session",
      date: `Last active ${new Date(latest.updated_at || latest.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      href: "/dashboard/chat",
    });
  }
  if (reports.length > 0) {
    const latest = reports[0];
    continueItems.push({
      type: "report",
      title: latest.filename || "Medical Report",
      date: `Analyzed ${new Date(latest.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      href: "/dashboard/reports",
    });
  }

  // Generate personalized AI insight based on profile
  const getInsight = () => {
    if (!profile || !profile.onboardingDone) {
      return { title: "Complete Your Profile", body: "Set up your health profile to receive personalized AI-powered health insights and recommendations.", cta: "Complete Profile", href: "/onboarding" };
    }
    const conditions = profile.conditions || {};
    if (conditions.diabetes?.yes) {
      return { title: "Monitor Blood Sugar", body: "Since you've reported diabetes, we recommend regular monitoring of your blood sugar levels and maintaining a balanced diet low in refined sugars.", cta: "Discuss with AI", href: "/dashboard/chat" };
    }
    if (conditions.hypertension?.yes) {
      return { title: "Watch Your Blood Pressure", body: "With high blood pressure on your profile, consider reducing sodium intake, exercising regularly, and monitoring your BP at home.", cta: "Discuss with AI", href: "/dashboard/chat" };
    }
    if (profile.bmi) {
      const bmi = parseFloat(profile.bmi);
      if (bmi > 25) {
        return { title: "Stay Active", body: `Your BMI of ${profile.bmi} suggests you could benefit from increased physical activity. Even 30 minutes of walking daily can make a big difference.`, cta: "Discuss with AI", href: "/dashboard/chat" };
      }
    }
    return { title: "Stay Hydrated", body: "We recommend drinking at least 2.5 liters of water daily to maintain optimal health, especially during warm weather.", cta: "Discuss with AI", href: "/dashboard/chat" };
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
        <h2 className="text-3xl font-bold tracking-tight text-content-primary">Welcome back, {userName}</h2>
        <p className="mt-1 text-content-secondary">{currentDate} • Here is your health overview.</p>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 + 0.1 }}>
            <Card className="hover:shadow-cardHover transition-shadow border-border/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", card.color)}>
                  <card.icon className="h-6 w-6" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-medium text-content-secondary">{card.title}</p>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-2xl font-bold text-content-primary">{card.value}</h3>
                    <span className="text-xs text-content-tertiary">{card.subtitle}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Continue Where You Left Off */}
          {continueItems.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="text-lg font-semibold mb-4 text-content-primary">Continue Where You Left Off</h3>
            <div className="grid gap-4 sm:grid-cols-2">
               {continueItems.map((item, i) => (
                  <Link key={i} to={item.href}>
                    <Card className="hover:border-primary-200 hover:shadow-cardHover transition-all cursor-pointer border-border/50">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg", item.type === 'chat' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600')}>
                             {item.type === 'chat' ? <MessageCircle className="h-5 w-5"/> : <FileText className="h-5 w-5" />}
                          </div>
                          <div>
                             <p className="font-medium text-content-primary text-sm">{item.title}</p>
                             <p className="text-xs text-content-secondary">{item.date}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-content-tertiary" />
                      </CardContent>
                    </Card>
                  </Link>
               ))}
            </div>
          </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
             <h3 className="text-lg font-semibold mb-4 text-content-primary">Quick Actions</h3>
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

          {/* Recent Activity Timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {recentActivity.length === 0 ? (
                  <div className="p-6 text-center text-sm text-content-secondary">
                    No recent activity yet. Start a chat or upload a report to see activity here.
                  </div>
                ) : (
                 <ul className="divide-y divide-border/40">
                    {recentActivity.slice(0, 5).map((activity) => (
                       <li key={activity.id} className="p-4 flex items-start gap-4 hover:bg-surface-50 transition-colors">
                          <div className={cn("p-2 rounded-full shrink-0", activity.color)}>
                             <activity.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 space-y-1">
                             <p className="text-sm font-medium text-content-primary">{activity.title}</p>
                             <div className="flex items-center text-xs text-content-secondary gap-1">
                                <Clock className="h-3 w-3" />
                                {activity.date}
                             </div>
                          </div>
                       </li>
                    ))}
                 </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* Right Column - Secondary Content (Spans 1 column) */}
        <div className="space-y-6">
           
           {/* AI Health Insights */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
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

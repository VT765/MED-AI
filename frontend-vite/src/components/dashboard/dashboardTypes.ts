import type { LucideIcon } from "lucide-react";

export interface HealthScoreStyle {
  text: string;
  badge: string;
  badgeColor: string;
  ring: string;
  bar: string;
  softBg: string;
}

export interface OverviewMetric {
  href: string;
  label: string;
  value: string;
  detail: string;
  cta: string;
  icon: LucideIcon;
  iconClassName: string;
  progress?: number;
}

export interface QuickAction {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  className: string;
}

export interface ActivityItem {
  id: string;
  label: string;
  title: string;
  date: string;
  timestamp: number;
  icon: LucideIcon;
  className: string;
}

export interface JourneyMilestone {
  id: string;
  title: string;
  detail: string;
  complete: boolean;
}

export interface UpcomingItem {
  id: string;
  href: string;
  label: string;
  title: string;
  detail: string;
  meta: string;
  icon: LucideIcon;
  className: string;
}

export interface DashboardInsight {
  title: string;
  body: string;
  cta: string;
  href: string;
}

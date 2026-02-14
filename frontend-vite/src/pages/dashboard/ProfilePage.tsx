import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthToken } from "@/lib/auth";
import { apiUrl } from "@/lib/api";

interface ProfileData {
  id: string;
  username: string | null;
  phone: string;
  email?: string;
  authProvider: string;
  profileComplete: boolean;
  createdAt: string;
}

export function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = getAuthToken();
        const res = await fetch(apiUrl("/api/auth/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load profile");
        setProfile(data.user);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-content-secondary">{error || "Unable to load profile"}</p>
      </div>
    );
  }

  const initials = profile.username
    ? profile.username.slice(0, 2).toUpperCase()
    : profile.phone.slice(-2);

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold tracking-tight text-content-primary">My Profile</h2>
        <p className="mt-1 text-content-secondary">Your account details and information.</p>
      </motion.div>

      {/* Profile banner card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="px-6 py-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-600">
              {initials}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-semibold text-content-primary">
                {profile.username || "New User"}
              </h3>
              <p className="mt-0.5 text-sm text-content-secondary">{profile.phone}</p>
              <div className="mt-2">
                {profile.profileComplete ? (
                  <Badge className="gap-1.5 border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Profile complete
                  </Badge>
                ) : (
                  <Badge className="gap-1.5 border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">
                    <AlertCircle className="h-3.5 w-3.5" /> Incomplete
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Detail tiles */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            icon: UserIcon,
            label: "Username",
            value: profile.username || "Not set",
            muted: !profile.username,
            color: "bg-primary-100 text-primary-600",
          },
          {
            icon: Phone,
            label: "Phone",
            value: profile.phone,
            muted: false,
            color: "bg-green-100 text-green-600",
          },
          {
            icon: Mail,
            label: "Email",
            value: profile.email || "Not set",
            muted: !profile.email,
            color: "bg-blue-100 text-blue-600",
          },
          {
            icon: Calendar,
            label: "Member since",
            value: memberSince,
            muted: false,
            color: "bg-purple-100 text-purple-600",
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Card className="flex items-center gap-4 px-5 py-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-content-tertiary">
                    {item.label}
                  </p>
                  <p
                    className={`mt-0.5 truncate text-sm font-medium ${
                      item.muted ? "italic text-content-tertiary" : "text-content-primary"
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { Bell, Palette, Shield, Moon, Volume2, Globe } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description?: string;
  icon: React.ElementType;
}

function SettingToggle({ enabled, onToggle, label, description, icon: Icon }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 px-1">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-content-tertiary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-content-primary">{label}</p>
          {description && <p className="text-xs text-content-tertiary mt-0.5">{description}</p>}
        </div>
      </div>
      <button type="button" role="switch" aria-checked={enabled} onClick={onToggle}
        className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          enabled ? "bg-primary-500" : "bg-gray-200"
        )}>
        <span className={cn("pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
          enabled ? "translate-x-6" : "translate-x-1"
        )} />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold tracking-tight text-content-primary">Settings</h2>
        <p className="mt-1 text-content-secondary">Manage your app preferences and account settings.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="px-5 py-2">
          <div className="flex items-center gap-3 py-3 border-b border-stone-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600"><Bell className="h-5 w-5" /></div>
            <h3 className="text-base font-semibold text-content-primary">Notifications</h3>
          </div>
          <div className="divide-y divide-stone-50">
            <SettingToggle enabled={notifications} onToggle={() => setNotifications(!notifications)} label="Push Notifications" description="Get notified about appointments and health tips" icon={Bell} />
            <SettingToggle enabled={soundEffects} onToggle={() => setSoundEffects(!soundEffects)} label="Sound Effects" description="Play sounds for new messages and alerts" icon={Volume2} />
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="px-5 py-2">
          <div className="flex items-center gap-3 py-3 border-b border-stone-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600"><Palette className="h-5 w-5" /></div>
            <h3 className="text-base font-semibold text-content-primary">Appearance</h3>
          </div>
          <div className="divide-y divide-stone-50">
            <SettingToggle enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} label="Dark Mode" description="Switch to dark theme (coming soon)" icon={Moon} />
            <div className="flex items-center justify-between gap-4 py-3.5 px-1">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-content-tertiary"><Globe className="h-4 w-4" /></div>
                <div>
                  <p className="text-sm font-medium text-content-primary">Language</p>
                  <p className="text-xs text-content-tertiary mt-0.5">Choose your preferred language</p>
                </div>
              </div>
              <span className="text-sm font-medium text-content-secondary bg-surface-muted px-3 py-1 rounded-lg">English</span>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="px-5 py-2">
          <div className="flex items-center gap-3 py-3 border-b border-stone-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600"><Shield className="h-5 w-5" /></div>
            <h3 className="text-base font-semibold text-content-primary">Account & Privacy</h3>
          </div>
          <div className="py-4 px-1 space-y-3">
            <p className="text-sm text-content-secondary leading-relaxed">Your health data is encrypted and stored securely. We never share personal medical information.</p>
            <div className="flex flex-wrap gap-2">
              <a href="/privacy" className="text-xs font-medium text-primary-600 hover:text-primary-700 underline underline-offset-2">Privacy Policy</a>
              <span className="text-content-tertiary">•</span>
              <a href="/terms" className="text-xs font-medium text-primary-600 hover:text-primary-700 underline underline-offset-2">Terms of Service</a>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <p className="text-center text-xs text-content-tertiary">MedAI v1.0.0 • Made with ❤️ for better healthcare</p>
      </motion.div>
    </div>
  );
}

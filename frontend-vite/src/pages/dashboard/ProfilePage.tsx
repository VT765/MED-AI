import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Edit3,
  Save,
  X,
  Heart,
  Activity,
  Weight,
  Ruler,
  Zap,
  ChevronDown,
  ChevronUp,
  Shield,
  Clock,
  TrendingUp,
  AlertTriangle,
  Check,
  Info,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getAuthToken } from "@/lib/auth";
import { apiUrl } from "@/lib/api";
import { getProfile, saveProfile } from "@/lib/profile";
import type { ProfileResponse, HealthCondition } from "@/lib/profile";

/* ── Types ─────────────────────────────────────────────── */

interface AccountData {
  id: string;
  username: string | null;
  phone: string;
  email?: string;
  authProvider: string;
  profileComplete: boolean;
  createdAt: string;
}

const CONDITION_LABELS: Record<string, string> = {
  diabetes: "Diabetes",
  hypertension: "Hypertension",
  asthma: "Asthma",
  thyroid: "Thyroid Disorder",
  heartDisease: "Heart Disease",
  otherConditions: "Other Conditions",
  allergies: "Allergies",
  medications: "Current Medications",
  surgeries: "Past Surgeries",
  familyHistory_diabetes: "Family: Diabetes",
  familyHistory_hypertension: "Family: Hypertension",
  familyHistory_heartDisease: "Family: Heart Disease",
  familyHistory_cancer: "Family: Cancer",
  familyHistory_asthma: "Family: Asthma",
  familyHistory_other: "Family: Other",
};

const ALL_CONDITION_KEYS = Object.keys(CONDITION_LABELS);

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: "Sedentary",
  light: "Lightly Active",
  moderate: "Moderately Active",
  active: "Active",
  very_active: "Very Active",
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];
const ACTIVITY_LEVELS = Object.keys(ACTIVITY_LABELS);

/* ── Helpers ─────────────────────────────────────────── */

function bmiCategory(bmi: number): { label: string; colorClass: string } {
  if (bmi < 18.5) return { label: "Underweight", colorClass: "text-sky-600" };
  if (bmi < 25) return { label: "Normal", colorClass: "text-emerald-600" };
  if (bmi < 30) return { label: "Overweight", colorClass: "text-amber-600" };
  return { label: "Obese", colorClass: "text-red-600" };
}

function calcBmi(height: string, weight: string): number | null {
  try {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) return parseFloat((w / (h * h)).toFixed(1));
  } catch {}
  return null;
}

/* ── Shared input class ──────────────────────────────── */

const inputCls =
  "w-full rounded-input border border-stone-200 bg-surface-muted px-3 py-2 text-sm text-content-primary placeholder-content-tertiary focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 transition";

/* ── Editable field ──────────────────────────────────── */

function EditableField({
  label,
  value,
  editMode,
  type = "text",
  options,
  onEdit,
}: {
  label: string;
  value: string;
  editMode: boolean;
  type?: "text" | "date" | "select" | "tel" | "number";
  options?: string[];
  onEdit: (val: string) => void;
}) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-content-tertiary">
        {label}
      </p>
      {!editMode ? (
        <p className={cn("text-sm font-medium", value ? "text-content-primary" : "italic text-content-tertiary")}>
          {value || "Not set"}
        </p>
      ) : type === "select" && options ? (
        <select value={value} onChange={(e) => onEdit(e.target.value)} className={inputCls}>
          <option value="">-- Select --</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={(e) => onEdit(e.target.value)} className={inputCls} />
      )}
    </div>
  );
}

/* ── Health condition toggle ─────────────────────────── */

function HealthConditionToggle({
  label,
  condition,
  editMode,
  onChange,
}: {
  label: string;
  condition: HealthCondition;
  editMode: boolean;
  onChange: (field: "yes" | "details", val: any) => void;
}) {
  if (!editMode) {
    if (!condition.yes) return null;
    return (
      <div className="flex items-start gap-2.5 rounded-card border border-red-100 bg-red-50 px-3.5 py-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
        <div>
          <p className="text-xs font-semibold text-red-700">{label}</p>
          {condition.details && (
            <p className="mt-0.5 text-xs text-red-500">{condition.details}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-stone-200 bg-surface p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-content-primary">{label}</span>
        <button
          type="button"
          onClick={() => onChange("yes", !condition.yes)}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
            condition.yes ? "border-primary-500 bg-primary-500" : "border-stone-300 bg-stone-200"
          )}
        >
          <span
            className={cn(
              "ml-[1px] mt-[1px] inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200",
              condition.yes ? "translate-x-4" : "translate-x-0"
            )}
          />
        </button>
      </div>
      <AnimatePresence>
        {condition.yes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            <input
              type="text"
              placeholder="Add details (optional)…"
              value={condition.details}
              onChange={(e) => onChange("details", e.target.value)}
              className={cn(inputCls, "mt-2 text-xs")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Section heading ─────────────────────────────────── */

function SectionHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-sm font-semibold text-content-primary">{title}</h3>
    </div>
  );
}

/* ── Detail tile (highlight grid) ───────────────────── */

function DetailTile({
  icon: Icon,
  label,
  value,
  muted,
  iconCls,
  editContent,
  editMode,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  muted?: boolean;
  iconCls: string;
  editContent?: React.ReactNode;
  editMode: boolean;
}) {
  return (
    <Card className="flex items-center gap-4 px-5 py-4 transition-all hover:shadow-card">
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", iconCls)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-content-tertiary">
          {label}
        </p>
        {editMode && editContent ? (
          <div className="mt-1">{editContent}</div>
        ) : (
          <p className={cn("mt-0.5 truncate text-sm font-medium", muted ? "italic text-content-tertiary" : "text-content-primary")}>
            {value}
          </p>
        )}
      </div>
    </Card>
  );
}

/* ── Metric chip ─────────────────────────────────────── */

function MetricChip({
  icon: Icon,
  label,
  value,
  unit,
  iconCls,
  editMode,
  onEdit,
  inputType = "text",
  options,
  displayMap,
}: {
  icon: React.ElementType;
  label: string;
  value: string | undefined;
  unit?: string;
  iconCls: string;
  editMode: boolean;
  onEdit: (v: string) => void;
  inputType?: "text" | "number" | "select";
  options?: string[];
  displayMap?: Record<string, string>;
}) {
  const display = displayMap && value ? (displayMap[value] ?? value) : value;

  return (
    <Card className="flex flex-col gap-1.5 px-4 py-4 transition-all hover:shadow-card">
      <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconCls)}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-content-tertiary">{label}</p>
      {editMode ? (
        inputType === "select" && options ? (
          <select value={value || ""} onChange={(e) => onEdit(e.target.value)} className={cn(inputCls, "text-xs")}>
            <option value="">-- Select --</option>
            {options.map((o) => (
              <option key={o} value={o}>{displayMap ? displayMap[o] : o}</option>
            ))}
          </select>
        ) : (
          <input
            type={inputType}
            value={value || ""}
            onChange={(e) => onEdit(e.target.value)}
            placeholder={unit ? `0 ${unit}` : "—"}
            className={cn(inputCls, "text-xs")}
          />
        )
      ) : (
        <p className="text-base font-bold text-content-primary">
          {display ? (
            <>
              {display}
              {unit && <span className="ml-1 text-xs font-medium text-content-tertiary">{unit}</span>}
            </>
          ) : (
            <span className="text-xs italic font-normal text-content-tertiary">Not set</span>
          )}
        </p>
      )}
    </Card>
  );
}

/* ── Main page ────────────────────────────────────────── */

export function ProfilePage() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [healthProfile, setHealthProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Editable values
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editBloodGroup, setEditBloodGroup] = useState("");
  const [editHeight, setEditHeight] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editActivity, setEditActivity] = useState("");
  const [editConditions, setEditConditions] = useState<Record<string, HealthCondition>>({});

  const [healthExpanded, setHealthExpanded] = useState(true);
  const [conditionsExpanded, setConditionsExpanded] = useState(false);

  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const token = getAuthToken();
        const [accRes, healthRes] = await Promise.all([
          fetch(apiUrl("/api/auth/me"), { headers: { Authorization: `Bearer ${token}` } }),
          getProfile().catch(() => null),
        ]);
        const accData = await accRes.json();
        if (!accRes.ok) throw new Error(accData.message || "Failed to load profile");
        setAccount(accData.user);
        setHealthProfile(healthRes);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  function enterEditMode() {
    setEditName(healthProfile?.fullName || account?.username || "");
    setEditPhone(healthProfile?.phone || account?.phone || "");
    setEditDob(healthProfile?.dob || "");
    setEditGender(healthProfile?.gender || "");
    setEditBloodGroup(healthProfile?.bloodGroup || "");
    setEditHeight(healthProfile?.height || "");
    setEditWeight(healthProfile?.weight || "");
    setEditActivity(healthProfile?.activityLevel || "");
    const conds: Record<string, HealthCondition> = {};
    ALL_CONDITION_KEYS.forEach((k) => {
      conds[k] = healthProfile?.conditions?.[k] || { yes: false, details: "" };
    });
    setEditConditions(conds);
    setSaveError(null);
    setEditMode(true);
    setConditionsExpanded(true);
    setHealthExpanded(true);
  }

  function cancelEdit() {
    setEditMode(false);
    setSaveError(null);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      const result = await saveProfile({
        fullName: editName,
        phone: editPhone,
        dob: editDob,
        gender: editGender,
        bloodGroup: editBloodGroup,
        height: editHeight,
        weight: editWeight,
        activityLevel: editActivity,
        conditions: editConditions,
      });
      setHealthProfile(result.profile);
      setAccount((prev) =>
        prev ? { ...prev, username: editName || prev.username, phone: editPhone || prev.phone } : prev
      );
      setEditMode(false);
      setSaveSuccess(true);
      if (successTimer.current) clearTimeout(successTimer.current);
      successTimer.current = setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  /* ── Error ── */
  if (error || !account) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-content-secondary">{error || "Unable to load profile"}</p>
      </div>
    );
  }

  /* ── Derived values ── */
  const displayName = healthProfile?.fullName || account.username || "New User";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0].toUpperCase())
    .join("") || account.phone.slice(-2);

  const memberSince = new Date(account.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const bmiVal = healthProfile?.bmi ? parseFloat(healthProfile.bmi) : null;
  const bmiLive = editMode ? calcBmi(editHeight, editWeight) : null;
  const activeBmi = editMode ? bmiLive : bmiVal;
  const bmiInfo = activeBmi ? bmiCategory(activeBmi) : null;
  const profileCompletePct = healthProfile?.profileComplete || 0;
  const activeConditions = ALL_CONDITION_KEYS.filter((k) => healthProfile?.conditions?.[k]?.yes);

  return (
    <div className="space-y-8">

      {/* ── Page heading ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-content-primary">My Profile</h2>
            <p className="mt-1 text-content-secondary">Your account details and health information.</p>
          </div>
          {/* Edit / Save / Cancel */}
          <div className="flex gap-2 shrink-0">
            {!editMode ? (
              <button
                onClick={enterEditMode}
                className="flex items-center gap-2 rounded-button border border-stone-200 bg-surface-elevated px-4 py-2 text-sm font-semibold text-content-primary shadow-soft transition hover:border-primary-300 hover:text-primary-700 hover:shadow-card"
              >
                <Edit3 className="h-4 w-4" /> Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={cancelEdit}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-button border border-stone-200 bg-surface-elevated px-4 py-2 text-sm font-semibold text-content-secondary transition hover:bg-surface-muted"
                >
                  <X className="h-4 w-4" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-button bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Success toast */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 flex items-center gap-2.5 rounded-card border border-emerald-200 bg-emerald-50 px-4 py-3"
            >
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <p className="text-sm font-medium text-emerald-700">Profile saved successfully!</p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {saveError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-center gap-2.5 rounded-card border border-red-200 bg-red-50 px-4 py-3"
            >
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{saveError}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Profile banner card ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="overflow-hidden px-6 py-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-xl font-bold text-primary-700">
                {initials}
              </div>
              {/* Name + badges */}
              <div>
                <h3 className="text-lg font-semibold text-content-primary">{displayName}</h3>
                <p className="mt-0.5 text-sm text-content-secondary">{account.email || account.phone}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profileCompletePct >= 80 ? (
                    <Badge className="gap-1.5 border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" /> {profileCompletePct}% Complete
                    </Badge>
                  ) : (
                    <Badge className="gap-1.5 border-amber-200 bg-amber-50 px-2.5 py-0.5 text-amber-700">
                      <AlertCircle className="h-3 w-3" /> {profileCompletePct}% Complete
                    </Badge>
                  )}
                  {activeConditions.length > 0 && (
                    <Badge className="gap-1.5 border-red-200 bg-red-50 px-2.5 py-0.5 text-red-700">
                      <Heart className="h-3 w-3" /> {activeConditions.length} health flag{activeConditions.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                  <Badge className="gap-1.5 border-stone-200 bg-surface-muted px-2.5 py-0.5 text-content-secondary">
                    <Shield className="h-3 w-3" /> Verified Member
                  </Badge>
                </div>
              </div>
            </div>

            {/* Profile strength */}
            <div className="min-w-[180px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-content-tertiary">Profile Strength</span>
                <span className="text-xs font-semibold text-content-primary">{profileCompletePct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletePct}%` }}
                  transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
                    profileCompletePct >= 80 ? "bg-emerald-500" : profileCompletePct >= 50 ? "bg-amber-500" : "bg-red-400"
                  )}
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ── Account Highlights (4 tiles) ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <SectionHeading icon={UserIcon} title="Account Highlights" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DetailTile icon={UserIcon} label="Full Name"
            value={healthProfile?.fullName || account.username || "Not set"}
            muted={!healthProfile?.fullName && !account.username}
            iconCls="bg-primary-100 text-primary-600"
            editMode={editMode}
            editContent={
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                placeholder="Your full name" className={inputCls} />
            }
          />
          <DetailTile icon={Phone} label="Phone Number"
            value={account.phone}
            iconCls="bg-green-100 text-green-600"
            editMode={editMode}
            editContent={
              <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)}
                placeholder="Phone number" className={inputCls} />
            }
          />
          <DetailTile icon={Mail} label="Email Address"
            value={account.email || "Not set"}
            muted={!account.email}
            iconCls="bg-sky-100 text-sky-600"
            editMode={false}
          />
          <DetailTile icon={Clock} label="Member Since"
            value={memberSince}
            iconCls="bg-purple-100 text-purple-600"
            editMode={false}
          />
        </div>
      </motion.div>

      {/* ── Body Metrics ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <SectionHeading icon={TrendingUp} title="Body Metrics" />
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {/* BMI card */}
          <Card className="col-span-2 sm:col-span-3 lg:col-span-2 px-5 py-4 flex items-center gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-content-tertiary">BMI Index</p>
              <p className="text-3xl font-bold text-content-primary leading-tight">
                {activeBmi ?? "—"}
              </p>
              {bmiInfo ? (
                <p className={cn("text-xs font-semibold", bmiInfo.colorClass)}>{bmiInfo.label}</p>
              ) : (
                <p className="text-xs text-content-tertiary">Set height & weight to calculate</p>
              )}
            </div>
          </Card>

          <MetricChip icon={Ruler} label="Height" value={editMode ? editHeight : healthProfile?.height} unit="cm" iconCls="bg-sky-100 text-sky-600" editMode={editMode} onEdit={setEditHeight} inputType="number" />
          <MetricChip icon={Weight} label="Weight" value={editMode ? editWeight : healthProfile?.weight} unit="kg" iconCls="bg-violet-100 text-violet-600" editMode={editMode} onEdit={setEditWeight} inputType="number" />
          <MetricChip icon={Zap} label="Activity" value={editMode ? editActivity : (ACTIVITY_LABELS[healthProfile?.activityLevel || ""] || healthProfile?.activityLevel)} iconCls="bg-amber-100 text-amber-600" editMode={editMode} onEdit={setEditActivity} inputType="select" options={ACTIVITY_LEVELS} displayMap={ACTIVITY_LABELS} />
        </div>
      </motion.div>

      {/* ── Personal Details ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="px-5 py-5">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-content-primary">Personal Details</h3>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <EditableField label="Date of Birth" value={editMode ? editDob : (healthProfile?.dob || "")} editMode={editMode} type="date" onEdit={setEditDob} />
            <EditableField label="Gender" value={editMode ? editGender : (healthProfile?.gender || "")} editMode={editMode} type="select" options={GENDERS} onEdit={setEditGender} />
            <EditableField label="Blood Group" value={editMode ? editBloodGroup : (healthProfile?.bloodGroup || "")} editMode={editMode} type="select" options={BLOOD_GROUPS} onEdit={setEditBloodGroup} />
          </div>
        </Card>
      </motion.div>

      {/* ── Health Details ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="overflow-hidden">
          {/* Collapsible header */}
          <button
            type="button"
            onClick={() => setHealthExpanded((v) => !v)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-surface-muted"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-content-primary">Health Details</h3>
                <p className="text-xs text-content-tertiary">
                  {activeConditions.length > 0
                    ? `${activeConditions.length} reported condition${activeConditions.length > 1 ? "s" : ""}`
                    : "No conditions reported"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {activeConditions.length > 0 && (
                <Badge className="border-red-200 bg-red-50 text-red-700">{activeConditions.length}</Badge>
              )}
              {healthExpanded ? <ChevronUp className="h-4 w-4 text-content-tertiary" /> : <ChevronDown className="h-4 w-4 text-content-tertiary" />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {healthExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="border-t border-stone-100 px-5 pb-5">
                  {/* Read-only view */}
                  {!editMode && (
                    <div className="pt-4">
                      {activeConditions.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-8 text-center">
                          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                          <p className="text-sm font-medium text-content-primary">No conditions reported</p>
                          <p className="text-xs text-content-tertiary">Your health questionnaire shows no flagged conditions.</p>
                          <button
                            onClick={enterEditMode}
                            className="mt-2 rounded-button border border-primary-200 bg-primary-50 px-4 py-1.5 text-xs font-semibold text-primary-700 transition hover:bg-primary-100"
                          >
                            Fill in Health Details
                          </button>
                        </div>
                      ) : (
                        <div className="grid gap-2 sm:grid-cols-2">
                          {activeConditions.map((k) => (
                            <HealthConditionToggle
                              key={k}
                              label={CONDITION_LABELS[k]}
                              condition={healthProfile!.conditions![k]}
                              editMode={false}
                              onChange={() => {}}
                            />
                          ))}
                        </div>
                      )}

                      {/* Incomplete questionnaire prompt */}
                      {ALL_CONDITION_KEYS.length - activeConditions.length > 0 && (
                        <div className="mt-4 flex items-start gap-2.5 rounded-card border border-sky-100 bg-sky-50 px-4 py-3">
                          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                          <div>
                            <p className="text-xs font-semibold text-sky-700">
                              {ALL_CONDITION_KEYS.length - activeConditions.length} unanswered questionnaire items
                            </p>
                            <p className="mt-0.5 text-xs text-sky-600">
                              Complete your health questionnaire for better AI-powered recommendations.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Edit mode — full questionnaire */}
                  {editMode && (
                    <div className="pt-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-content-primary">Health Questionnaire</p>
                        <button
                          type="button"
                          onClick={() => setConditionsExpanded((v) => !v)}
                          className="flex items-center gap-1 rounded-full border border-stone-200 bg-surface-muted px-3 py-1 text-xs font-medium text-content-secondary transition hover:bg-surface"
                        >
                          {conditionsExpanded ? "Collapse" : "Expand all"}
                          {conditionsExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                      </div>

                      <AnimatePresence initial={false}>
                        {conditionsExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-content-tertiary">Personal Conditions</p>
                            <div className="grid gap-2 sm:grid-cols-2 mb-4">
                              {["diabetes","hypertension","asthma","thyroid","heartDisease","otherConditions","allergies","medications","surgeries"].map((k) => (
                                <HealthConditionToggle key={k} label={CONDITION_LABELS[k]}
                                  condition={editConditions[k] || { yes: false, details: "" }}
                                  editMode={true}
                                  onChange={(field, val) => setEditConditions((prev) => ({ ...prev, [k]: { ...prev[k], [field]: val } }))} />
                              ))}
                            </div>
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-content-tertiary">Family History</p>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {["familyHistory_diabetes","familyHistory_hypertension","familyHistory_heartDisease","familyHistory_cancer","familyHistory_asthma","familyHistory_other"].map((k) => (
                                <HealthConditionToggle key={k} label={CONDITION_LABELS[k]}
                                  condition={editConditions[k] || { yes: false, details: "" }}
                                  editMode={true}
                                  onChange={(field, val) => setEditConditions((prev) => ({ ...prev, [k]: { ...prev[k], [field]: val } }))} />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}

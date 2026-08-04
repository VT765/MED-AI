import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle, SkipForward, Activity, User, HeartPulse, FileText, Loader2 } from "lucide-react";

import { saveProfile } from "@/lib/profile";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// --- Types ---
type OnboardingData = {
  // Step 1
  fullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  // Step 2
  height: string; // cm
  weight: string; // kg
  activityLevel: string;
  // Step 3
  conditions: Record<string, { yes: boolean; details: string }>;
};

const initialData: OnboardingData = {
  fullName: "", dob: "", gender: "", bloodGroup: "", phone: "",
  height: "", weight: "", activityLevel: "",
  conditions: {
    diabetes: { yes: false, details: "" },
    hypertension: { yes: false, details: "" },
    heartConditions: { yes: false, details: "" },
    allergies: { yes: false, details: "" },
    medications: { yes: false, details: "" },
    surgeries: { yes: false, details: "" },
    smoker: { yes: false, details: "" },
    alcohol: { yes: false, details: "" },
    exercise: { yes: false, details: "" },
    familyHistory: { yes: false, details: "" },
  }
};

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Physical Info", icon: Activity },
  { id: 3, title: "Health Profile", icon: HeartPulse },
  { id: 4, title: "Review", icon: FileText },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const updateData = (fields: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const updateCondition = (key: keyof OnboardingData['conditions'], field: 'yes' | 'details', value: any) => {
    setData(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [key]: {
          ...prev.conditions[key],
          [field]: value
        }
      }
    }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleComplete = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await saveProfile(data);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Profile save error:", err);
      setSaveError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  const calculateBMI = () => {
    if (!data.height || !data.weight) return null;
    const h = parseFloat(data.height) / 100;
    const w = parseFloat(data.weight);
    if (h > 0 && w > 0) return (w / (h * h)).toFixed(1);
    return null;
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col pt-12 pb-24 px-4 sm:px-6">
      
      <div className="w-full max-w-3xl mx-auto flex justify-between items-center mb-8">
         <h1 className="text-2xl font-bold text-primary-700">MedAI Setup</h1>
         <Button variant="ghost" onClick={handleSkip} className="text-content-secondary hover:text-content-primary">
           Skip for Now <SkipForward className="ml-2 h-4 w-4" />
         </Button>
      </div>

      <div className="w-full max-w-3xl mx-auto mb-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border/50 rounded-full z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-500 rounded-full z-0 transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                  isCompleted ? "bg-primary-500 border-primary-500 text-white" : 
                  isCurrent ? "bg-white border-primary-500 text-primary-600 shadow-md" : 
                  "bg-white border-border/50 text-content-tertiary"
                )}>
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : <step.icon className="h-4 w-4" />}
                </div>
                <span className={cn("text-xs font-medium hidden sm:block", isCurrent ? "text-primary-700" : "text-content-tertiary")}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Card className="shadow-lg border-border/40 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-border/30 bg-surface-50/50 pb-6 rounded-t-xl">
                <CardTitle className="text-2xl">{steps[currentStep-1].title}</CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Let's start with some basic information about you."}
                  {currentStep === 2 && "This helps us tailor health insights to your body type."}
                  {currentStep === 3 && "A quick health check to understand your medical background."}
                  {currentStep === 4 && "Review your information before completing the setup."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                
                {/* STEP 1 */}
                {currentStep === 1 && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" value={data.fullName} onChange={e => updateData({fullName: e.target.value})} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" value={data.dob} onChange={e => updateData({dob: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <select id="gender" value={data.gender} onChange={e => updateData({gender: e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group (Optional)</Label>
                      <select id="bloodGroup" value={data.bloodGroup} onChange={e => updateData({bloodGroup: e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="">Select blood group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input id="phone" type="tel" value={data.phone} onChange={e => updateData({phone: e.target.value})} placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input id="height" type="number" placeholder="175" value={data.height} onChange={e => updateData({height: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input id="weight" type="number" placeholder="70" value={data.weight} onChange={e => updateData({weight: e.target.value})} />
                      </div>
                    </div>
                    
                    {calculateBMI() && (
                       <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-primary-50 p-4 rounded-lg flex items-center justify-between border border-primary-100">
                          <div>
                            <p className="text-sm text-primary-700 font-medium">Calculated BMI</p>
                            <p className="text-xs text-primary-600/80 mt-1">Body Mass Index based on height and weight</p>
                          </div>
                          <div className="text-2xl font-bold text-primary-800">
                             {calculateBMI()}
                          </div>
                       </motion.div>
                    )}

                    <div className="space-y-3">
                      <Label>Activity Level</Label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
                          { id: 'lightly', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
                          { id: 'moderately', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
                          { id: 'very', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
                        ].map(level => (
                          <div 
                            key={level.id}
                            onClick={() => updateData({activityLevel: level.id})}
                            className={cn(
                              "border rounded-xl p-4 cursor-pointer transition-all",
                              data.activityLevel === level.id 
                                ? "border-primary-500 bg-primary-50/50 shadow-sm" 
                                : "border-border/60 hover:border-border hover:bg-surface-50"
                            )}
                          >
                             <p className="font-medium text-content-primary mb-1">{level.label}</p>
                             <p className="text-xs text-content-tertiary">{level.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                     {[
                       { key: 'diabetes', label: 'Do you have diabetes?' },
                       { key: 'hypertension', label: 'Do you have high blood pressure?' },
                       { key: 'heartConditions', label: 'Do you have any heart-related conditions?' },
                       { key: 'allergies', label: 'Do you have any allergies?' },
                       { key: 'medications', label: 'Are you currently taking any medications?' },
                       { key: 'surgeries', label: 'Have you had any major surgeries?' },
                       { key: 'smoker', label: 'Do you smoke?' },
                       { key: 'alcohol', label: 'Do you consume alcohol?' },
                       { key: 'familyHistory', label: 'Any family history of diabetes, hypertension, or heart disease?' },
                     ].map(q => (
                       <div key={q.key} className="border-b border-border/40 pb-5 last:border-0 last:pb-0">
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                           <Label className="text-sm font-medium text-content-primary leading-relaxed sm:max-w-[70%]">{q.label}</Label>
                           <div className="flex items-center gap-2 shrink-0">
                             <Checkbox 
                               checked={data.conditions[q.key as keyof OnboardingData['conditions']].yes}
                               onChange={(e) => updateCondition(q.key as any, 'yes', e.target.checked)}
                               id={`condition-${q.key}`}
                               className="h-5 w-5"
                             />
                           </div>
                         </div>
                         <AnimatePresence>
                           {data.conditions[q.key as keyof OnboardingData['conditions']].yes && (
                             <motion.div
                               initial={{ opacity: 0, height: 0, marginTop: 0 }}
                               animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                               exit={{ opacity: 0, height: 0, marginTop: 0 }}
                               className="overflow-hidden"
                             >
                               <Input 
                                 placeholder="Please provide details..." 
                                 value={data.conditions[q.key as keyof OnboardingData['conditions']].details}
                                 onChange={e => updateCondition(q.key as any, 'details', e.target.value)}
                                 className="bg-surface-50 border-primary-100 focus-visible:ring-primary-200"
                               />
                             </motion.div>
                           )}
                         </AnimatePresence>
                       </div>
                     ))}
                  </div>
                )}

                {/* STEP 4 */}
                {currentStep === 4 && (
                  <div className="space-y-8">
                     
                     <div className="bg-surface-50 p-5 rounded-xl border border-border/40 relative">
                        <div className="absolute right-4 top-4">
                           <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)} className="h-8 px-3 text-xs">Edit</Button>
                        </div>
                        <h4 className="font-semibold text-content-primary mb-4 flex items-center gap-2"><User className="h-4 w-4 text-primary-500"/> Personal Info</h4>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                           <div><span className="text-content-tertiary">Name:</span> <span className="font-medium text-content-primary">{data.fullName || '-'}</span></div>
                           <div><span className="text-content-tertiary">DOB:</span> <span className="font-medium text-content-primary">{data.dob || '-'}</span></div>
                           <div><span className="text-content-tertiary">Gender:</span> <span className="font-medium text-content-primary capitalize">{data.gender || '-'}</span></div>
                           <div><span className="text-content-tertiary">Blood:</span> <span className="font-medium text-content-primary">{data.bloodGroup || '-'}</span></div>
                        </div>
                     </div>

                     <div className="bg-surface-50 p-5 rounded-xl border border-border/40 relative">
                        <div className="absolute right-4 top-4">
                           <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)} className="h-8 px-3 text-xs">Edit</Button>
                        </div>
                        <h4 className="font-semibold text-content-primary mb-4 flex items-center gap-2"><Activity className="h-4 w-4 text-primary-500"/> Physical Info</h4>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                           <div><span className="text-content-tertiary">Height:</span> <span className="font-medium text-content-primary">{data.height ? `${data.height} cm` : '-'}</span></div>
                           <div><span className="text-content-tertiary">Weight:</span> <span className="font-medium text-content-primary">{data.weight ? `${data.weight} kg` : '-'}</span></div>
                           <div><span className="text-content-tertiary">BMI:</span> <span className="font-medium text-content-primary">{calculateBMI() || '-'}</span></div>
                           <div><span className="text-content-tertiary">Activity:</span> <span className="font-medium text-content-primary capitalize">{data.activityLevel || '-'}</span></div>
                        </div>
                     </div>
                     
                     <div className="bg-surface-50 p-5 rounded-xl border border-border/40 relative">
                        <div className="absolute right-4 top-4">
                           <Button variant="outline" size="sm" onClick={() => setCurrentStep(3)} className="h-8 px-3 text-xs">Edit</Button>
                        </div>
                        <h4 className="font-semibold text-content-primary mb-4 flex items-center gap-2"><HeartPulse className="h-4 w-4 text-primary-500"/> Health Profile</h4>
                        <div className="text-sm space-y-2">
                           {Object.entries(data.conditions).filter(([_, v]) => v.yes).length === 0 ? (
                              <p className="text-content-secondary italic">No notable health conditions reported.</p>
                           ) : (
                              <ul className="list-disc list-inside space-y-1 text-content-secondary">
                                 {Object.entries(data.conditions).map(([k, v]) => {
                                    if (!v.yes) return null;
                                    const label = k.charAt(0).toUpperCase() + k.slice(1);
                                    return (
                                       <li key={k}>
                                          <span className="font-medium text-content-primary">{label}</span>
                                          {v.details && <span className="text-content-tertiary"> - {v.details}</span>}
                                       </li>
                                    );
                                 })}
                              </ul>
                           )}
                        </div>
                     </div>

                  </div>
                )}
              </CardContent>
              <div className="p-6 sm:p-8 pt-0 border-t border-border/30 bg-surface-50/30 rounded-b-xl flex flex-col gap-3 mt-6">
                {saveError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {saveError}
                  </div>
                )}
                <div className="flex items-center justify-between">
                <Button 
                   variant="outline" 
                   onClick={prevStep} 
                   disabled={currentStep === 1 || saving}
                   className={cn(currentStep === 1 ? "invisible" : "")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                
                {currentStep < steps.length ? (
                   <Button onClick={nextStep} className="px-8 shadow-sm">
                     Continue <ArrowRight className="ml-2 h-4 w-4" />
                   </Button>
                ) : (
                   <Button onClick={handleComplete} disabled={saving} className="px-8 bg-green-600 hover:bg-green-700 shadow-sm text-white">
                     {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <>Complete Setup <CheckCircle className="ml-2 h-4 w-4" /></>}
                   </Button>
                )}
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

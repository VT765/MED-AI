import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle, SkipForward, ShieldCheck, HeartPulse, Stethoscope, Droplets, Activity, FileText, User } from "lucide-react";

import { saveProfile } from "@/lib/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TagInput } from "@/components/ui/tag-input";

type OnboardingData = {
  fullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  height: string;
  weight: string;
  activityLevel: string;
  conditions: Record<string, { yes: boolean; details: string }>;
};

const initialData: OnboardingData = {
  fullName: "", dob: "", gender: "", bloodGroup: "", phone: "",
  height: "", weight: "", activityLevel: "",
  conditions: {
    diabetes: { yes: false, details: "" },
    hypertension: { yes: false, details: "" },
    asthma: { yes: false, details: "" },
    thyroid: { yes: false, details: "" },
    heartDisease: { yes: false, details: "" },
    otherConditions: { yes: false, details: "" },
    allergies: { yes: false, details: "" },
    medications: { yes: false, details: "" },
    surgeries: { yes: false, details: "" },
    familyHistory_diabetes: { yes: false, details: "" },
    familyHistory_hypertension: { yes: false, details: "" },
    familyHistory_heartDisease: { yes: false, details: "" },
    familyHistory_cancer: { yes: false, details: "" },
    familyHistory_asthma: { yes: false, details: "" },
    familyHistory_other: { yes: false, details: "" },
  }
};

export function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const totalSteps = 8;

  const updateData = (fields: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const updateCondition = (key: string, field: 'yes' | 'details', value: any) => {
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

  const toggleConditionYes = (key: string) => {
    const isYes = data.conditions[key]?.yes || false;
    updateCondition(key, 'yes', !isYes);
  };

  const setConditionYes = (key: string, value: boolean) => {
    updateCondition(key, 'yes', value);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const handleSkip = () => navigate("/dashboard");

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

  const renderProgressBar = () => (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        {currentStep > 1 ? (
          <button onClick={prevStep} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : <div className="w-5 h-5"></div>}
        <span className="text-sm font-medium text-gray-500">{currentStep} of {totalSteps}</span>
      </div>
      <div className="h-1 w-full bg-teal-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-teal-500 transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-8 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
             <div className="flex gap-1 text-teal-600">
                <ShieldCheck className="w-6 h-6" />
                <span className="font-bold text-lg">MedAI</span>
             </div>
          </div>

          {currentStep > 1 && renderProgressBar()}

          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {/* Step 1: Welcome */}
                {currentStep === 1 && (
                  <div className="flex flex-col h-full">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      Let's understand <br/><span className="text-teal-600">you better</span>
                    </h1>
                    <p className="text-gray-500 mb-8 max-w-xs">
                      Please share your medical history to help our AI and doctors provide personalized care.
                    </p>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-64 h-64 bg-teal-50 rounded-full flex items-center justify-center relative">
                        <FileText className="w-24 h-24 text-teal-300" />
                        <div className="absolute bottom-4 right-4 bg-teal-500 p-3 rounded-full text-white shadow-lg">
                          <HeartPulse className="w-8 h-8" />
                        </div>
                      </div>
                    </div>
                    <Button onClick={nextStep} className="w-full bg-teal-600 hover:bg-teal-700 text-lg h-14 rounded-xl mt-8">
                      Start <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <div className="mt-4 flex justify-center items-center text-sm text-gray-500 gap-2">
                      <ShieldCheck className="w-4 h-4 text-teal-500" /> Your data is secure and private
                    </div>
                  </div>
                )}

                {/* Step 2: Basic Info */}
                {currentStep === 2 && (
                  <div className="flex flex-col h-full items-center text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">1. Basic Information</h2>
                    <p className="text-gray-500 mb-10">Let's start with some basics</p>

                    <div className="w-full max-w-sm space-y-8 text-left">
                      <div className="space-y-3">
                        <Label className="text-gray-700 font-medium">What is your age?</Label>
                        <Input 
                          type="number" 
                          placeholder="e.g. 25" 
                          value={data.dob} // Reusing dob field for age for simplicity, or we can use dob as year
                          onChange={(e) => updateData({ dob: e.target.value })}
                          className="h-12 rounded-xl border-gray-200"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-gray-700 font-medium">What is your gender?</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {['Male', 'Female', 'Other'].map((g) => (
                            <button
                              key={g}
                              onClick={() => updateData({ gender: g })}
                              className={cn(
                                "flex items-center justify-center h-12 rounded-xl border font-medium transition-colors",
                                data.gender === g 
                                  ? "border-teal-500 bg-teal-50 text-teal-700" 
                                  : "border-gray-200 text-gray-600 hover:border-teal-200"
                              )}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto w-full pt-10">
                      <Button onClick={nextStep} className="w-full bg-teal-600 hover:bg-teal-700 h-12 rounded-xl text-lg">
                        Next <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <button onClick={handleSkip} className="mt-4 text-teal-600 font-medium text-sm hover:underline">
                        Skip for now
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Existing Conditions */}
                {currentStep === 3 && (
                  <div className="flex flex-col h-full items-center text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">2. Existing Conditions</h2>
                    <p className="text-gray-500 mb-8">Do you have any diagnosed medical conditions?</p>

                    <div className="w-full max-w-md grid grid-cols-2 gap-3 mb-6">
                      {[
                        { id: 'diabetes', label: 'Diabetes', icon: Droplets },
                        { id: 'hypertension', label: 'Hypertension', icon: Activity },
                        { id: 'asthma', label: 'Asthma', icon: HeartPulse },
                        { id: 'thyroid', label: 'Thyroid', icon: Stethoscope },
                        { id: 'heartDisease', label: 'Heart Disease', icon: HeartPulse },
                        { id: 'otherConditions', label: 'Other', icon: FileText },
                      ].map((cond) => (
                        <button
                          key={cond.id}
                          onClick={() => toggleConditionYes(cond.id)}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                            data.conditions[cond.id]?.yes 
                              ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm" 
                              : "border-gray-200 text-gray-600 hover:border-teal-200"
                          )}
                        >
                          <cond.icon className={cn("w-5 h-5", data.conditions[cond.id]?.yes ? "text-teal-600" : "text-teal-400")} />
                          <span className="font-medium text-sm">{cond.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="w-full max-w-md text-left">
                      <Label className="text-gray-500 text-sm mb-2 block">Anything else we should know?</Label>
                      <Input 
                        placeholder="Please specify" 
                        value={data.conditions.otherConditions?.details || ""}
                        onChange={(e) => updateCondition('otherConditions', 'details', e.target.value)}
                        className="h-12 rounded-xl border-gray-200"
                      />
                    </div>

                    <div className="mt-auto w-full pt-10">
                      <Button onClick={nextStep} className="w-full bg-teal-600 hover:bg-teal-700 h-12 rounded-xl text-lg">
                        Next <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <button onClick={handleSkip} className="mt-4 text-teal-600 font-medium text-sm hover:underline">
                        Skip for now
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Allergies */}
                {currentStep === 4 && (
                  <div className="flex flex-col h-full items-center text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">3. Allergies</h2>
                    <p className="text-gray-500 mb-8">Are you allergic to any substance, medication or food?</p>

                    <div className="w-full max-w-md space-y-3 mb-8">
                      <button
                        onClick={() => setConditionYes('allergies', false)}
                        className={cn(
                          "w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                          !data.conditions.allergies?.yes 
                            ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm" 
                            : "border-gray-200 text-gray-600 hover:border-teal-200"
                        )}
                      >
                        <CheckCircle className={cn("w-5 h-5", !data.conditions.allergies?.yes ? "text-teal-600" : "text-gray-300")} />
                        <span className="font-medium text-sm">No known allergies</span>
                      </button>
                      
                      <button
                        onClick={() => setConditionYes('allergies', true)}
                        className={cn(
                          "w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                          data.conditions.allergies?.yes 
                            ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm" 
                            : "border-gray-200 text-gray-600 hover:border-teal-200"
                        )}
                      >
                        <CheckCircle className={cn("w-5 h-5", data.conditions.allergies?.yes ? "text-teal-600" : "text-gray-300")} />
                        <span className="font-medium text-sm">Yes, I have allergies</span>
                      </button>
                    </div>

                    {data.conditions.allergies?.yes && (
                      <div className="w-full max-w-md text-left mb-6">
                        <Label className="text-gray-700 font-medium mb-2 block">Please list your allergies</Label>
                        <TagInput 
                          tags={data.conditions.allergies.details ? data.conditions.allergies.details.split(',').filter(Boolean) : []}
                          setTags={(tags) => updateCondition('allergies', 'details', tags.join(','))}
                          placeholder="E.g. Penicillin, Peanuts, Pollen"
                          className="w-full"
                        />
                      </div>
                    )}

                    <div className="w-full max-w-md bg-teal-50 p-4 rounded-xl flex items-start gap-3 mt-auto mb-6">
                      <ShieldCheck className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-teal-800">This helps us prevent allergic reactions and provide safer care.</p>
                    </div>

                    <div className="w-full">
                      <Button onClick={nextStep} className="w-full bg-teal-600 hover:bg-teal-700 h-12 rounded-xl text-lg">
                        Next <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <button onClick={handleSkip} className="mt-4 text-teal-600 font-medium text-sm hover:underline">
                        Skip for now
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 5: Current Medications */}
                {currentStep === 5 && (
                  <div className="flex flex-col h-full items-center text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">4. Current Medications</h2>
                    <p className="text-gray-500 mb-8">Are you currently taking any medications?</p>

                    <div className="w-full max-w-md space-y-3 mb-8">
                      <button
                        onClick={() => setConditionYes('medications', false)}
                        className={cn(
                          "w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                          !data.conditions.medications?.yes 
                            ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm" 
                            : "border-gray-200 text-gray-600 hover:border-teal-200"
                        )}
                      >
                        <CheckCircle className={cn("w-5 h-5", !data.conditions.medications?.yes ? "text-teal-600" : "text-gray-300")} />
                        <span className="font-medium text-sm">No medications</span>
                      </button>
                      
                      <button
                        onClick={() => setConditionYes('medications', true)}
                        className={cn(
                          "w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                          data.conditions.medications?.yes 
                            ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm" 
                            : "border-gray-200 text-gray-600 hover:border-teal-200"
                        )}
                      >
                        <CheckCircle className={cn("w-5 h-5", data.conditions.medications?.yes ? "text-teal-600" : "text-gray-300")} />
                        <span className="font-medium text-sm">Yes, I'm taking medications</span>
                      </button>
                    </div>

                    {data.conditions.medications?.yes && (
                      <div className="w-full max-w-md text-left mb-6">
                        <Label className="text-gray-700 font-medium mb-2 block">List your medications</Label>
                        <TagInput 
                          tags={data.conditions.medications.details ? data.conditions.medications.details.split(',').filter(Boolean) : []}
                          setTags={(tags) => updateCondition('medications', 'details', tags.join(','))}
                          placeholder="E.g. Metformin, Paracetamol"
                          className="w-full"
                        />
                      </div>
                    )}

                    <div className="mt-auto w-full pt-10">
                      <Button onClick={nextStep} className="w-full bg-teal-600 hover:bg-teal-700 h-12 rounded-xl text-lg">
                        Next <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <button onClick={handleSkip} className="mt-4 text-teal-600 font-medium text-sm hover:underline">
                        Skip for now
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 6: Past Surgeries */}
                {currentStep === 6 && (
                  <div className="flex flex-col h-full items-center text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">5. Past Surgeries</h2>
                    <p className="text-gray-500 mb-8">Have you had any surgeries in the past?</p>

                    <div className="w-full max-w-md space-y-3 mb-8">
                      <button
                        onClick={() => setConditionYes('surgeries', false)}
                        className={cn(
                          "w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                          !data.conditions.surgeries?.yes 
                            ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm" 
                            : "border-gray-200 text-gray-600 hover:border-teal-200"
                        )}
                      >
                        <CheckCircle className={cn("w-5 h-5", !data.conditions.surgeries?.yes ? "text-teal-600" : "text-gray-300")} />
                        <span className="font-medium text-sm">No past surgeries</span>
                      </button>
                      
                      <button
                        onClick={() => setConditionYes('surgeries', true)}
                        className={cn(
                          "w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                          data.conditions.surgeries?.yes 
                            ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm" 
                            : "border-gray-200 text-gray-600 hover:border-teal-200"
                        )}
                      >
                        <CheckCircle className={cn("w-5 h-5", data.conditions.surgeries?.yes ? "text-teal-600" : "text-gray-300")} />
                        <span className="font-medium text-sm">Yes, I have had surgeries</span>
                      </button>
                    </div>

                    {data.conditions.surgeries?.yes && (
                      <div className="w-full max-w-md text-left mb-6">
                        <Label className="text-gray-700 font-medium mb-2 block">Please list your surgeries</Label>
                        <TagInput 
                          tags={data.conditions.surgeries.details ? data.conditions.surgeries.details.split(',').filter(Boolean) : []}
                          setTags={(tags) => updateCondition('surgeries', 'details', tags.join(','))}
                          placeholder="E.g. Appendectomy, Knee Surgery"
                          className="w-full"
                        />
                      </div>
                    )}

                    <div className="w-full max-w-md bg-teal-50 p-4 rounded-xl flex items-start gap-3 mt-auto mb-6">
                      <ShieldCheck className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-teal-800">Include year if possible, this helps in better analysis.</p>
                    </div>

                    <div className="w-full">
                      <Button onClick={nextStep} className="w-full bg-teal-600 hover:bg-teal-700 h-12 rounded-xl text-lg">
                        Next <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <button onClick={handleSkip} className="mt-4 text-teal-600 font-medium text-sm hover:underline">
                        Skip for now
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 7: Family Medical History */}
                {currentStep === 7 && (
                  <div className="flex flex-col h-full items-center text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">6. Family Medical History</h2>
                    <p className="text-gray-500 mb-8">Do any of your close family members have these conditions?</p>

                    <div className="w-full max-w-md grid grid-cols-3 gap-3 mb-6">
                      {[
                        { id: 'familyHistory_diabetes', label: 'Diabetes', icon: Droplets },
                        { id: 'familyHistory_hypertension', label: 'Hypertension', icon: Activity },
                        { id: 'familyHistory_heartDisease', label: 'Heart Disease', icon: HeartPulse },
                        { id: 'familyHistory_cancer', label: 'Cancer', icon: Activity },
                        { id: 'familyHistory_asthma', label: 'Asthma', icon: HeartPulse },
                        { id: 'familyHistory_none', label: 'None', icon: CheckCircle },
                      ].map((cond) => (
                        <button
                          key={cond.id}
                          onClick={() => {
                            if (cond.id === 'familyHistory_none') {
                                // clear others if none selected
                                setConditionYes('familyHistory_diabetes', false);
                                setConditionYes('familyHistory_hypertension', false);
                                setConditionYes('familyHistory_heartDisease', false);
                                setConditionYes('familyHistory_cancer', false);
                                setConditionYes('familyHistory_asthma', false);
                            } else {
                                toggleConditionYes(cond.id);
                            }
                          }}
                          className={cn(
                            "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all text-center",
                            (cond.id !== 'familyHistory_none' && data.conditions[cond.id]?.yes)
                              ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm" 
                              : "border-gray-200 text-gray-600 hover:border-teal-200"
                          )}
                        >
                          <cond.icon className={cn("w-6 h-6", (cond.id !== 'familyHistory_none' && data.conditions[cond.id]?.yes) ? "text-teal-600" : "text-teal-400")} />
                          <span className="font-medium text-xs">{cond.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="w-full max-w-md text-left">
                      <Label className="text-gray-500 text-sm mb-2 block">Anything else in family history?</Label>
                      <Input 
                        placeholder="Please specify" 
                        value={data.conditions.familyHistory_other?.details || ""}
                        onChange={(e) => updateCondition('familyHistory_other', 'details', e.target.value)}
                        className="h-12 rounded-xl border-gray-200"
                      />
                    </div>

                    <div className="mt-auto w-full pt-10">
                      <Button onClick={nextStep} className="w-full bg-teal-600 hover:bg-teal-700 h-12 rounded-xl text-lg">
                        Next <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <button onClick={handleSkip} className="mt-4 text-teal-600 font-medium text-sm hover:underline">
                        Skip for now
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 8: Review */}
                {currentStep === 8 && (
                  <div className="flex flex-col h-full items-center text-center">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck className="w-8 h-8 text-teal-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">7. Review & Confirm</h2>
                    <p className="text-gray-500 mb-8">Please review your information before we save it.</p>

                    <div className="w-full max-w-md space-y-4 text-sm text-left bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Age</span>
                        <span className="font-medium text-gray-900">{data.dob || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Gender</span>
                        <span className="font-medium text-gray-900">{data.gender || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Conditions</span>
                        <span className="font-medium text-gray-900 text-right">
                          {[
                            data.conditions.diabetes?.yes && 'Diabetes',
                            data.conditions.hypertension?.yes && 'Hypertension',
                            data.conditions.asthma?.yes && 'Asthma',
                            data.conditions.thyroid?.yes && 'Thyroid',
                            data.conditions.heartDisease?.yes && 'Heart Disease',
                          ].filter(Boolean).join(', ') || "None"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Allergies</span>
                        <span className="font-medium text-gray-900 text-right">{data.conditions.allergies?.details || "None"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Medications</span>
                        <span className="font-medium text-gray-900 text-right">{data.conditions.medications?.details || "None"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Past Surgeries</span>
                        <span className="font-medium text-gray-900 text-right">{data.conditions.surgeries?.details || "None"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Family History</span>
                        <span className="font-medium text-gray-900 text-right">
                          {[
                            data.conditions.familyHistory_diabetes?.yes && 'Diabetes',
                            data.conditions.familyHistory_hypertension?.yes && 'Hypertension',
                            data.conditions.familyHistory_cancer?.yes && 'Cancer',
                            data.conditions.familyHistory_heartDisease?.yes && 'Heart Disease',
                            data.conditions.familyHistory_asthma?.yes && 'Asthma',
                          ].filter(Boolean).join(', ') || "None"}
                        </span>
                      </div>
                    </div>
                    
                    {saveError && (
                      <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm mb-4 w-full max-w-md">
                        {saveError}
                      </div>
                    )}

                    <div className="mt-auto w-full">
                      <Button 
                        onClick={handleComplete} 
                        disabled={saving}
                        className="w-full bg-teal-600 hover:bg-teal-700 h-12 rounded-xl text-lg"
                      >
                        {saving ? "Saving..." : "Save & Continue"} <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <div className="mt-4 flex justify-center items-center text-xs text-gray-500 gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-500" /> Your information is safe with us
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Footer Info Section */}
      <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-5 gap-6 text-sm">
        <div className="col-span-1 md:col-span-1 font-medium text-gray-700 pt-1">
          Why we ask these questions?
        </div>
        <div className="col-span-1 md:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex gap-3 items-start">
             <div className="bg-teal-50 p-2 rounded-full text-teal-600 shrink-0">
               <User className="w-5 h-5" />
             </div>
             <div>
               <h4 className="font-semibold text-gray-900">Personalized Care</h4>
               <p className="text-gray-500 text-xs mt-1">Helps provide accurate diagnosis and treatment</p>
             </div>
          </div>
          <div className="flex gap-3 items-start">
             <div className="bg-teal-50 p-2 rounded-full text-teal-600 shrink-0">
               <ShieldCheck className="w-5 h-5" />
             </div>
             <div>
               <h4 className="font-semibold text-gray-900">Safe Treatments</h4>
               <p className="text-gray-500 text-xs mt-1">Helps avoid drug interactions and allergic reactions</p>
             </div>
          </div>
          <div className="flex gap-3 items-start">
             <div className="bg-teal-50 p-2 rounded-full text-teal-600 shrink-0">
               <Activity className="w-5 h-5" />
             </div>
             <div>
               <h4 className="font-semibold text-gray-900">Better Insights</h4>
               <p className="text-gray-500 text-xs mt-1">Understanding your history leads to better outcomes</p>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}

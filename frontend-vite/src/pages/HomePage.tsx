import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  MessageCircle,
  FileText,
  Activity,
  Shield,
  ArrowRight,
  Sparkles,
  User,
  Zap,
  CheckCircle2,
  Lock,
  Brain,
  UploadCloud,
  FileSearch,
  Database,
  Compass,
  Bot
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";
import { AiRobotShowcase } from "@/components/ai/AiRobotShowcase";


export function HomePage() {
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1">
        {/* 1. HERO */}
        <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-32">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/80 via-surface to-surface" />
          <div className="relative mx-auto max-w-5xl text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/80 px-4 py-1.5 text-sm font-medium text-primary-700">
              <Sparkles className="h-4 w-4" aria-hidden />
              Your Health Assistant
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="mt-6 text-4xl font-bold tracking-tight text-content-primary sm:text-5xl lg:text-6xl lg:leading-tight">
              Your AI-Powered <span className="text-primary-600">Medical Companion</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }} className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-content-secondary">
              Chat with an AI medical assistant, understand medical information, and analyze medical reports with personalized context from your medical history.
            </motion.p>
            {mounted && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.24 }} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                {user ? (
                  <>
                    <Link to="/dashboard/chat" className="inline-flex h-12 items-center justify-center gap-2 rounded-button bg-primary-500 px-8 text-base font-semibold text-white shadow-card transition-all hover:bg-primary-600 hover:shadow-cardHover active:scale-[0.98]">
                      <MessageCircle className="h-5 w-5" aria-hidden />
                      Start Chatting
                    </Link>
                    <Link to="/dashboard/reports" className="inline-flex h-12 items-center justify-center gap-2 rounded-button border border-stone-300 bg-white px-8 text-base font-semibold text-content-primary shadow-soft transition-all hover:bg-surface-muted hover:shadow-cardHover active:scale-[0.98]">
                      <FileText className="h-5 w-5" aria-hidden />
                      Analyze Medical Report
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/chat" className="inline-flex h-12 items-center justify-center gap-2 rounded-button bg-primary-500 px-8 text-base font-semibold text-white shadow-card transition-all hover:bg-primary-600 hover:shadow-cardHover active:scale-[0.98]">
                      <MessageCircle className="h-5 w-5" aria-hidden />
                      Continue as Guest
                    </Link>
                    <Link to="/auth/login" className="inline-flex h-12 items-center justify-center gap-2 rounded-button border border-stone-300 bg-white px-8 text-base font-semibold text-content-primary shadow-soft transition-all hover:bg-surface-muted hover:shadow-cardHover active:scale-[0.98]">
                      Login / Sign Up
                    </Link>
                  </>
                )}
              </motion.div>
            )}

            {/* Hero Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="relative mx-auto mt-12 max-w-2xl rounded-2xl border border-stone-200 bg-white p-4 shadow-xl sm:p-6"
            >
              <div className="w-full flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs font-medium text-content-tertiary">Med-AI Assistant</div>
                <div className="w-10"></div>
              </div>
              <div className="flex w-full flex-col gap-4 px-2 text-left">
                <div className="self-end rounded-2xl rounded-tr-none bg-primary-100 px-4 py-3 text-sm text-primary-900 max-w-[80%]">
                  Can you explain what my recent CBC blood test results mean?
                </div>
                <div className="self-start rounded-2xl rounded-tl-none border border-stone-200 bg-surface px-4 py-3 text-sm text-content-secondary/90 max-w-[80%] flex gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                    <Sparkles className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="font-medium text-content-primary mb-1">I can help with that!</p>
                    <p className="leading-relaxed">
                      Based on your uploaded Complete Blood Count (CBC) report, your hemoglobin levels are slightly lower than the normal range, which might indicate mild anemia. However, your white blood cell count is perfectly normal...
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. VALUE STRIP */}
        <section className="border-t border-stone-200 bg-primary-50/60 px-4 py-8">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-6">
            <div className="flex items-center gap-2.5 text-content-primary">
              <Brain className="h-5 w-5 text-primary-600" aria-hidden />
              <span className="text-sm font-medium">AI Medical Chat</span>
            </div>
            <div className="flex items-center gap-2.5 text-content-primary">
              <Zap className="h-5 w-5 text-primary-600" aria-hidden />
              <span className="text-sm font-medium">Guest Chat</span>
            </div>
            <div className="flex items-center gap-2.5 text-content-primary">
              <Activity className="h-5 w-5 text-primary-600" aria-hidden />
              <span className="text-sm font-medium">Personalized History</span>
            </div>
            <div className="flex items-center gap-2.5 text-content-primary">
              <FileSearch className="h-5 w-5 text-primary-600" aria-hidden />
              <span className="text-sm font-medium">Medical Report Analysis</span>
            </div>
          </div>
        </section>

        {/* 2B. AI ROBOT MEDICAL ASSISTANT SECTION */}
        <section className="border-t border-stone-200 bg-surface-elevated px-4 py-16 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1 text-xs font-semibold text-primary-700 mb-2.5 shadow-xs">
                <Bot className="h-3.5 w-3.5" />
                <span>Autonomous Medical Intelligence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-content-primary">
                MedAI Autonomous Clinical Companion
              </h2>
              <p className="mx-auto mt-2.5 max-w-2xl text-sm sm:text-base text-content-secondary leading-relaxed">
                Powered by clinical reasoning, real-time bio-signal frequency monitoring, and multimodal pathology OCR.
              </p>
            </motion.div>
            <AiRobotShowcase />
          </div>
        </section>

        {/* 3. FEATURES */}
        <section className="border-t border-stone-200 bg-surface px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-content-primary sm:text-3xl">Comprehensive Health Intelligence</h2>
              <p className="mx-auto mt-4 max-w-2xl text-content-secondary/90">
                Empowering you with AI-driven tools to better understand your health, symptoms, and medical data.
              </p>
            </motion.div>
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group rounded-card border border-stone-200 bg-surface-elevated p-6 shadow-soft transition-all hover:border-primary-200 hover:shadow-cardHover">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-200">
                  <MessageCircle className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-6 text-lg font-semibold text-content-primary">AI Medical Chat</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-content-secondary/90">
                  Ask questions, describe symptoms, and interact naturally with Med-AI to receive immediate, intelligent health guidance at any time of day.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="group rounded-card border border-stone-200 bg-surface-elevated p-6 shadow-soft transition-all hover:border-primary-200 hover:shadow-cardHover">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-200">
                  <Database className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-6 text-lg font-semibold text-content-primary">Medical History</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-content-secondary/90">
                  Maintain relevant medical information securely so Med-AI can provide far more contextual, accurate, and personalized responses to your inquiries.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="group rounded-card border border-stone-200 bg-surface-elevated p-6 shadow-soft transition-all hover:border-primary-200 hover:shadow-cardHover">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-200">
                  <FileText className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-6 text-lg font-semibold text-content-primary">Report Analysis</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-content-secondary/90">
                  Upload reports and receive simple, AI-generated explanations of important findings, complex medical terminology, and key metrics.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="group rounded-card border border-primary-200 bg-surface-elevated p-6 shadow-soft transition-all hover:border-primary-400 hover:shadow-cardHover relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-200">
                    <Compass className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200">Interactive 3D</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-content-primary flex items-center justify-between">
                  <span>3D Body Atlas</span>
                  <ArrowRight className="h-4 w-4 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-content-secondary/90">
                  Explore full-body 3D human anatomy, skeletal bones, visceral organs, and clinical pathology layers.
                </p>
                <Link to={user ? "/dashboard/anatomy" : "/auth/login"} className="absolute inset-0 z-10" aria-label="Open 3D Body Atlas" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. GUEST VS PERSONALIZED */}
        <section className="border-t border-stone-200 bg-surface-elevated px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-2xl font-semibold tracking-tight text-content-primary sm:text-3xl">Choose How You Interact</h2>
              <p className="mx-auto mt-4 max-w-2xl text-content-secondary/90">
                Use Med-AI instantly as a guest, or create an account to unlock deeply personalized features.
              </p>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-card border border-stone-200 bg-surface p-8 shadow-soft flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                  <User className="h-6 w-6 text-stone-500" />
                  <h3 className="text-xl font-semibold text-content-primary">Guest Chat</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-stone-400 shrink-0" />
                    <span className="text-content-secondary">No sign up required to start</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-stone-400 shrink-0" />
                    <span className="text-content-secondary">Instant access to AI medical chat</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-stone-400 shrink-0" />
                    <span className="text-content-secondary">Ask medical questions seamlessly</span>
                  </li>
                </ul>
                <div className="mt-auto pt-8">
                  <Link to="/chat" className="inline-flex w-full h-11 items-center justify-center rounded-button border border-stone-300 bg-white font-medium text-content-primary transition-colors hover:bg-surface-muted">
                    Try Guest Chat
                  </Link>
                </div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative rounded-card border-2 border-primary-200 bg-primary-50/30 p-8 shadow-card overflow-hidden flex flex-col h-full">
                <div className="absolute top-0 right-0 rounded-bl-xl bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">Recommended</div>
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="h-6 w-6 text-primary-600" />
                  <h3 className="text-xl font-semibold text-content-primary">Personalized Med-AI</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary-500 shrink-0" />
                    <span className="text-content-secondary font-medium">Save and manage your medical history</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary-500 shrink-0" />
                    <span className="text-content-secondary font-medium">Highly personalized AI responses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary-500 shrink-0" />
                    <span className="text-content-secondary font-medium">Context-aware health analysis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary-500 shrink-0" />
                    <span className="text-content-secondary font-medium">Medical report upload & analysis</span>
                  </li>
                </ul>
                <div className="mt-auto pt-8">
                  <Link to="/auth/signup" className="inline-flex w-full h-11 items-center justify-center rounded-button bg-primary-500 font-medium text-white transition-colors hover:bg-primary-600 shadow-sm">
                    Create Account
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5. HOW IT WORKS */}
        <section className="border-t border-stone-200 bg-surface px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-2xl font-semibold tracking-tight text-content-primary sm:text-3xl">How It Works</h2>
            </motion.div>
            
            <div className="grid gap-6 md:grid-cols-4 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-stone-100 -translate-y-1/2 -z-10"></div>
              
              {[
                { step: "01", title: "Start", desc: "Open the app as a guest or log in to your account.", icon: Zap },
                { step: "02", title: "Chat", desc: "Begin a conversation about your health concerns.", icon: MessageCircle },
                { step: "03", title: "Add Medical Context", desc: "Provide your medical history for better accuracy.", icon: Activity },
                { step: "04", title: "Analyze & Understand", desc: "Receive detailed, personalized AI insights.", icon: Sparkles }
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center bg-surface p-4">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-4 border-surface bg-primary-100 text-primary-600 shadow-soft">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="text-xs font-bold text-primary-600 mb-2 tracking-wider uppercase">Step {item.step}</div>
                  <h3 className="text-lg font-semibold text-content-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-content-secondary leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. MEDICAL REPORT SECTION */}
        <section className="border-t border-stone-200 bg-surface-elevated px-4 py-16 lg:py-24 overflow-hidden">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-transparent rounded-3xl transform -rotate-3 scale-105 opacity-50"></div>
                <div className="relative rounded-2xl border border-stone-200 bg-surface p-6 shadow-cardHover">
                  <div className="flex items-center gap-4 mb-6 border-b border-stone-100 pb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                      <FileSearch className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-content-primary">Blood Test Results.pdf</h4>
                      <p className="text-xs text-content-tertiary">Uploaded 2 mins ago</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Sparkles className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-content-secondary leading-relaxed">
                        I've analyzed your lipid panel. Your <span className="font-medium text-content-primary">LDL cholesterol</span> is slightly elevated at 135 mg/dL. The optimal range is below 100 mg/dL. 
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Sparkles className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-content-secondary leading-relaxed">
                        However, your <span className="font-medium text-content-primary">HDL (good cholesterol)</span> is excellent at 65 mg/dL, which helps protect your heart.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 mb-6">
                  <UploadCloud className="h-3.5 w-3.5" />
                  Smart Analysis
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-content-primary sm:text-3xl lg:text-4xl mb-6">Understand Your Medical Reports</h2>
                <p className="text-lg leading-relaxed text-content-secondary/90 mb-8">
                  Medical jargon can be confusing. Upload your lab results, imaging reports, or doctor's notes, and receive an easy-to-understand AI analysis that breaks down important findings and terminology.
                </p>
                <Link to={user ? "/dashboard/reports" : "/auth/login"} className="inline-flex h-12 items-center justify-center gap-2 rounded-button bg-primary-500 px-8 text-base font-semibold text-white shadow-card transition-all hover:bg-primary-600">
                  Analyze Your Report
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 7. PERSONALIZATION SECTION */}
        <section className="border-t border-stone-200 bg-surface px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600 mb-6">
                  <Activity className="h-3.5 w-3.5" />
                  Context-Aware
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-content-primary sm:text-3xl lg:text-4xl mb-6">Your Medical Context Matters</h2>
                <p className="text-lg leading-relaxed text-content-secondary/90 mb-8">
                  Health isn't one-size-fits-all. By registering and securely providing your medical history—including past conditions, medications, and allergies—Med-AI tailors its responses to be significantly more relevant and safe for your specific situation.
                </p>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary-500" />
                    <span className="text-content-secondary font-medium">Securely stored and encrypted data</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-primary-500" />
                    <span className="text-content-secondary font-medium">You control what you share</span>
                  </li>
                </ul>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 w-full">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-stone-200 bg-surface-elevated p-5 shadow-sm">
                      <div className="text-xs font-semibold text-content-tertiary uppercase tracking-wider mb-2">Conditions</div>
                      <div className="text-sm font-medium text-content-primary bg-stone-100 rounded-md px-2 py-1 inline-block mb-2">Hypertension</div>
                      <div className="text-sm font-medium text-content-primary bg-stone-100 rounded-md px-2 py-1 inline-block">Asthma</div>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-surface-elevated p-5 shadow-sm mt-8">
                      <div className="text-xs font-semibold text-content-tertiary uppercase tracking-wider mb-2">Medications</div>
                      <div className="text-sm font-medium text-content-primary bg-stone-100 rounded-md px-2 py-1 inline-block mb-2">Lisinopril 10mg</div>
                      <div className="text-sm font-medium text-content-primary bg-stone-100 rounded-md px-2 py-1 inline-block">Albuterol Inhaler</div>
                    </div>
                 </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 8. FINAL CTA */}
        <section className="border-t border-stone-200 bg-primary-50/80 px-4 py-16 lg:py-24 text-center relative overflow-hidden">
          <div className="relative mx-auto max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-content-primary sm:text-3xl lg:text-4xl mb-6">Start Understanding Your Health Better</h2>
            <p className="text-lg leading-relaxed text-content-secondary/90 mb-10 max-w-2xl mx-auto">
              Join Med-AI today to take control of your health information, or try our guest chat right now to see how it works.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/signup" className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-button bg-primary-500 px-8 text-base font-bold text-white shadow-card transition-all hover:bg-primary-600 hover:shadow-cardHover active:scale-[0.98]">
                Create Account
              </Link>
              <Link to="/chat" className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-button border border-stone-300 bg-white px-8 text-base font-semibold text-content-primary shadow-soft transition-all hover:bg-surface-muted hover:shadow-cardHover active:scale-[0.98]">
                Start Guest Chat
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

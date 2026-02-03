import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  MessageCircle,
  FileText,
  Stethoscope,
  Ambulance,
  Shield,
  Lock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Globe,
  Brain,
  FlaskConical,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";

const whatIsMedAI = [
  { icon: MessageCircle, title: "AI Doctor Consultation", description: "Get instant, 24/7 AI-powered health guidance. Describe your symptoms and receive preliminary insights before consulting with certified doctors. Our AI assistant helps you understand your health concerns and guides you on next steps." },
  { icon: FileText, title: "Medical Report Analysis", description: "Upload your medical reports, lab results, or imaging scans and receive comprehensive AI-powered analysis. Get detailed summaries, key observations, and suggested next steps to help you understand your health data better." },
  { icon: Stethoscope, title: "Certified Doctor Consultations", description: "Connect with verified, certified doctors from around the world. Book video or in-person consultations at affordable rates. Access specialists in cardiology, dermatology, pediatrics, oncology, and more." },
  { icon: Ambulance, title: "Inter-City Patient Transport", description: "Book ambulance services for safe, professional patient transport between cities. Perfect for medical transfers, hospital discharges, or scheduled medical appointments requiring specialized transport." },
  { icon: FlaskConical, title: "At-Home Lab Tests", description: "Schedule lab tests from the comfort of your home. Our certified technicians visit your location to collect samples, making healthcare more convenient and accessible." },
  { icon: Brain, title: "Personalized Health Plans", description: "Receive AI-generated fitness and diet plans tailored to your health profile, medical history, and wellness goals. Coming soon with advanced personalization features." },
];

const whyMedAI = [
  { title: "Verified doctors", desc: "All doctors are certified and verified." },
  { title: "Affordable healthcare", desc: "Minimal consultation fees, global access." },
  { title: "Fast AI responses", desc: "Get instant AI guidance 24/7." },
  { title: "Global reach", desc: "Connect with doctors from anywhere." },
];

const trustIndicators = [
  { icon: Shield, text: "Certified Doctors" },
  { icon: Lock, text: "Secure Medical Data" },
  { icon: CheckCircle2, text: "AI-assisted, Doctor-approved" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

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
        <section className="relative overflow-hidden px-4 pt-16 pb-24 sm:pt-24 sm:pb-32 lg:pt-28 lg:pb-40">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/80 via-surface to-surface" />
          <div className="relative mx-auto max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/80 px-4 py-1.5 text-sm font-medium text-primary-700">
              <Sparkles className="h-4 w-4" aria-hidden />
              AI-powered healthcare
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="mt-6 text-3xl font-bold tracking-tight text-content-primary sm:text-4xl lg:text-5xl lg:leading-tight">
              Your health assistant, <span className="text-primary-600">anytime, anywhere</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }} className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-content-secondary">
              Chat with an AI doctor, analyze medical reports, and consult certified doctors globally at minimal cost — all in one place.
            </motion.p>
            {mounted && user && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.24 }} className="mt-10">
                <Link to="/dashboard" className="inline-flex h-12 items-center justify-center gap-2 rounded-button bg-primary-500 px-8 text-base font-semibold text-white shadow-card transition-all hover:bg-primary-600 hover:shadow-cardHover active:scale-[0.98]">
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </Link>
              </motion.div>
            )}
          </div>
        </section>

        <section className="border-t border-stone-200 bg-surface-elevated px-4 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-content-primary sm:text-3xl">What is MedAI</h2>
              <p className="mx-auto mt-4 max-w-2xl text-content-secondary">
                MedAI is your comprehensive healthcare platform that combines the power of artificial intelligence with access to certified medical professionals.
              </p>
            </motion.div>
            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {whatIsMedAI.map((block) => (
                <motion.div key={block.title} variants={item} className="group rounded-card border border-stone-200 bg-surface-elevated p-6 shadow-soft transition-all hover:border-primary-200 hover:shadow-cardHover">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-200">
                    <block.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-semibold text-content-primary">{block.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-content-secondary">{block.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="border-t border-stone-200 bg-surface-elevated px-4 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-content-primary sm:text-3xl">Why MedAI</h2>
            </motion.div>
            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {whyMedAI.map((block) => (
                <motion.div key={block.title} variants={item} className="rounded-card border border-stone-200 bg-surface-elevated p-6 shadow-soft">
                  <h3 className="font-semibold text-content-primary">{block.title}</h3>
                  <p className="mt-2 text-sm text-content-secondary">{block.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="border-t border-stone-200 bg-primary-50/60 px-4 py-10">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trustIndicators.map((t) => (
              <div key={t.text} className="flex items-center gap-2.5 text-content-primary">
                <t.icon className="h-5 w-5 text-primary-600" aria-hidden />
                <span className="text-sm font-medium">{t.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-stone-200 bg-surface px-4 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-content-primary sm:text-3xl">How MedAI works</h2>
              <p className="mx-auto mt-4 max-w-2xl text-content-secondary">
                MedAI combines AI guidance with certified medical expertise to support you through every step of your health journey.
              </p>
            </motion.div>
            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-12 grid gap-6 md:grid-cols-3">
              <motion.div variants={item} className="rounded-card border border-stone-200 bg-surface-elevated p-6 shadow-soft">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  <Clock className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold text-content-primary">Share your concern</h3>
                <p className="mt-2 text-sm leading-relaxed text-content-secondary">Describe your symptoms, upload reports, or outline your health goals in a simple, structured way.</p>
              </motion.div>
              <motion.div variants={item} className="rounded-card border border-stone-200 bg-surface-elevated p-6 shadow-soft">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  <Brain className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold text-content-primary">AI interprets your data</h3>
                <p className="mt-2 text-sm leading-relaxed text-content-secondary">Our AI assistant analyzes the information, highlights key points, and suggests questions to discuss with doctors.</p>
              </motion.div>
              <motion.div variants={item} className="rounded-card border border-stone-200 bg-surface-elevated p-6 shadow-soft">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  <Globe className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold text-content-primary">Coordinate next steps</h3>
                <p className="mt-2 text-sm leading-relaxed text-content-secondary">Use MedAI to prepare for consultations, track follow-ups, and keep your health information organized over time.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

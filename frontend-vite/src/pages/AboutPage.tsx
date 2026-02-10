import { Link } from "react-router-dom";
import { Shield, HeartPulse, Sparkles, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: HeartPulse,
    title: "Patient-first design",
    description: "We build experiences that reduce friction and help people find clarity quickly.",
  },
  {
    icon: Shield,
    title: "Trust and privacy",
    description: "We prioritize secure handling of sensitive health information and transparent policies.",
  },
  {
    icon: Sparkles,
    title: "Responsible AI",
    description: "AI insights are paired with medical context and clear guidance to seek professional care.",
  },
  {
    icon: Users,
    title: "Human collaboration",
    description: "We connect people to verified healthcare professionals when expert care is needed.",
  },
];

export function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-stone-200 bg-surface px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700">
              About MedAI
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-content-primary sm:text-4xl">Healthcare support, simplified.</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-content-secondary">
              MedAI combines AI guidance with access to certified doctors to help people make confident, informed health decisions.
            </p>
          </div>
        </section>

        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="rounded-card border border-stone-200 bg-surface-elevated p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-content-primary">Our mission</h2>
              <p className="mt-2 text-sm leading-relaxed text-content-secondary">
                We aim to make quality healthcare guidance accessible anytime. MedAI helps users interpret health information, stay organized, and connect with professional care when needed.
              </p>
            </div>
            <div className="rounded-card border border-stone-200 bg-surface-elevated p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-content-primary">What we build</h2>
              <p className="mt-2 text-sm leading-relaxed text-content-secondary">
                A single platform for AI-powered symptom guidance, medical report summaries, and secure connections to doctors and health services.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((value) => (
                <div key={value.title} className="rounded-card border border-stone-200 bg-surface-elevated p-5 shadow-soft">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <value.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-content-primary">{value.title}</h3>
                  <p className="mt-2 text-sm text-content-secondary">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-stone-200 bg-primary-50/60 px-4 py-10">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold text-content-primary">Want to partner with us?</h3>
              <p className="mt-1 text-sm text-content-secondary">We collaborate with clinics, labs, and health organizations.</p>
            </div>
            <Link to="/contact">
              <Button size="lg">Contact us</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

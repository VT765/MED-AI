import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const highlights = [
  { label: "Last updated", value: "January 15, 2026" },
  { label: "Data types", value: "Account, usage, and health info you submit" },
  { label: "Privacy contact", value: "privacy@medai.example" },
];

const sections = [
  {
    title: "1. Information we collect",
    body:
      "We collect information you provide directly, such as account details and the medical information you choose to share. We also collect basic usage data to improve the service.",
    list: [
      "Account data: name, email, phone number (optional).",
      "Health data you upload or enter, such as reports or symptoms.",
      "Usage data like device type, pages visited, and session timing.",
    ],
  },
  {
    title: "2. How we use information",
    body:
      "We use your information to provide and improve MedAI, personalize your experience, and maintain platform security.",
    list: [
      "Deliver AI insights and manage your account.",
      "Monitor performance and prevent misuse.",
      "Communicate important service updates.",
    ],
  },
  {
    title: "3. Sharing and disclosure",
    body:
      "We do not sell your personal data. We share information only with trusted providers that help us operate the service or when required by law.",
  },
  {
    title: "4. Data retention",
    body:
      "We retain data only as long as needed to provide the service or meet legal obligations. You can request deletion of your account and associated data.",
  },
  {
    title: "5. Security",
    body:
      "We use administrative, technical, and physical safeguards to protect your data. No system can be guaranteed 100% secure, but we continuously improve our controls.",
  },
  {
    title: "6. Your rights",
    body:
      "Depending on your location, you may have rights to access, correct, export, or delete your information. We respond to verified requests within a reasonable timeframe.",
  },
  {
    title: "7. Cookies",
    body:
      "We use essential cookies to keep you signed in and to understand site performance. You can manage cookies through your browser settings.",
  },
  {
    title: "8. Contact",
    body:
      "For privacy-related questions, contact privacy@medai.example.",
  },
];

export function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-stone-200 bg-surface px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700">
              Privacy
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-content-primary sm:text-4xl">Privacy Policy</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-content-secondary">
              Your privacy matters. This policy explains what we collect, how we use it, and the choices available to you.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-card border border-stone-200 bg-surface-elevated p-4 shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-wide text-content-tertiary">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-content-primary">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="rounded-card border border-stone-200 bg-surface-elevated p-6 shadow-soft">
                <h2 className="text-lg font-semibold text-content-primary">{section.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-content-secondary">{section.body}</p>
                {section.list && (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-content-secondary">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-stone-200 bg-primary-50/60 px-4 py-10">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold text-content-primary">Questions about privacy?</h3>
              <p className="mt-1 text-sm text-content-secondary">We are happy to walk you through our data practices.</p>
            </div>
            <Link to="/contact">
              <Button size="lg">Contact privacy team</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

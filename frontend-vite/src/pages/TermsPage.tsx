import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const highlights = [
  { label: "Effective date", value: "January 15, 2026" },
  { label: "Applies to", value: "MedAI web app and services" },
  { label: "Support", value: "legal@medai.example" },
];

const sections = [
  {
    title: "1. Acceptance of terms",
    body:
      "By accessing or using MedAI, you agree to these Terms and Conditions. If you do not agree, do not use the services.",
  },
  {
    title: "2. Eligibility and accounts",
    body:
      "You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.",
  },
  {
    title: "3. Medical disclaimer",
    body:
      "MedAI provides informational and educational content only. It does not replace professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider.",
  },
  {
    title: "4. User content",
    body:
      "You retain ownership of content you submit. By uploading content, you grant MedAI a limited license to store and process it for providing the service.",
  },
  {
    title: "5. Prohibited use",
    body:
      "You agree not to misuse the service. Prohibited activities include:",
    list: [
      "Attempting to access other users' data or accounts.",
      "Uploading content that is unlawful, harmful, or infringes on rights.",
      "Interfering with the security or availability of the platform.",
      "Using automated tools to scrape or disrupt the service.",
    ],
  },
  {
    title: "6. Subscriptions and payments",
    body:
      "If you purchase a paid plan, you agree to pay the applicable fees. Pricing, billing cycles, and cancellation terms will be shown at checkout and can be updated with notice.",
  },
  {
    title: "7. Termination",
    body:
      "We may suspend or terminate access if you violate these Terms or if required to protect users, the platform, or legal compliance.",
  },
  {
    title: "8. Changes to these terms",
    body:
      "We may update these Terms from time to time. The latest version will always be available on this page. Material changes will be communicated through the app or email.",
  },
  {
    title: "9. Contact",
    body:
      "For questions about these Terms, contact our legal team at legal@medai.example.",
  },
];

export function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-stone-200 bg-surface px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700">
              Legal
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-content-primary sm:text-4xl">Terms & Conditions</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-content-secondary">
              These terms describe how you can use MedAI and what you can expect from us. We keep the language simple and practical so it is easy to understand.
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
              <h3 className="text-lg font-semibold text-content-primary">Need clarification?</h3>
              <p className="mt-1 text-sm text-content-secondary">Reach out and we will help you understand these terms.</p>
            </div>
            <Link to="/contact">
              <Button size="lg">Contact support</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

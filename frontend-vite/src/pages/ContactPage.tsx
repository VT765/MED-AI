import { useCallback, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactCards = [
  {
    icon: Mail,
    title: "Email",
    value: "support@medai.example",
    description: "We reply within 1 business day.",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (555) 010-2300",
    description: "Mon to Fri, 9:00 AM to 6:00 PM PST.",
  },
  {
    icon: MapPin,
    title: "Office",
    value: "2200 Market Street, Suite 120",
    description: "San Francisco, CA 94114",
  },
  {
    icon: Clock,
    title: "Hours",
    value: "Monday to Friday",
    description: "09:00 AM - 06:00 PM PST",
  },
];

export function ContactPage() {
  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-stone-200 bg-surface px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700">
              Contact
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-content-primary sm:text-4xl">Get in touch</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-content-secondary">
              We are here to help with product questions, account issues, or partnership inquiries. For medical emergencies, call your local emergency number.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {contactCards.map((card) => (
                <div key={card.title} className="rounded-card border border-stone-200 bg-surface-elevated p-4 shadow-soft">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <card.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-content-primary">{card.title}</h3>
                  <p className="mt-1 text-sm font-medium text-content-primary">{card.value}</p>
                  <p className="mt-1 text-xs text-content-secondary">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-card border border-stone-200 bg-surface-elevated p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-content-primary">Send a message</h2>
              <p className="mt-2 text-sm text-content-secondary">Share the details and our team will follow up.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" placeholder="Jane Doe" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Write your message here..."
                    className="min-h-[140px] rounded-input border border-stone-300 bg-surface-elevated text-content-primary placeholder:text-content-tertiary focus-visible:ring-primary-500"
                  />
                </div>
                <Button type="submit" size="lg">Submit request</Button>
                <p className="text-xs text-content-tertiary">This form is for non-urgent requests. If you need immediate medical help, contact local emergency services.</p>
              </form>
            </div>

            <div className="rounded-card border border-stone-200 bg-surface-elevated p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-content-primary">Support topics</h2>
              <p className="mt-2 text-sm text-content-secondary">Choose the fastest way to get the right help.</p>
              <ul className="mt-4 space-y-3 text-sm text-content-secondary">
                <li>Account access or verification issues.</li>
                <li>Billing, invoices, and plan changes.</li>
                <li>Partnerships and enterprise inquiries.</li>
                <li>Data privacy requests.</li>
              </ul>
              <div className="mt-6 rounded-card border border-dashed border-stone-300 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-content-tertiary">Quick links</p>
                <div className="mt-3 flex flex-col gap-2">
                  <Link to="/terms" className="text-sm font-medium text-primary-600 hover:underline">Terms & Conditions</Link>
                  <Link to="/privacy" className="text-sm font-medium text-primary-600 hover:underline">Privacy Policy</Link>
                  <a href="mailto:support@medai.example" className="text-sm font-medium text-primary-600 hover:underline">Email support</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, Mail, FileText, ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "How does AI Doctor chat work?", a: "It uses AI to understand your symptoms and give general health guidance. It's not a real doctor — always see one for proper diagnosis." },
  { q: "Is my medical data secure?", a: "Yes. Your data is encrypted and stored securely. We never share it. You can clear your chat history anytime." },
  { q: "Can I upload medical reports?", a: "Yes! Upload PDFs in the Medical Reports section. The AI will extract and simplify the information for you." },
  { q: "Is the AI diagnosis accurate?", a: "The AI gives general guidance, not diagnosis. Always verify with a real healthcare provider." },
  { q: "How do I book a doctor appointment?", a: "Go to 'Book Doctor' from the dashboard. Pick a doctor, date, and time — done!" },
  { q: "What file types are supported?", a: "Currently PDFs up to 10MB. Image support (JPG, PNG) is coming soon." },
];

function AccordionItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-stone-100 last:border-0">
      <button type="button" onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-4 px-1 text-left text-sm font-medium text-content-primary hover:text-primary-700 transition-colors"
        aria-expanded={isOpen}>
        <span>{q}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-content-tertiary transition-transform duration-200", isOpen && "rotate-180 text-primary-600")} />
      </button>
      <div className={cn("overflow-hidden transition-all duration-200", isOpen ? "max-h-40 pb-4" : "max-h-0")}>
        <p className="px-1 text-sm text-content-secondary leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold tracking-tight text-content-primary">Help & Support</h2>
        <p className="mt-1 text-content-secondary">Find answers to common questions or reach out for help.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="px-5 py-2">
          <div className="flex items-center gap-3 py-3 border-b border-stone-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-content-primary">Frequently Asked Questions</h3>
          </div>
          <div className="mt-1">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} q={faq.q} a={faq.a} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: MessageCircle, title: "AI Doctor Chat", description: "Get instant health guidance", href: "/dashboard/chat", color: "bg-primary-100 text-primary-600", linkText: "Open Chat" },
          { icon: Mail, title: "Email Support", description: "support@medai.health", href: "mailto:support@medai.health", color: "bg-blue-100 text-blue-600", linkText: "Send Email", external: true },
          { icon: FileText, title: "Documentation", description: "User guides and tutorials", href: "/about", color: "bg-purple-100 text-purple-600", linkText: "Read Docs" },
        ].map((item, i) => {
          const Icon = item.icon;
          const content = (
            <Card className="flex flex-col items-center text-center px-4 py-5 hover:border-primary-200 hover:shadow-cardHover transition-all group">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}><Icon className="h-5 w-5" /></div>
              <h4 className="mt-3 text-sm font-semibold text-content-primary">{item.title}</h4>
              <p className="mt-1 text-xs text-content-tertiary">{item.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary-600 group-hover:gap-2 transition-all">
                {item.linkText}<ExternalLink className="h-3 w-3" />
              </span>
            </Card>
          );
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
              {item.external
                ? <a href={item.href} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
                : <Link to={item.href} className="block">{content}</Link>
              }
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

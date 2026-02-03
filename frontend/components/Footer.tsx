"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

const footerLinks = {
  product: [
    { label: "AI Doctor", href: "/dashboard/chat" },
    { label: "Medical Reports", href: "/dashboard/reports" },
    { label: "Book Doctor", href: "/dashboard/appointment" },
  ],
  company: [
    { label: "About MedAI", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-surface-muted">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white">
                <Heart className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-lg font-bold tracking-tight text-content-primary">
                MedAI
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-content-secondary">
              Your AI-powered health assistant — anytime, anywhere.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-content-tertiary">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-content-secondary transition-colors hover:text-primary-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-content-tertiary">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-content-secondary transition-colors hover:text-primary-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-content-tertiary">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-content-secondary transition-colors hover:text-primary-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-stone-200 pt-8 text-center text-sm text-content-tertiary">
          © {new Date().getFullYear()} MedAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

"use client";

import { motion } from "motion/react";
import {
  IconCheck,
  IconBrandGithub,
  IconArrowRight,
} from "@tabler/icons-react";
import Link from "next/link";

const plans = [
  {
    name: "Community",
    tagline: "Self-hosted, forever free",
    price: "$0",
    period: "/month",
    cta: "Deploy on GitHub",
    ctaHref: "https://github.com/ReactiveX22/classmate-client",
    ctaIcon: IconBrandGithub,
    ctaVariant: "outline" as const,
    features: [
      "All core features included",
      "Unlimited classrooms & students",
      "Campus-wide notice board",
      "Real-time notifications",
      "Self-host on your own server",
      "Full source code access",
      "Community support",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    tagline: "Managed cloud hosting",
    price: "Coming Soon",
    period: "",
    cta: "Get Notified",
    ctaHref: "https://github.com/ReactiveX22/classmate-client",
    ctaIcon: IconArrowRight,
    ctaVariant: "primary" as const,
    features: [
      "Everything in Community",
      "Managed hosting & CDN",
      "Automated backups",
      "Custom domain & SSL",
      "Advanced analytics dashboard",
      "Priority email support",
      "SLA uptime guarantee",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    tagline: "For large institutions",
    price: "Custom",
    period: "",
    cta: "Contact Us",
    ctaHref: "mailto:hello@classmate.app",
    ctaIcon: IconArrowRight,
    ctaVariant: "outline" as const,
    features: [
      "Everything in Pro",
      "SSO & SAML authentication",
      "Dedicated infrastructure",
      "Custom integrations & API",
      "Onboarding & training",
      "Dedicated account manager",
      "SLA & legal agreements",
    ],
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-32 px-4 sm:px-6">
      {/* Background glow */}
      <div className="absolute inset-0 hero-radial opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-medium text-primary">
              💰 Simple Pricing
            </span>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Start free, <span className="text-gradient">scale as you grow</span>
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Classmate is open source and free to self-host. Managed cloud and
            enterprise options are on the roadmap.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-8 border transition-all duration-300 ${
                plan.highlighted
                  ? "border-primary/40 bg-card shadow-2xl shadow-primary/10 scale-[1.02]"
                  : "border-border/40 bg-card hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Highlighted glow overlay */}
              {plan.highlighted && (
                <>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-xs font-bold text-primary-foreground shadow-lg shadow-primary/30">
                    {plan.badge}
                  </div>
                </>
              )}

              {/* Plan Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.tagline}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span
                    className={`font-extrabold tracking-tight ${plan.price === "Custom" || plan.price === "Coming Soon" ? "text-2xl" : "text-4xl"}`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground mb-1">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <IconCheck
                      size={16}
                      className={
                        plan.highlighted
                          ? "text-primary flex-shrink-0"
                          : "text-emerald-500 flex-shrink-0"
                      }
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href={plan.ctaHref}
                target={plan.ctaHref.startsWith("http") ? "_blank" : undefined}
                rel={plan.ctaHref.startsWith("http") ? "noopener" : undefined}
                className={`flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                  plan.ctaVariant === "primary"
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30"
                    : "bg-transparent border border-border/60 hover:border-primary/30 hover:bg-primary/5 text-foreground"
                }`}
              >
                <plan.ctaIcon size={16} />
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          className="text-center text-sm text-muted-foreground mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          ⭐{" "}
          <Link
            href="https://github.com/ReactiveX22/classmate-client"
            target="_blank"
            rel="noopener"
            className="text-primary hover:underline font-medium"
          >
            Star us on GitHub
          </Link>{" "}
          to support the project!
        </motion.p>
      </div>
    </section>
  );
}

"use client";

import { Check, Zap } from "lucide-react";
import Link from "next/link";
import { CyberButton } from "@/components/cyber-button";
import { CyberCard } from "@/components/cyber-card";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Access to 5 free courses",
      "Basic progress tracking",
      "Community forum access",
      "Limited AI chat queries",
    ],
    cta: "Start Free",
    variant: "default" as const,
    popular: false,
  },
  {
    name: "Pro Hacker",
    price: "$29",
    period: "per month",
    description: "For serious learners",
    features: [
      "Unlimited course access",
      "All certifications",
      "Priority support",
      "Unlimited AI chat",
      "Exclusive labs",
      "Downloadable resources",
    ],
    cta: "Go Pro",
    variant: "highlight" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Team management",
      "Custom courses",
      "API access",
      "Dedicated support",
      "Analytics dashboard",
    ],
    cta: "Contact Sales",
    variant: "default" as const,
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="relative py-20 px-4" id="pricing">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-glow-sm mb-4">
            {"<"} Choose Your Path {"/>"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the plan that fits your hacking journey. Upgrade or downgrade
            anytime.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <CyberCard
              key={plan.name}
              variant={plan.variant}
              glowing={plan.popular}
              className={`p-8 relative ${
                plan.popular ? "scale-105 z-10" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-primary">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    /{plan.period}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mt-2">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/auth/register" className="block">
                <CyberButton
                  className="w-full"
                  variant={plan.popular ? "primary" : "secondary"}
                >
                  {plan.cta}
                </CyberButton>
              </Link>
            </CyberCard>
          ))}
        </div>
      </div>
    </section>
  );
}

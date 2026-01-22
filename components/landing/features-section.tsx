"use client";

import {
  Shield,
  Trophy,
  Users,
  MessageSquare,
  Video,
  Award,
  Zap,
  Lock,
} from "lucide-react";
import { CyberCard } from "@/components/cyber-card";

const features = [
  {
    icon: Video,
    title: "HD Video Courses",
    description:
      "High-quality video tutorials covering penetration testing, network security, and more.",
  },
  {
    icon: Trophy,
    title: "Gamified Learning",
    description:
      "Earn XP, level up, and unlock achievements as you progress through courses.",
  },
  {
    icon: Users,
    title: "Global Leaderboard",
    description:
      "Compete with hackers worldwide and climb the ranks to prove your skills.",
  },
  {
    icon: MessageSquare,
    title: "AI Assistant - Root",
    description:
      "Get instant help from our AI chatbot trained on cybersecurity knowledge.",
  },
  {
    icon: Shield,
    title: "Practical Labs",
    description:
      "Hands-on exercises in safe, sandboxed environments to test your skills.",
  },
  {
    icon: Award,
    title: "Certifications",
    description:
      "Earn industry-recognized certificates upon completing courses.",
  },
  {
    icon: Zap,
    title: "Real-time Progress",
    description:
      "Track your learning journey with detailed progress analytics.",
  },
  {
    icon: Lock,
    title: "Ethical Focus",
    description:
      "Learn responsible security practices and ethical hacking methodologies.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-20 px-4" id="features">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-glow-sm mb-4">
            {"<"} Platform Features {"/>"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to become a skilled ethical hacker, from
            beginner to advanced.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <CyberCard
              key={feature.title}
              variant="highlight"
              className="p-6 group hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 p-3 w-fit rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CyberCard>
          ))}
        </div>
      </div>
    </section>
  );
}

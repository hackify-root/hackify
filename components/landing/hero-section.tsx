"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Terminal, Lock } from "lucide-react";
import { CyberButton } from "@/components/cyber-button";
import { TerminalText } from "@/components/terminal-text";

export function HeroSection() {
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowSubtitle(true), 1500);
    const timer2 = setTimeout(() => setShowButtons(true), 3000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Terminal window frame */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full bg-card/50 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs text-muted-foreground">root@hackify:~$</span>
        </div>

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Shield className="w-24 h-24 text-primary text-glow" />
            <Terminal className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-primary" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
          <span className="text-primary text-glow glitch">HACKIFY</span>
        </h1>

        {/* Subtitle with typing effect */}
        <div className="h-20 mb-8">
          <p className="text-xl md:text-2xl text-muted-foreground">
            <TerminalText
              text="> Master the Art of Ethical Hacking"
              speed={40}
              onComplete={() => setShowSubtitle(true)}
            />
          </p>
          {showSubtitle && (
            <p className="text-lg md:text-xl text-muted-foreground/70 mt-2">
              <TerminalText
                text="> Level up. Earn XP. Become a cyber warrior."
                speed={30}
              />
            </p>
          )}
        </div>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ${
            showButtons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link href="/auth/register">
            <CyberButton size="lg" glowing>
              <Lock className="w-5 h-5" />
              Start Hacking
            </CyberButton>
          </Link>
          <Link href="/auth/login">
            <CyberButton variant="secondary" size="lg">
              <Terminal className="w-5 h-5" />
              Login
            </CyberButton>
          </Link>
        </div>

        {/* Stats preview */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { label: "Courses", value: "50+" },
            { label: "Students", value: "10K+" },
            { label: "Hours", value: "500+" },
            { label: "Certifications", value: "12" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm"
            >
              <div className="text-2xl md:text-3xl font-bold text-primary text-glow-sm">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

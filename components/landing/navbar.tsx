"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Terminal, Menu, X } from "lucide-react";
import { CyberButton } from "@/components/cyber-button";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Courses", href: "/courses" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Leaderboard", href: "/leaderboard" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <Shield className="w-8 h-8 text-primary" />
            <Terminal className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold text-primary text-glow-sm">
            HACKIFY
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login">
            <CyberButton variant="secondary" size="sm">
              Login
            </CyberButton>
          </Link>
          <Link href="/auth/register">
            <CyberButton size="sm">Sign Up</CyberButton>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-primary"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3 border-t border-border">
              <Link href="/auth/login">
                <CyberButton variant="secondary" className="w-full">
                  Login
                </CyberButton>
              </Link>
              <Link href="/auth/register">
                <CyberButton className="w-full">Sign Up</CyberButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

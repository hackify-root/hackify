"use client";

import Link from "next/link";
import { Shield, Terminal, Github, Twitter, Youtube } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Courses", href: "/courses" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Blog", href: "/blog" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Partners", href: "/partners" },
  ],
  Legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Cookies", href: "/cookies" },
    { label: "License", href: "/license" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Community", href: "/community" },
    { label: "Status", href: "/status" },
    { label: "API Docs", href: "/docs" },
  ],
};

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Shield className="w-8 h-8 text-primary" />
                <Terminal className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              </div>
              <span className="text-xl font-bold text-primary">HACKIFY</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              The ultimate platform for learning ethical hacking and
              cybersecurity through gamified, hands-on courses.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/10 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-muted-foreground hover:text-primary" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Hackify. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="text-primary">&gt;</span> Hack responsibly. Learn
            ethically.
          </p>
        </div>
      </div>
    </footer>
  );
}

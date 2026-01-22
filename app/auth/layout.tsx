import React from "react"
import { MatrixRain } from "@/components/matrix-rain";
import Link from "next/link";
import { Shield, Terminal } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      <MatrixRain />
      
      {/* Logo */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 z-20"
      >
        <div className="relative">
          <Shield className="w-8 h-8 text-primary" />
          <Terminal className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
        </div>
        <span className="text-xl font-bold text-primary text-glow-sm">
          HACKIFY
        </span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

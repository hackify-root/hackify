"use client";

import React from "react"

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  glowing?: boolean;
}

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = "primary", size = "md", glowing = false, children, ...props }, ref) => {
    const variants = {
      primary: "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]",
      secondary: "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]",
      danger: "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 hover:shadow-[0_0_20px_rgba(255,0,64,0.3)]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-8 py-3.5 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative overflow-hidden border font-mono uppercase tracking-wider transition-all duration-300",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
          variants[variant],
          sizes[size],
          glowing && "pulse-glow",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

CyberButton.displayName = "CyberButton";

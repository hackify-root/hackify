"use client";

import React from "react"

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "highlight" | "danger";
  glowing?: boolean;
}

export const CyberCard = forwardRef<HTMLDivElement, CyberCardProps>(
  ({ className, variant = "default", glowing = false, children, ...props }, ref) => {
    const variants = {
      default: "border-border bg-card/95",
      highlight: "border-primary/30 bg-card/95",
      danger: "border-accent/30 bg-card/95",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative border backdrop-blur-sm rounded-lg overflow-hidden",
          "before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none",
          variants[variant],
          glowing && variant === "default" && "box-glow",
          glowing && variant === "highlight" && "box-glow",
          glowing && variant === "danger" && "box-glow-red",
          className
        )}
        {...props}
      >
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

CyberCard.displayName = "CyberCard";

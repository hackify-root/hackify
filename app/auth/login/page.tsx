"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Terminal, AlertCircle } from "lucide-react";
import { CyberButton } from "@/components/cyber-button";
import { CyberCard } from "@/components/cyber-card";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (data.user) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CyberCard variant="highlight" glowing className="p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-border rounded-full bg-card/50 mb-4">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">SECURE LOGIN</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome Back, Hacker
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access the system
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-3 border border-accent/50 bg-accent/10 rounded-lg flex items-center gap-2 text-sm text-accent">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-muted-foreground uppercase tracking-wider">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hacker@hackify.com"
              required
              className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-muted-foreground uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full pl-10 pr-12 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border bg-input checked:bg-primary"
            />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <CyberButton
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Authenticating...
            </span>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Access System
            </>
          )}
        </CyberButton>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-muted-foreground">
        New to Hackify?{" "}
        <Link href="/auth/register" className="text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </CyberCard>
  );
}

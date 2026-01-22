"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Terminal, AlertCircle, User, CheckCircle } from "lucide-react";
import { CyberButton } from "@/components/cyber-button";
import { CyberCard } from "@/components/cyber-card";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!passwordRequirements.every((req) => req.met)) {
      setError("Password does not meet requirements");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            name,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        setSuccess(true);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <CyberCard variant="highlight" glowing className="p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Registration Successful!
        </h1>
        <p className="text-muted-foreground mb-6">
          Check your email to verify your account and complete the setup.
        </p>
        <Link href="/auth/login">
          <CyberButton className="w-full">
            Proceed to Login
          </CyberButton>
        </Link>
      </CyberCard>
    );
  }

  return (
    <CyberCard variant="highlight" glowing className="p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-border rounded-full bg-card/50 mb-4">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">NEW RECRUIT</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Join the Network
        </h1>
        <p className="text-sm text-muted-foreground">
          Create your account and start your hacking journey
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm text-muted-foreground uppercase tracking-wider">
            Hacker Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="CyberNinja"
              required
              className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>
        </div>

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
              placeholder="Create a strong password"
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
          
          {/* Password requirements */}
          <div className="space-y-1 mt-2">
            {passwordRequirements.map((req) => (
              <div
                key={req.label}
                className={`flex items-center gap-2 text-xs ${
                  req.met ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <CheckCircle className={`w-3 h-3 ${req.met ? "opacity-100" : "opacity-30"}`} />
                {req.label}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm text-muted-foreground uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            required
            className="w-4 h-4 mt-0.5 rounded border-border bg-input checked:bg-primary"
          />
          <label htmlFor="terms" className="text-xs text-muted-foreground">
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </label>
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
              Creating Account...
            </span>
          ) : (
            <>
              <Terminal className="w-5 h-5" />
              Initialize Account
            </>
          )}
        </CyberButton>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          Login here
        </Link>
      </p>
    </CyberCard>
  );
}

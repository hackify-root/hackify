"use client";

import React from "react"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Save, CheckCircle, AlertCircle } from "lucide-react";
import { CyberCard } from "@/components/cyber-card";
import { CyberButton } from "@/components/cyber-button";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          setName(profile.name || "");
        }
      }
    };
    
    loadUser();
  }, [supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ name })
        .eq("id", user.id);

      if (error) throw error;

      setMessage({ type: "success", text: "Profile updated successfully!" });
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setMessage({ type: "success", text: "Password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Account <span className="text-primary text-glow-sm">Settings</span>
        </h1>
        <p className="text-muted-foreground">
          Manage your profile and security settings
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === "success"
              ? "bg-primary/10 border border-primary/30 text-primary"
              : "bg-accent/10 border border-accent/30 text-accent"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Profile settings */}
      <CyberCard variant="highlight" className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Profile Information
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground uppercase tracking-wider">
              Display Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
                className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                disabled
                className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-muted-foreground cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          <CyberButton type="submit" disabled={isLoading}>
            <Save className="w-5 h-5" />
            {isLoading ? "Saving..." : "Save Changes"}
          </CyberButton>
        </form>
      </CyberCard>

      {/* Password settings */}
      <CyberCard variant="highlight" className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Change Password
        </h2>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
          </div>

          <CyberButton type="submit" disabled={isLoading || !newPassword || !confirmPassword}>
            <Lock className="w-5 h-5" />
            {isLoading ? "Updating..." : "Update Password"}
          </CyberButton>
        </form>
      </CyberCard>
    </div>
  );
}

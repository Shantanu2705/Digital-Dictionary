"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/auth/AuthContext";
import { Lock, Mail, ShieldCheck, ArrowRight, KeyRound, Sparkles, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("coo@digitaldictionary.in");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial Bootstrap Mode toggle
  const [isBootstrapMode, setIsBootstrapMode] = useState(false);
  const [bootstrapSecret, setBootstrapSecret] = useState("");
  const [bootstrapSuccess, setBootstrapSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      let destination = "/admin";
      if (auth.currentUser) {
        try {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const role = userDocSnap.data()?.role;
            if (role !== "super_admin" && email.toLowerCase() !== "coo@digitaldictionary.in") {
              destination = "/portal/dashboard";
            }
          }
        } catch (e) {
          // Fallback to /admin
        }
      }
      router.push(destination);
    } else {
      setError(res.error || "Authentication failed.");
    }
  };

  const handleBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          secretKey: bootstrapSecret || undefined,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setBootstrapSuccess(true);
        // Automatically sign in with newly bootstrapped credentials
        await login("coo@digitaldictionary.in", password);
        setTimeout(() => {
          router.push("/admin");
        }, 1200);
      } else {
        setError(data.error || "Bootstrap setup failed.");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Failed to reach bootstrap service.");
    }
  };

  return (
    <div className="min-h-screen bg-[#101010] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Subtle gold ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block relative w-16 h-16 mx-auto mb-1">
            <Image
              src="/brand-logo.png"
              alt="Digital Dictionary"
              fill
              className="object-contain"
              priority
            />
          </Link>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            Digital Dictionary
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-[#E8D18A]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Executive Super Admin &amp; COO Desk</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-[#181818] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {bootstrapSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>Super Admin initialized! Redirecting to Executive Dashboard...</span>
            </div>
          )}

          {!isBootstrapMode ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-xs font-mono outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    placeholder="coo@digitaldictionary.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-xs font-mono outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] hover:from-[#A67C22] hover:to-[#D4AF37] text-[#101010] font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Enter Super Admin Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleBootstrap} className="space-y-5">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                <strong>Initial One-Time Bootstrap:</strong> This will create or update the primary Super Admin profile for <span className="font-mono font-bold text-[#E8D18A]">coo@digitaldictionary.in</span> and seed the catalogue.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  Set Initial Admin Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-xs font-mono outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    placeholder="Minimum 8 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  Bootstrap Security Key (Optional)
                </label>
                <input
                  type="password"
                  value={bootstrapSecret}
                  onChange={(e) => setBootstrapSecret(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  placeholder="Enter key if configured in .env"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] text-[#101010] font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Bootstrapping Account..." : "Initialize Super Admin"}
              </button>
            </form>
          )}

          {/* Mode Switcher */}
          <div className="pt-6 mt-6 border-t border-white/10 text-center flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={() => {
                setIsBootstrapMode(!isBootstrapMode);
                setError(null);
              }}
              className="text-[#E8D18A] hover:underline"
            >
              {isBootstrapMode ? "← Back to Normal Sign In" : "First Time Setup / Bootstrap"}
            </button>
            <Link href="/portal/login" className="hover:text-white transition-colors">
              Employee Portal →
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Digital Dictionary Internal System &middot; Government MSME Registered
        </div>
      </div>
    </div>
  );
}

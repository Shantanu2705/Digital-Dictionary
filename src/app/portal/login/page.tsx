"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle,
  KeyRound,
  GraduationCap,
  Briefcase
} from "lucide-react";

export default function PortalLoginPage() {
  const router = useRouter();
  const { login, changePassword, profile } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mandatory password change state
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changeLoading, setChangeLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      // Auth context loads profile
      router.push("/portal/dashboard");
    } catch (err: any) {
      console.error("Portal login error:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password. Please verify your credentials.");
      } else {
        setError(err.message || "Failed to authenticate. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setChangeLoading(true);
    setError(null);
    try {
      await changePassword(newPassword);
      router.push("/portal/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to update password.");
    } finally {
      setChangeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar */}
      <header className="border-b border-white/5 py-4 px-6 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/official-logo.png"
            alt="Digital Dictionary Logo"
            width={38}
            height={38}
            className="w-9 h-9 object-contain"
          />
          <div>
            <div className="text-sm font-bold tracking-tight text-white">Digital Dictionary</div>
            <div className="text-[10px] text-[#D4AF37] tracking-widest uppercase">Team & Intern Portal</div>
          </div>
        </Link>

        <Link
          href="/admin/login"
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          Super Admin Console →
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl p-8 shadow-2xl relative">
            {/* Top decorative gold line */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

            <div className="text-center space-y-2 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-neutral-950 border border-[#D4AF37]/30 mx-auto flex items-center justify-center shadow-inner">
                <Image
                  src="/official-logo.png"
                  alt="Emblem"
                  width={34}
                  height={34}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Employee & Intern Workspace
              </h1>
              <p className="text-xs text-neutral-400">
                Sign in to access your allocated projects, clearance documents, and stipend slips.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Corporate / Student Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@digitaldictionary.in"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#D4AF37]/60"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-neutral-300">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#D4AF37]/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black font-bold text-sm shadow-lg hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? "Authenticating..." : "Access Workspace"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/5 text-center text-[11px] text-neutral-500 space-y-1">
              <div>First time logging in with temporary credentials?</div>
              <div className="text-neutral-400">You will be prompted to establish your secure password upon login.</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 px-6 text-center text-xs text-neutral-500">
        Digital Dictionary · Proprietary & Confidential Enterprise Workspace · Govt. MSME Reg. UDYAM-WB-10-0098465
      </footer>
    </div>
  );
}

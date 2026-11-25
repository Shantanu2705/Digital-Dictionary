"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { 
  UserCheck, 
  Lock, 
  Mail, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle,
  KeyRound,
  GraduationCap,
  Briefcase
} from "lucide-react";

export default function PortalProfilePage() {
  const { user, profile, changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await changePassword(newPassword);
      setSuccess("Your account password has been updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to update password. You may need to re-login first.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <UserCheck className="w-6 h-6 text-[#D4AF37]" />
          Personnel Profile & Credentials
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Review your verified identity, designation, departmental affiliation, and update login credentials.
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            Official Identity
          </h2>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37]/30 to-neutral-800 border-2 border-[#D4AF37]/50 flex items-center justify-center font-bold text-lg text-[#E8D18A]">
              {profile?.fullName?.slice(0, 2).toUpperCase() || "DD"}
            </div>
            <div>
              <div className="text-lg font-bold text-white">{profile?.fullName}</div>
              <div className="text-xs text-[#D4AF37] font-medium">{profile?.designation}</div>
              <div className="text-[11px] text-neutral-500 font-mono mt-0.5">ID: {profile?.employeeId || "DD-STAFF"}</div>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-white/5 text-xs">
            <div>
              <span className="text-neutral-500 block">Corporate Email</span>
              <span className="text-neutral-200 font-medium">{profile?.email || user?.email}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Department</span>
              <span className="text-neutral-200 font-medium">{profile?.department || "Technology"}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Employment Classification</span>
              <span className="text-neutral-200 font-medium capitalize">{profile?.employmentType || "Permanent"}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Account Status</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mt-1">
                <CheckCircle className="w-3 h-3" />
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <KeyRound className="w-4 h-4 text-[#D4AF37]" />
            Update Portal Password
          </h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black font-semibold shadow hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? "Updating Credentials..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

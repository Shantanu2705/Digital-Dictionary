"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  UserCheck, 
  LogOut, 
  Menu, 
  X, 
  Lock,
  ChevronRight,
  ShieldCheck,
  GraduationCap
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
}

const PORTAL_NAV: NavItem[] = [
  { name: "My Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
  { name: "Assigned Clients", href: "/portal/clients", icon: Briefcase },
  { name: "My Documents & Slips", href: "/portal/documents", icon: FileText },
  { name: "Profile & Security", href: "/portal/profile", icon: UserCheck },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/portal/login" && !loading && !user) {
      router.push("/portal/login");
    }
  }, [pathname, user, loading, router]);

  // If on login page, render children directly without sidebar
  if (pathname === "/portal/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-400 font-mono">Authenticating Portal Workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden border-b border-white/10 px-4 py-3 flex items-center justify-between bg-neutral-950">
        <Link href="/portal/dashboard" className="flex items-center gap-2">
          <Image
            src="/official-logo.png"
            alt="Digital Dictionary"
            width={28}
            height={28}
            className="w-7 h-7 object-contain"
          />
          <span className="font-bold text-sm text-white">Digital Dictionary</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg border border-white/10 text-neutral-300"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar for Desktop */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-64 border-r border-white/10 bg-neutral-950/95 backdrop-blur-xl flex flex-col justify-between transition-transform duration-200
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-white/5">
          <Link href="/portal/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-[#D4AF37]/40 flex items-center justify-center">
              <Image
                src="/official-logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="w-7 h-7 object-contain"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight">Digital Dictionary</div>
              <div className="text-[10px] text-[#D4AF37] font-semibold tracking-wider uppercase">
                {profile?.employmentType === "intern" ? "Intern Workspace" : "Personnel Portal"}
              </div>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-neutral-900/60 border border-white/5 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37]/30 to-neutral-800 border border-[#D4AF37]/40 flex items-center justify-center font-bold text-xs text-[#E8D18A]">
              {profile?.fullName?.slice(0, 2).toUpperCase() || "DD"}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">{profile?.fullName || user.email}</div>
              <div className="text-[10px] text-neutral-400 truncate">{profile?.designation || "Staff Member"}</div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-[#D4AF37]">
            ID: {profile?.employeeId || "DD-STAFF"}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {PORTAL_NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#D4AF37] text-black font-semibold shadow"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/30 font-mono">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Logout */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-neutral-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out of Workspace
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen bg-black/90 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

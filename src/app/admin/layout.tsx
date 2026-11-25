"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  FilePlus, 
  Clock, 
  Package, 
  Settings, 
  ShieldAlert, 
  DollarSign, 
  Layers, 
  LogOut, 
  UserCheck, 
  Menu, 
  X,
  ChevronRight,
  ExternalLink,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

const ADMIN_NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Overview",
    items: [
      { name: "Executive Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "60-Min Onboarding", href: "/admin/onboarding", icon: Clock, badge: "Priority", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
    ],
  },
  {
    section: "Client Operations",
    items: [
      { name: "Client Directory", href: "/admin/clients", icon: Briefcase },
      { name: "Team Assignments", href: "/admin/assignments", icon: UserCheck },
      { name: "Service Packages", href: "/admin/packages", icon: Package },
    ],
  },
  {
    section: "Human Capital",
    items: [
      { name: "Permanent Employees", href: "/admin/employees", icon: Users },
      { name: "Intern Management", href: "/admin/interns", icon: GraduationCap },
      { name: "Payroll & Stipends", href: "/admin/payroll", icon: DollarSign },
    ],
  },
  {
    section: "Document Engine",
    items: [
      { name: "Document Centre", href: "/admin/documents", icon: FileText },
      { name: "PDF Generator", href: "/admin/documents/generate", icon: FilePlus, badge: "A4 Engine", badgeColor: "bg-[#D4AF37]/20 text-[#E8D18A] border-[#D4AF37]/40" },
      { name: "Document Templates", href: "/admin/templates", icon: Layers },
    ],
  },
  {
    section: "Governance",
    items: [
      { name: "Company Settings", href: "/admin/settings", icon: Settings },
      { name: "Audit & Security Logs", href: "/admin/audit", icon: ShieldAlert },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isSuperAdmin, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, render children directly without layout chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#E8D18A] font-medium">
            Authenticating Administrative Session...
          </p>
        </div>
      </div>
    );
  }

  // Access Control: Must be Super Admin or COO
  if (!user || !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full bg-[#181818] border border-white/10 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#D4AF37] flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-white mb-2">Restricted Super Admin Area</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              This system is reserved for Company Administrators &amp; the Chief Operating Officer (COO). Please sign in with authorized credentials.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              href="/admin/login"
              className="block w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] text-[#101010] font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all"
            >
              Sign In to Super Admin Desk
            </Link>
            <Link
              href="/"
              className="block w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white text-xs transition-colors"
            >
              Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs" 
        />
      )}

      {/* Enterprise Executive Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#121212] text-slate-300 border-r border-[#1F1F1F] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          {/* Brand Logo & System Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative w-9 h-9 shrink-0">
                <Image
                  src="/brand-logo.png"
                  alt="Digital Dictionary"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-xs font-serif font-bold text-white tracking-wide block">
                  DIGITAL DICTIONARY
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block">
                  Enterprise Suite
                </span>
              </div>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-170px)]">
            {ADMIN_NAV.map((grp) => (
              <div key={grp.section}>
                <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
                  {grp.section}
                </span>
                <div className="space-y-1">
                  {grp.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                          isActive 
                            ? "bg-gradient-to-r from-[#D4AF37]/20 to-[#E8D18A]/10 text-white border border-[#D4AF37]/40 font-bold shadow-xs" 
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={cn("w-4 h-4", isActive ? "text-[#D4AF37]" : "text-slate-500 group-hover:text-slate-300")} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className={cn("text-[9px] font-semibold px-2 py-0.5 rounded-full border", item.badgeColor)}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Identity & Logout at Bottom */}
        <div className="p-4 border-t border-white/10 bg-[#0C0C0C]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#E8D18A] flex items-center justify-center text-[#101010] font-bold text-xs shrink-0 shadow-xs">
                {profile?.fullName?.charAt(0) || "C"}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">
                  {profile?.fullName || "Chief Operating Officer"}
                </span>
                <span className="text-[10px] text-[#D4AF37] block font-mono truncate">
                  coo@digitaldictionary.in
                </span>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-400 hover:text-white transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen bg-[#0C0C0C]">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#121212]/95 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-[#D4AF37] font-semibold">Digital Dictionary</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-white font-medium capitalize">
                {pathname.replace("/admin", "").replace("/", "").replace("-", " ") || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/clients/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold uppercase tracking-wider border border-white/10 shadow-xs transition-all"
            >
              <span>+ New Client</span>
            </Link>
            <Link
              href="/admin/documents/generate"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-[#101010] text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
            >
              <span>Generate PDF</span>
            </Link>
          </div>
        </header>

        {/* Main View Container */}
        <main className="flex-1 p-6 md:p-8 bg-[#0C0C0C] text-white">
          {children}
        </main>
      </div>
    </div>
  );
}

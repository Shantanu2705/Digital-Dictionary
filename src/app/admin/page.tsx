"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Clock, 
  DollarSign, 
  ArrowUpRight, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  FilePlus,
  Package,
  ChevronRight,
  ShieldCheck,
  Send
} from "lucide-react";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Client, DocumentRecord, OnboardingTask } from "@/types/portal";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    closedWonClients: 0,
    totalEmployees: 0,
    totalInterns: 0,
    activeAccounts: 0,
    documentsGenerated: 0,
    pendingApprovals: 0,
    totalAgreedRevenue: 0,
    totalCollected: 0,
    totalOutstanding: 0,
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const clientsSnap = await getDocs(collection(db, "clients"));
        const clientList: Client[] = [];
        let agreedRev = 0;
        let collected = 0;
        let activeC = 0;
        let closedWon = 0;

        clientsSnap.forEach((doc) => {
          const c = { id: doc.id, ...doc.data() } as Client;
          clientList.push(c);
          agreedRev += Number(c.agreedAmount || 0);
          collected += Number(c.amountPaid || 0);
          if (c.projectStatus === "active") activeC++;
          if (c.projectStatus === "closed_won") closedWon++;
        });

        const [empSnap, intSnap, userSnap, docSnap] = await Promise.all([
          getDocs(collection(db, "employees")),
          getDocs(collection(db, "interns")),
          getDocs(collection(db, "users")),
          getDocs(query(collection(db, "documents"), orderBy("createdAt", "desc"), limit(6))),
        ]);

        const docList: DocumentRecord[] = [];
        docSnap.forEach((d) => docList.push({ id: d.id, ...d.data() } as DocumentRecord));

        setClients(clientList.slice(0, 5));
        setDocuments(docList);
        setStats({
          totalClients: clientList.length,
          activeClients: activeC,
          closedWonClients: closedWon,
          totalEmployees: empSnap.size,
          totalInterns: intSnap.size,
          activeAccounts: userSnap.size,
          documentsGenerated: docSnap.size,
          pendingApprovals: docList.filter((d) => d.status === "pending_review").length,
          totalAgreedRevenue: agreedRev,
          totalCollected: collected,
          totalOutstanding: Math.max(0, agreedRev - collected),
        });
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-white">
      {/* Executive Welcome & Kicker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
            Super Admin &middot; Executive Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Company Management Center
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time operations, client workflows, workforce management, and enterprise PDF generation.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/onboarding"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-all"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>60-Min Onboarding Desk</span>
          </Link>
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider border border-white/10 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
          </Link>
          <Link
            href="/admin/documents/generate"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] text-[#101010] text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
          >
            <FilePlus className="w-4 h-4" />
            <span>Generate Document</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Deck */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Metric 1: Total Clients */}
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/5 backdrop-blur-sm shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Total Clients</span>
            <div className="w-7 h-7 rounded-lg bg-neutral-950 border border-white/10 flex items-center justify-center text-[#D4AF37]">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.totalClients}</div>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {stats.activeClients} Active &middot; {stats.closedWonClients} Closed
          </span>
        </div>

        {/* Metric 2: Workforce */}
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/5 backdrop-blur-sm shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Workforce</span>
            <div className="w-7 h-7 rounded-lg bg-neutral-950 border border-white/10 flex items-center justify-center text-[#D4AF37]">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.totalEmployees + stats.totalInterns}</div>
          <span className="text-[10px] text-neutral-400 font-semibold block">
            {stats.totalEmployees} Permanent &middot; {stats.totalInterns} Interns
          </span>
        </div>

        {/* Metric 3: Active Accounts */}
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/5 backdrop-blur-sm shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Active Logins</span>
            <div className="w-7 h-7 rounded-lg bg-neutral-950 border border-white/10 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.activeAccounts}</div>
          <span className="text-[10px] text-emerald-400 font-semibold block">
            Role-Based Protected
          </span>
        </div>

        {/* Metric 4: Documents Generated */}
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/5 backdrop-blur-sm shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Official PDFs</span>
            <div className="w-7 h-7 rounded-lg bg-neutral-950 border border-white/10 flex items-center justify-center text-[#E8D18A]">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.documentsGenerated}</div>
          <span className="text-[10px] text-[#E8D18A] font-semibold block">
            {stats.pendingApprovals} Pending Approval
          </span>
        </div>

        {/* Metric 5: Revenue Agreed */}
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/5 backdrop-blur-sm shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Contracted Book</span>
            <div className="w-7 h-7 rounded-lg bg-neutral-950 border border-white/10 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#E8D18A] font-mono">
            ₹{stats.totalAgreedRevenue.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block">
            Verified Value
          </span>
        </div>

        {/* Metric 6: Outstanding Balance */}
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/5 backdrop-blur-sm shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Outstanding</span>
            <div className="w-7 h-7 rounded-lg bg-neutral-950 border border-white/10 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono">
            ₹{stats.totalOutstanding.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-neutral-400 font-semibold block">
            Pending Milestones
          </span>
        </div>
      </div>

      {/* 60-Minute Client Onboarding Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white border border-[#D4AF37]/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8D18A]">
              First 60-Minutes Client Onboarding Engine
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Rapid Document Generation &amp; Client Handover SLA
          </h3>
          <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
            When a client status is marked &ldquo;Closed &mdash; Won&rdquo;, our 60-minute automated checklist triggers to prepare the Client Agreement, Welcome Document, Invoice, Quotation, Delivery Guide, and Package Menu.
          </p>
        </div>

        <Link
          href="/admin/onboarding"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-[#101010] text-xs font-bold uppercase tracking-wider shadow hover:brightness-110 transition-all whitespace-nowrap flex items-center gap-1.5"
        >
          <span>Open Onboarding Desk</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Split Section: Recent Clients & Recently Generated PDFs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Recent Clients */}
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 backdrop-blur-sm shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-sm font-bold text-white">Recent Client Engagements</h3>
            </div>
            <Link href="/admin/clients" className="text-xs text-[#D4AF37] hover:underline font-semibold flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {clients.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400 space-y-3">
              <p>No client records created yet.</p>
              <Link
                href="/admin/clients/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-800 text-white text-xs font-semibold hover:bg-neutral-700"
              >
                <Plus className="w-3.5 h-3.5" /> Create First Client
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {clients.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/clients/${c.id}`}
                  className="p-3.5 rounded-xl border border-white/5 hover:border-[#D4AF37]/50 transition-all flex items-center justify-between group bg-neutral-950/60 hover:bg-neutral-900"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                      {c.companyName || c.clientName}
                    </h4>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">
                      {c.projectName} &middot; ₹{Number(c.agreedAmount || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-800 border border-white/10 text-neutral-300 uppercase">
                      {c.projectStatus.replace("_", " ")}
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Documents */}
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 backdrop-blur-sm shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-sm font-bold text-white">Official Document Registry</h3>
            </div>
            <Link href="/admin/documents" className="text-xs text-[#D4AF37] hover:underline font-semibold flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {documents.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400 space-y-3">
              <p>No official documents generated yet.</p>
              <Link
                href="/admin/documents/generate"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-[#101010] text-xs font-bold"
              >
                <FilePlus className="w-3.5 h-3.5" /> Generate First PDF
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((d) => (
                <div
                  key={d.id}
                  className="p-3.5 rounded-xl border border-white/5 flex items-center justify-between bg-neutral-950/60"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {d.title}
                    </h4>
                    <span className="text-[11px] text-[#E8D18A] font-mono block mt-0.5">
                      {d.documentNumber} &middot; {d.clientName || d.relatedUserName || "General"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-800 border border-white/10 text-neutral-300 uppercase">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Access Operational Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/admin/assignments"
          className="p-5 rounded-2xl bg-neutral-900/60 border border-white/5 hover:border-[#D4AF37]/50 shadow-xs hover:shadow-md transition-all group backdrop-blur-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-white/10 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
            Team Assignments
          </h4>
          <p className="text-xs text-neutral-400 mt-1">
            Assign primary &amp; additional developers to clients.
          </p>
        </Link>

        <Link
          href="/admin/interns"
          className="p-5 rounded-2xl bg-neutral-900/60 border border-white/5 hover:border-[#D4AF37]/50 shadow-xs hover:shadow-md transition-all group backdrop-blur-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-white/10 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
            Intern Management
          </h4>
          <p className="text-xs text-neutral-400 mt-1">
            College details, NOC generator &amp; stipend slips.
          </p>
        </Link>

        <Link
          href="/admin/packages"
          className="p-5 rounded-2xl bg-neutral-900/60 border border-white/5 hover:border-[#D4AF37]/50 shadow-xs hover:shadow-md transition-all group backdrop-blur-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-white/10 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Package className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
            Service Catalogue
          </h4>
          <p className="text-xs text-neutral-400 mt-1">
            11 official packages &amp; Custom Package Builder.
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="p-5 rounded-2xl bg-neutral-900/60 border border-white/5 hover:border-[#D4AF37]/50 shadow-xs hover:shadow-md transition-all group backdrop-blur-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-white/10 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
            Brand &amp; Signatures
          </h4>
          <p className="text-xs text-neutral-400 mt-1">
            Official proprietor mark, CEO stamp &amp; settings.
          </p>
        </Link>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Filter, 
  Briefcase, 
  Clock, 
  ArrowUpRight, 
  ChevronRight, 
  ExternalLink,
  DollarSign,
  UserCheck
} from "lucide-react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Client, ClientStatus } from "@/types/portal";
import { cn } from "@/lib/utils";

const STATUS_TABS: { label: string; value: ClientStatus | "all" }[] = [
  { label: "All Clients", value: "all" },
  { label: "Active", value: "active" },
  { label: "Closed — Won", value: "closed_won" },
  { label: "Proposal Sent", value: "proposal_sent" },
  { label: "Leads", value: "lead" },
  { label: "Completed", value: "completed" },
  { label: "Archived", value: "archived" },
];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ClientStatus | "all">("all");

  useEffect(() => {
    async function loadClients() {
      try {
        const snap = await getDocs(collection(db, "clients"));
        const list: Client[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Client));
        setClients(list);
      } catch (err) {
        console.warn("Could not fetch clients from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }
    loadClients();
  }, []);

  const filtered = clients.filter((c) => {
    const matchesSearch = 
      c.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || c.projectStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">
            Client Portfolio
          </span>
          <h1 className="text-2xl font-serif font-bold text-white">
            Client Management Directory
          </h1>
          <p className="text-xs text-slate-400">
            Maintain client records, project scope, team assignments, contracts and invoices.
          </p>
        </div>

        <Link
          href="/admin/clients/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] text-[#101010] text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </Link>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, contact person, project or ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white placeholder:text-slate-500 text-xs outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border",
                selectedStatus === tab.value
                  ? "bg-[#D4AF37] text-[#101010] border-[#D4AF37] font-bold shadow-xs"
                  : "bg-[#181818] border-white/10 text-slate-400 hover:border-[#D4AF37]/50 hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-[#121212] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
            <span>Loading client records...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-3">
            <Briefcase className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="font-semibold text-white">No client records found.</p>
            <p className="text-slate-400">Try searching for a different company name or create a new client record.</p>
            <Link
              href="/admin/clients/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D4AF37] text-[#101010] text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Client
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181818] border-b border-white/10 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Client ID</th>
                  <th className="py-3.5 px-4">Company &amp; Contact</th>
                  <th className="py-3.5 px-4">Project Scope</th>
                  <th className="py-3.5 px-4">Agreed Value</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Team Assignment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#E8D18A]">
                      {c.clientId || "DD-CLI-001"}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{c.companyName || c.clientName}</div>
                      <div className="text-[11px] text-slate-400">
                        {c.contactPerson} &middot; {c.phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{c.projectName}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {c.selectedPackageName || "Custom Architecture"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      ₹{Number(c.agreedAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-md border",
                        c.paymentStatus === "paid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        c.paymentStatus === "partial" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      )}>
                        {c.paymentStatus ? c.paymentStatus.toUpperCase() : "UNPAID"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {c.primaryEmployeeName ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-white font-semibold">
                          <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {c.primaryEmployeeName}
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
                        {c.projectStatus.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/clients/${c.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#D4AF37] hover:text-[#E8D18A] hover:underline"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

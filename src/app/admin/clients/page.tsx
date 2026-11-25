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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E2]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#A67C22] block mb-1">
            Client Portfolio
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#101010]">
            Client Management Directory
          </h1>
          <p className="text-xs text-[#777777]">
            Maintain client records, project scope, team assignments, contracts and invoices.
          </p>
        </div>

        <Link
          href="/admin/clients/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] text-[#101010] text-xs font-bold uppercase tracking-wider shadow-xs hover:scale-[1.01] transition-all self-start sm:self-auto"
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
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E5E2] bg-white text-xs outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
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
                  ? "bg-[#101010] text-white border-[#101010]"
                  : "bg-white border-[#E5E5E2] text-[#777777] hover:border-[#D4AF37] hover:text-[#101010]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl border border-[#E5E5E2] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#777777] flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
            <span>Loading client records...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#777777] space-y-3">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-[#101010]">No client records found.</p>
            <p>Try searching for a different company name or create a new client record.</p>
            <Link
              href="/admin/clients/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#101010] text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Client
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F2F0] border-b border-[#E5E5E2] text-[10px] uppercase font-bold text-[#777777] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Client ID</th>
                  <th className="py-3 px-4">Company &amp; Contact</th>
                  <th className="py-3 px-4">Project Scope</th>
                  <th className="py-3 px-4">Agreed Value</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Team Assignment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E2]">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#A67C22]">
                      {c.clientId || "DD-CLI-001"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#101010]">{c.companyName || c.clientName}</div>
                      <div className="text-[11px] text-[#777777]">
                        {c.contactPerson} &middot; {c.phone}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#101010]">{c.projectName}</div>
                      <div className="text-[11px] text-[#777777] truncate max-w-xs">
                        {c.selectedPackageName || "Custom Architecture"}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#101010]">
                      ₹{Number(c.agreedAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-md border",
                        c.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        c.paymentStatus === "partial" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-rose-50 text-rose-700 border-rose-200"
                      )}>
                        {c.paymentStatus ? c.paymentStatus.toUpperCase() : "UNPAID"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {c.primaryEmployeeName ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#101010] font-semibold">
                          <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {c.primaryEmployeeName}
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F2F2F0] text-[#101010] border border-[#E5E5E2]">
                        {c.projectStatus.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/clients/${c.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#A67C22] hover:underline"
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

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  UserCheck, 
  Search, 
  Users, 
  Briefcase, 
  ChevronRight, 
  Plus, 
  X, 
  Check, 
  AlertCircle,
  Clock,
  ShieldCheck
} from "lucide-react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Client, UserProfile } from "@/types/portal";
import { logActivity } from "@/lib/utils/audit";
import { cn } from "@/lib/utils";

export default function ClientAssignmentsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "unassigned" | "assigned">("all");

  // Assignment Modal State
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [primaryEmployeeId, setPrimaryEmployeeId] = useState("");
  const [additionalEmployeeIds, setAdditionalEmployeeIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [clientSnap, empSnap] = await Promise.all([
          getDocs(collection(db, "clients")),
          getDocs(collection(db, "users")),
        ]);

        const cList: Client[] = [];
        clientSnap.forEach((d) => cList.push({ id: d.id, ...d.data() } as Client));
        setClients(cList);

        const eList: UserProfile[] = [];
        empSnap.forEach((d) => eList.push(d.data() as UserProfile));
        setEmployees(eList);
      } catch (err) {
        console.warn("Could not fetch assignments data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const openAssignModal = (client: Client) => {
    setSelectedClient(client);
    setPrimaryEmployeeId(client.primaryEmployeeId || "");
    setAdditionalEmployeeIds(client.assignedEmployeeIds?.filter(id => id !== client.primaryEmployeeId) || []);
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    setSaving(true);

    try {
      const primaryEmp = employees.find(e => e.uid === primaryEmployeeId);
      const allAssignedIds = primaryEmployeeId 
        ? [primaryEmployeeId, ...additionalEmployeeIds.filter(id => id !== primaryEmployeeId)]
        : additionalEmployeeIds;

      const updates: Partial<Client> = {
        primaryEmployeeId: primaryEmployeeId || "",
        primaryEmployeeName: primaryEmp?.fullName || "",
        assignedEmployeeIds: allAssignedIds,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, "clients", selectedClient.id), updates);

      // Update employee profiles assignedClientIds
      for (const empId of allAssignedIds) {
        const emp = employees.find(e => e.uid === empId);
        if (emp) {
          const currentClients = emp.assignedClientIds || [];
          if (!currentClients.includes(selectedClient.id)) {
            await updateDoc(doc(db, "users", empId), {
              assignedClientIds: [...currentClients, selectedClient.id],
            });
          }
        }
      }

      setClients(prev => prev.map(c => c.id === selectedClient.id ? { ...c, ...updates } : c));
      setSelectedClient(null);

      await logActivity({
        userId: "admin",
        userEmail: "coo@digitaldictionary.in",
        action: "ASSIGN_CLIENT",
        entityType: "assignment",
        entityId: selectedClient.id,
        details: `Assigned client ${selectedClient.companyName} to ${primaryEmp?.fullName || "Unassigned"} and ${additionalEmployeeIds.length} team members`,
      });
    } catch (err: any) {
      alert(`Assignment failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const filtered = clients.filter(c => {
    const matchesSearch = 
      c.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.primaryEmployeeName?.toLowerCase().includes(searchQuery.toLowerCase());

    const isUnassigned = !c.primaryEmployeeId && (!c.assignedEmployeeIds || c.assignedEmployeeIds.length === 0);
    if (filterMode === "unassigned") return matchesSearch && isUnassigned;
    if (filterMode === "assigned") return matchesSearch && !isUnassigned;
    return matchesSearch;
  });

  // Calculate workloads
  const workloadMap: Record<string, number> = {};
  clients.forEach(c => {
    (c.assignedEmployeeIds || []).forEach(empId => {
      workloadMap[empId] = (workloadMap[empId] || 0) + 1;
    });
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">
            Workforce &amp; Client Allocation
          </span>
          <h1 className="text-2xl font-serif font-bold text-white">
            Client Assignment Management
          </h1>
          <p className="text-xs text-slate-400">
            Assign primary engineers, architects and interns to client platforms. Controls employee portal access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-colors",
              filterMode === "all" ? "bg-[#D4AF37] text-[#101010] border-[#D4AF37] font-bold" : "bg-[#181818] border-white/10 text-slate-400 hover:text-white"
            )}
          >
            All ({clients.length})
          </button>
          <button
            onClick={() => setFilterMode("unassigned")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-colors",
              filterMode === "unassigned" ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold" : "bg-[#181818] border-white/10 text-amber-400 hover:text-white"
            )}
          >
            Unassigned ({clients.filter(c => !c.primaryEmployeeId).length})
          </button>
          <button
            onClick={() => setFilterMode("assigned")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-colors",
              filterMode === "assigned" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold" : "bg-[#181818] border-white/10 text-emerald-400 hover:text-white"
            )}
          >
            Assigned ({clients.filter(c => c.primaryEmployeeId).length})
          </button>
        </div>
      </div>

      {/* Team Workload Pill Deck */}
      <div className="p-5 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wide">
            Current Team Workload Matrix
          </span>
          <span className="text-[11px] text-slate-400">
            Active project allocations per engineer
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {employees.map((emp) => {
            const load = workloadMap[emp.uid] || 0;
            return (
              <div
                key={emp.uid}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181818] border border-white/10 text-xs text-white"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#E8D18A] text-[#101010] flex items-center justify-center font-bold text-[10px]">
                  {emp.fullName?.charAt(0) || "E"}
                </div>
                <span className="font-semibold text-white">{emp.fullName}</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border",
                  load > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-slate-400 border-white/5"
                )}>
                  {load} {load === 1 ? "Client" : "Clients"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by client, project name or assigned lead..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white placeholder:text-slate-500 text-xs outline-none focus:border-[#D4AF37]"
        />
      </div>

      {/* Assignment Table */}
      <div className="bg-[#121212] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading assignment data...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No matching clients found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181818] border-b border-white/10 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Client / Brand</th>
                  <th className="py-3.5 px-4">Project &amp; Package</th>
                  <th className="py-3.5 px-4">Primary Assigned Lead</th>
                  <th className="py-3.5 px-4">Additional Team Members</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((c) => {
                  const additionalCount = (c.assignedEmployeeIds?.length || 0) - (c.primaryEmployeeId ? 1 : 0);
                  return (
                    <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{c.companyName || c.clientName}</div>
                        <span className="text-[10px] font-mono text-[#E8D18A]">{c.clientId}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{c.projectName}</div>
                        <div className="text-[11px] text-slate-400">{c.selectedPackageName || "Custom Architecture"}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {c.primaryEmployeeName ? (
                          <span className="inline-flex items-center gap-1.5 font-bold text-white">
                            <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                            {c.primaryEmployeeName}
                          </span>
                        ) : (
                          <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md text-[10px] font-bold">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {additionalCount > 0 ? (
                          <span className="text-xs text-white font-medium">
                            +{additionalCount} assigned member(s)
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
                          {c.projectStatus.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openAssignModal(c)}
                          className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-all cursor-pointer border border-white/10 shadow-xs"
                        >
                          {c.primaryEmployeeId ? "Reassign" : "Assign Team"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveAssignment} className="bg-[#121212] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-white/10 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">Assign Client Team</h3>
                <span className="text-xs text-[#E8D18A] font-semibold">{selectedClient.companyName} ({selectedClient.projectName})</span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedClient(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1.5 uppercase tracking-wider">
                Primary Assigned Lead / Engineer *
              </label>
              <select
                required
                value={primaryEmployeeId}
                onChange={(e) => setPrimaryEmployeeId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white text-xs font-semibold outline-none focus:border-[#D4AF37]"
              >
                <option value="" className="bg-[#181818] text-white">-- Select Primary Lead --</option>
                {employees.map((emp) => (
                  <option key={emp.uid} value={emp.uid} className="bg-[#181818] text-white">
                    {emp.fullName} &mdash; {emp.designation} ({emp.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1.5 uppercase tracking-wider">
                Additional Pod Members (Select multiple)
              </label>
              <div className="max-h-40 overflow-y-auto space-y-1.5 p-3 rounded-xl border border-white/10 bg-[#181818]">
                {employees
                  .filter((emp) => emp.uid !== primaryEmployeeId)
                  .map((emp) => {
                    const isChecked = additionalEmployeeIds.includes(emp.uid);
                    return (
                      <label 
                        key={emp.uid} 
                        className="flex items-center gap-2.5 text-xs text-white cursor-pointer hover:bg-white/5 p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAdditionalEmployeeIds([...additionalEmployeeIds, emp.uid]);
                            } else {
                              setAdditionalEmployeeIds(additionalEmployeeIds.filter(id => id !== emp.uid));
                            }
                          }}
                          className="rounded text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37]"
                        />
                        <span className="font-semibold text-white">{emp.fullName}</span>
                        <span className="text-slate-400">({emp.designation})</span>
                      </label>
                    );
                  })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] text-[#101010] text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? "Saving Allocation..." : "Confirm Assignment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

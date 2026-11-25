"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { ActivityLog } from "@/types/portal";
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Clock, 
  User, 
  FileText, 
  Key, 
  Lock,
  Layers,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"), limit(100));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ActivityLog));
      setLogs(list);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(l => {
    const matchesSearch = 
      l.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEntity = selectedEntity === "all" || l.entityType === selectedEntity;
    return matchesSearch && matchesEntity;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-[#D4AF37]" />
            Activity & Security Audit Trail
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Immutable system event log tracking authentication events, document generation, and access permissions.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-white/10 transition-colors"
        >
          <Clock className="w-3.5 h-3.5" />
          Refresh Event Feed
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by actor, action description, details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Entity Scope:</span>
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
          >
            <option value="all">All Entities</option>
            <option value="auth">Authentication & Access</option>
            <option value="client">Client Operations</option>
            <option value="employee">Permanent Personnel</option>
            <option value="intern">Intern Cohort</option>
            <option value="document">Document Engine</option>
            <option value="assignment">Team Allocations</option>
            <option value="settings">Governance Settings</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-neutral-400">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading security log feed...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 space-y-3">
            <ShieldAlert className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-base font-medium text-neutral-300">No activity events logged yet</p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              System actions such as user creation, login attempts, document generation, and status changes are automatically recorded here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="bg-neutral-950/80 text-xs uppercase tracking-wider text-neutral-400 border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Scope</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                {filteredLogs.map((log, index) => (
                  <tr key={log.id || index} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-neutral-400 whitespace-nowrap">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString("en-IN") : "N/A"}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <div className="text-white font-medium">{log.userEmail}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">{log.userId}</div>
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-[#E8D18A]">
                      {log.action}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded uppercase text-[10px] font-bold tracking-wider bg-white/5 text-neutral-300 border border-white/10">
                        {log.entityType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-neutral-300">
                      {log.details}
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

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/auth/AuthContext";
import { Client } from "@/types/portal";
import { 
  Briefcase, 
  Search, 
  Clock, 
  Building2, 
  Phone, 
  Mail, 
  Calendar, 
  Globe, 
  CheckCircle,
  FileText
} from "lucide-react";

export default function PortalAssignedClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user?.uid) {
      loadAssignedClients();
    }
  }, [user?.uid]);

  const loadAssignedClients = async () => {
    setLoading(true);
    try {
      // Fetch clients directly assigned to user or through assignments
      const q = query(
        collection(db, "clients"),
        where("primaryEmployeeId", "==", user?.uid)
      );
      const snap = await getDocs(q);
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Client));

      // Also check assignments
      const assignQ = query(
        collection(db, "assignments"),
        where("primaryEmployeeId", "==", user?.uid)
      );
      const assignSnap = await getDocs(assignQ);
      for (const aDoc of assignSnap.docs) {
        const cId = aDoc.data().clientId;
        if (!list.some(c => c.id === cId)) {
          const cliQ = query(collection(db, "clients"), where("id", "==", cId));
          const cliSnap = await getDocs(cliQ);
          cliSnap.forEach(d => list.push({ id: d.id, ...d.data() } as Client));
        }
      }

      setClients(list);
    } catch (err) {
      console.error("Error loading assigned clients:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Briefcase className="w-6 h-6 text-[#D4AF37]" />
          My Assigned Client Projects
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Strictly restricted workspace view displaying only client projects allocated to your engineering purview.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, client companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
      </div>

      {/* Clients Grid */}
      {loading ? (
        <div className="py-20 text-center text-neutral-400">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading assigned project workspaces...
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="py-20 text-center space-y-3 rounded-xl border border-white/5 bg-neutral-900/40">
          <Briefcase className="w-12 h-12 text-neutral-600 mx-auto" />
          <p className="text-base font-semibold text-white">No Assigned Projects</p>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            You do not currently have any clients or projects linked to your account. When management allocates a deployment to you, its scope and technical specifications will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="rounded-xl border border-white/5 bg-neutral-900/50 backdrop-blur-sm p-6 space-y-4 hover:border-[#D4AF37]/30 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#E8D18A] uppercase tracking-wider">
                    {client.clientId}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{client.companyName}</h3>
                  <div className="text-xs text-neutral-400">{client.projectName}</div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${
                  client.projectStatus === "active"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                }`}>
                  {client.projectStatus?.replace("_", " ")}
                </span>
              </div>

              {/* Package & Scope Details */}
              <div className="p-3.5 rounded-lg bg-neutral-950/80 border border-white/5 space-y-1.5 text-xs">
                <div className="text-neutral-400">
                  <span className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px] block">
                    Selected Package
                  </span>
                  <span className="text-white font-medium">{client.selectedPackageName || "Custom Solution Architecture"}</span>
                </div>
                {client.projectDescription && (
                  <p className="text-neutral-400 text-xs mt-1 line-clamp-2">
                    {client.projectDescription}
                  </p>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-1 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Contact: {client.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{client.phone}</span>
                  </div>
                )}
              </div>

              {/* Delivery Timeline */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Delivery: {client.expectedDeliveryDate || "In Progress"}</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">SLA Protected</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/auth/AuthContext";
import { Client, DocumentRecord, ClientAssignment } from "@/types/portal";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Clock, 
  ExternalLink, 
  CheckCircle, 
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  GraduationCap
} from "lucide-react";
import { generateInternNocPDF, generatePayslipPDF } from "@/lib/pdf/pdfEngine";

export default function PortalDashboardPage() {
  const { user, profile } = useAuth();
  const [assignedClients, setAssignedClients] = useState<Client[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      loadPortalData();
    }
  }, [user?.uid]);

  const loadPortalData = async () => {
    setLoading(true);
    try {
      // 1. Fetch assigned clients
      // We check where primaryEmployeeId == uid or assignedEmployeeIds array-contains uid
      const clientsQ = query(
        collection(db, "clients"),
        where("primaryEmployeeId", "==", user?.uid)
      );
      const clientsSnap = await getDocs(clientsQ);
      let list = clientsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Client));

      // Also check assignments collection
      const assignQ = query(
        collection(db, "assignments"),
        where("primaryEmployeeId", "==", user?.uid)
      );
      const assignSnap = await getDocs(assignQ);
      const clientIdsFromAssign = assignSnap.docs.map(d => d.data().clientId);

      // If clientIds exist that aren't in list, fetch them
      for (const cId of clientIdsFromAssign) {
        if (!list.some(c => c.id === cId)) {
          const cliQ = query(collection(db, "clients"), where("id", "==", cId));
          const cliSnap = await getDocs(cliQ);
          cliSnap.forEach(d => list.push({ id: d.id, ...d.data() } as Client));
        }
      }
      setAssignedClients(list);

      // 2. Fetch documents relating to this user
      const docsQ = query(
        collection(db, "documents"),
        where("relatedUserId", "==", user?.uid)
      );
      const docsSnap = await getDocs(docsQ);
      setDocuments(docsSnap.docs.map(d => ({ id: d.id, ...d.data() } as DocumentRecord)));
    } catch (err) {
      console.error("Portal dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const isIntern = profile?.employmentType === "intern";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-r from-neutral-900/80 via-neutral-900/40 to-neutral-950 p-6 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
              {isIntern ? "Academic Mentorship Portal" : "Engineering Workspace"}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Welcome back, {profile?.fullName || user?.email?.split("@")[0]}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {profile?.designation} · {profile?.department} · ID: <span className="font-mono text-white">{profile?.employeeId || "DD-STAFF"}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/portal/documents"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            Access My Documents
          </Link>
          <Link
            href="/portal/clients"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-xs font-bold shadow hover:brightness-110 transition-all"
          >
            <Briefcase className="w-4 h-4" />
            My Active Projects
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
            Assigned Client Deployments
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {assignedClients.length}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">Under your engineering purview</div>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
            {isIntern ? "College Clearance / NOC" : "Monthly Payslips"}
          </div>
          <div className="text-2xl font-bold text-[#E8D18A] mt-1">
            {documents.length}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">Authorised records available</div>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
            Account Status
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">Verified organizational access</div>
        </div>
      </div>

      {/* Grid: Assigned Clients & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocated Projects */}
        <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#D4AF37]" />
              My Assigned Client Deployments
            </h2>
            <Link href="/portal/clients" className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1">
              View All
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-neutral-400">Loading assignments...</div>
          ) : assignedClients.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Briefcase className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400">No client projects currently assigned to your account.</p>
              <p className="text-[11px] text-neutral-500">Contact your operations manager or COO for deployment allocation.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {assignedClients.slice(0, 4).map((cli) => (
                <div key={cli.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white text-xs">{cli.companyName}</div>
                    <div className="text-[11px] text-neutral-400">{cli.projectName}</div>
                    <div className="text-[10px] text-neutral-500 font-mono mt-0.5">ID: {cli.clientId}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${
                    cli.projectStatus === "active"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  }`}>
                    {cli.projectStatus?.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Authorised Documents */}
        <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              My Official Documents & Slips
            </h2>
            <Link href="/portal/documents" className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1">
              View All
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-neutral-400">Loading documents...</div>
          ) : documents.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <FileText className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400">No documents registered to your account yet.</p>
              <p className="text-[11px] text-neutral-500">Your offer letters, clearance NOCs, and payslips will appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {documents.slice(0, 4).map((docItem) => (
                <div key={docItem.id} className="p-3 rounded-lg bg-neutral-950/60 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">{docItem.title}</div>
                    <div className="text-[10px] text-[#E8D18A] font-mono">{docItem.documentNumber}</div>
                  </div>
                  <Link
                    href="/portal/documents"
                    className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
                  >
                    Download
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

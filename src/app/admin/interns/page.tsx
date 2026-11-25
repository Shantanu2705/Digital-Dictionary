"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { InternRecord } from "@/types/portal";
import { 
  GraduationCap, 
  UserPlus, 
  Search, 
  Building2, 
  Calendar, 
  DollarSign, 
  Mail, 
  Phone, 
  FileCheck2, 
  ExternalLink,
  BookOpen
} from "lucide-react";
import { generateInternNocPDF, generateInternOfferPDF } from "@/lib/pdf/pdfEngine";

export default function InternsListPage() {
  const [interns, setInterns] = useState<InternRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "interns"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as InternRecord));
      setInterns(list);
    } catch (err) {
      console.error("Failed to load interns:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadNOC = (intern: InternRecord) => {
    const data = {
      nocNumber: `DD-NOC-${new Date().getFullYear()}-${intern.internId.replace(/[^0-9]/g, "") || "001"}`,
      internName: intern.fullName,
      collegeName: intern.collegeName,
      universityName: intern.universityName || intern.collegeName,
      course: intern.course,
      semester: intern.semester || "Final Year",
      rollNumber: intern.collegeRollNo || "N/A",
      department: intern.department,
      supervisorName: intern.assignedSupervisor || "Engineering Lead",
      startDate: intern.startDate,
      endDate: intern.endDate,
      durationMonths: intern.durationMonths || 3,
      internshipMode: intern.internshipMode || "Remote",
      monthlyStipend: intern.monthlyStipend || 0,
      reportingDate: intern.startDate,
    };
    const pdf = generateInternNocPDF(data);
    pdf.doc.save(`College_NOC_${intern.fullName.replace(/\s+/g, "_")}.pdf`);
  };

  const filteredInterns = interns.filter((i) => {
    const matchesSearch = 
      i.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.internId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.collegeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.internshipRole?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || i.accountStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-[#D4AF37]" />
            Intern Management & College NOC Desk
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Student cohort directory, university affiliations, stipend records and official institutional clearances.
          </p>
        </div>
        <Link
          href="/admin/interns/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black font-semibold text-sm shadow-md hover:brightness-110 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Enrol New Intern
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Active Cohort</div>
          <div className="text-2xl font-bold text-white mt-1">
            {interns.filter(i => i.accountStatus === "active").length}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">Under active mentorship</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Colleges / Universities</div>
          <div className="text-2xl font-bold text-[#E8D18A] mt-1">
            {new Set(interns.map(i => i.collegeName).filter(Boolean)).size}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">Partner institutions</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Completed Alumni</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {interns.filter(i => i.accountStatus === "completed").length}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">Graduated interns</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Monthly Stipend Outlay</div>
          <div className="text-2xl font-bold text-[#D4AF37] mt-1">
            ₹{interns.filter(i => i.accountStatus === "active").reduce((acc, curr) => acc + (Number(curr.monthlyStipend) || 0), 0).toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">Total monthly disbursement</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by intern name, college, ID, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400">Cohort Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="extended">Extended</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>

      {/* Interns Table */}
      <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-neutral-400">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading intern cohort records...
          </div>
        ) : filteredInterns.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 space-y-3">
            <GraduationCap className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-base font-medium text-neutral-300">No interns found</p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {interns.length === 0
                ? "Click 'Enrol New Intern' to register student talent, issue college NOCs, and provision portal accounts."
                : "No interns match the current search filters."}
            </p>
            {interns.length === 0 && (
              <Link
                href="/admin/interns/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold hover:bg-[#D4AF37]/20 transition-all mt-2"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Enrol First Intern
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="bg-neutral-950/80 text-xs uppercase tracking-wider text-neutral-400 border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Intern & ID</th>
                  <th className="py-3 px-4">College & Degree</th>
                  <th className="py-3 px-4">Role & Supervisor</th>
                  <th className="py-3 px-4">Duration & Mode</th>
                  <th className="py-3 px-4">Stipend</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInterns.map((intern) => (
                  <tr key={intern.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF37]/20 to-neutral-800 border border-[#D4AF37]/30 flex items-center justify-center font-bold text-xs text-[#E8D18A]">
                          {intern.fullName?.slice(0, 2).toUpperCase() || "IN"}
                        </div>
                        <div>
                          <Link
                            href={`/admin/interns/${intern.id}`}
                            className="font-medium text-white hover:text-[#D4AF37] transition-colors"
                          >
                            {intern.fullName}
                          </Link>
                          <div className="text-xs text-neutral-500 font-mono">{intern.internId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-neutral-200 line-clamp-1">{intern.collegeName}</div>
                      <div className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                        <BookOpen className="w-3 h-3 text-neutral-500" />
                        {intern.course} {intern.semester ? `(${intern.semester})` : ""}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-neutral-200 font-medium">{intern.internshipRole}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">Lead: {intern.assignedSupervisor}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="text-neutral-200 font-mono">{intern.durationMonths} Months</div>
                      <div className="text-neutral-500 capitalize">{intern.internshipMode}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono font-medium text-[#E8D18A]">
                      ₹{(intern.monthlyStipend || 0).toLocaleString("en-IN")}
                      <div className="text-[10px] text-neutral-500 font-sans">/ month</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium capitalize border ${
                        intern.accountStatus === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : intern.accountStatus === "completed"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          : "bg-neutral-800 text-neutral-400 border-white/10"
                      }`}>
                        {intern.accountStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleDownloadNOC(intern)}
                          title="Generate Official College Clearance NOC PDF"
                          className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-medium transition-colors"
                        >
                          NOC
                        </button>
                        <Link
                          href={`/admin/interns/${intern.id}`}
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium border border-white/5 transition-colors"
                        >
                          Desk
                        </Link>
                      </div>
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

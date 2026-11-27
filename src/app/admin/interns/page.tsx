"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/auth/AuthContext";
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
  BookOpen,
  KeyRound,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
  ShieldCheck
} from "lucide-react";
import { generateInternNocPDF, generateInternOfferPDF } from "@/lib/pdf/pdfEngine";

export default function InternsListPage() {
  const { user } = useAuth();
  const [interns, setInterns] = useState<InternRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Quick Credentials Modal state
  const [credIntern, setCredIntern] = useState<InternRecord | null>(null);
  const [showCredModal, setShowCredModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Quick Delete Modal state
  const [deleteTarget, setDeleteTarget] = useState<InternRecord | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      documentNumber: `DD-NOC-${new Date().getFullYear()}-${intern.internId.replace(/[^0-9]/g, "") || "001"}`,
      internName: intern.fullName,
      fullName: intern.fullName,
      email: intern.email,
      phone: intern.phone,
      collegeName: intern.collegeName,
      universityName: intern.universityName || intern.collegeName,
      course: intern.course,
      semester: intern.semester || "Final Year",
      rollNumber: intern.collegeRollNo || "N/A",
      collegeRollNo: intern.collegeRollNo || "N/A",
      department: intern.department,
      role: intern.internshipRole || "Business Development Intern",
      internshipRole: intern.internshipRole || "Business Development Intern",
      supervisorName: intern.assignedSupervisor || "Operations & Strategy Lead",
      assignedSupervisor: intern.assignedSupervisor || "Operations & Strategy Lead",
      startDate: intern.startDate || "2026-12-01",
      endDate: intern.endDate || "2027-05-30",
      durationMonths: intern.durationMonths || 6,
      internshipMode: intern.internshipMode || "Remote",
      workMode: intern.internshipMode || "Remote",
      monthlyStipend: intern.monthlyStipend || 0,
      stipendAmount: intern.monthlyStipend || 0,
      reportingDate: intern.startDate || "2026-12-01",
    };
    const pdf = generateInternNocPDF(data);
    pdf.doc.save(`College_NOC_${intern.fullName.replace(/\s+/g, "_")}.pdf`);
  };

  const handleDownloadOffer = (intern: InternRecord) => {
    const data = {
      offerNumber: `DD-OFF-${new Date().getFullYear()}-${intern.internId.replace(/[^0-9]/g, "") || "001"}`,
      documentNumber: `DD-OFF-${new Date().getFullYear()}-${intern.internId.replace(/[^0-9]/g, "") || "001"}`,
      internId: intern.internId,
      internName: intern.fullName,
      fullName: intern.fullName,
      email: intern.email,
      phone: intern.phone,
      collegeName: intern.collegeName,
      universityName: intern.universityName || intern.collegeName,
      course: intern.course,
      semester: intern.semester || "Final Year",
      collegeRollNo: intern.collegeRollNo || "N/A",
      role: intern.internshipRole || "Business Development Intern",
      internshipRole: intern.internshipRole || "Business Development Intern",
      department: intern.department || "Business Development",
      supervisor: intern.assignedSupervisor || "Operations & Strategy Lead",
      assignedSupervisor: intern.assignedSupervisor || "Operations & Strategy Lead",
      startDate: intern.startDate || "2026-12-01",
      endDate: intern.endDate || "2027-05-30",
      durationMonths: intern.durationMonths || 6,
      monthlyStipend: intern.monthlyStipend || 0,
      stipendAmount: intern.monthlyStipend || 0,
      internshipMode: intern.internshipMode || "Remote",
      workMode: intern.internshipMode || "Remote",
      stipendCycle: "Monthly on 5th",
    };
    const pdf = generateInternOfferPDF(data);
    pdf.doc.save(`Intern_Offer_Letter_${intern.fullName.replace(/\s+/g, "_")}.pdf`);
  };

  // Open Quick Credentials Modal
  const openCredentialsModal = (intern: InternRecord) => {
    setCredIntern(intern);
    setShowPassword(false);
    setCopiedKey(false);
    setCopiedAll(false);
    setNewPasswordInput("");
    setShowCredModal(true);
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*";
    let pwd = "DD@";
    for (let i = 0; i < 8; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPasswordInput(pwd + "!");
  };

  const handleUpdatePasswordFromList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credIntern || !newPasswordInput || newPasswordInput.length < 6) return;

    setUpdatingPassword(true);
    try {
      const token = user ? await user.getIdToken() : "";
      const res = await fetch("/api/auth/manage-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "update-password",
          type: "intern",
          id: credIntern.id,
          userId: credIntern.userId,
          email: credIntern.email,
          newPassword: newPasswordInput.trim(),
          previousPassword: credIntern.tempPassword || "",
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to update password.");
      }

      await updateDoc(doc(db, "interns", credIntern.id), {
        tempPassword: newPasswordInput.trim(),
        updatedAt: new Date().toISOString(),
      });

      setInterns(prev => prev.map(i => i.id === credIntern.id ? { ...i, tempPassword: newPasswordInput.trim() } : i));
      setCredIntern(prev => prev ? { ...prev, tempPassword: newPasswordInput.trim() } : null);
      setNewPasswordInput("");
      setStatusMessage(`Password successfully updated for ${credIntern.fullName}.`);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert("Error updating password: " + err.message);
    } finally {
      setUpdatingPassword(false);
    }
  };

  const copyFullCreds = () => {
    if (!credIntern) return;
    const credText = [
      `DIGITAL DICTIONARY — STUDENT INTERN PORTAL ACCESS`,
      `Portal Login URL: https://digitaldictionary.in/portal/login`,
      `Authorized Email: ${credIntern.email}`,
      `Temporary Password: ${credIntern.tempPassword || "[Set by Administrator]"}`,
      `Student ID: ${credIntern.internId}`,
      `Role: ${credIntern.internshipRole}`,
    ].join("\n");

    navigator.clipboard.writeText(credText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Open Delete Modal
  const openDeleteModal = (intern: InternRecord) => {
    setDeleteTarget(intern);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const token = user ? await user.getIdToken() : "";
      await fetch("/api/auth/manage-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "delete",
          type: "intern",
          id: deleteTarget.id,
          userId: deleteTarget.userId,
          email: deleteTarget.email,
        }),
      });

      await deleteDoc(doc(db, "interns", deleteTarget.id));
      if (deleteTarget.userId) {
        try {
          await deleteDoc(doc(db, "users", deleteTarget.userId));
        } catch (e) {}
      }

      setInterns(prev => prev.filter(i => i.id !== deleteTarget.id));
      setShowDeleteModal(false);
      setStatusMessage(`Intern ${deleteTarget.fullName} permanently removed.`);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert("Failed to delete intern: " + err.message);
    } finally {
      setDeleting(false);
    }
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
            Intern Management &amp; College NOC Desk
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Student cohort directory, university affiliations, stipend records, and official portal access credentials.
          </p>
        </div>
        <Link
          href="/admin/interns/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black font-semibold text-sm shadow-md hover:brightness-110 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Enrol New Intern
        </Link>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

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
          <div className="text-2xl font-bold text-[#D4AF37] mt-1">
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
          <div className="text-2xl font-bold text-[#E8D18A] mt-1 font-mono">
            ₹{interns.filter(i => i.accountStatus === "active").reduce((acc, curr) => acc + (curr.monthlyStipend || 0), 0).toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">Total monthly disbursement</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border border-white/5 bg-neutral-900/40">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by intern name, college, ID, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-neutral-400 whitespace-nowrap">Cohort Status:</label>
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
      <div className="rounded-xl border border-white/5 bg-neutral-900/40 overflow-hidden shadow-xl">
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
                  <th className="py-3 px-4">Intern &amp; ID</th>
                  <th className="py-3 px-4">College &amp; Degree</th>
                  <th className="py-3 px-4">Role &amp; Supervisor</th>
                  <th className="py-3 px-4">Duration &amp; Mode</th>
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
                      <div className="text-xs text-neutral-400 mt-0.5">Lead: {intern.assignedSupervisor || "Executive Desk"}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="text-neutral-200 font-mono">{intern.durationMonths} Months</div>
                      <div className="text-neutral-500 capitalize">{intern.internshipMode || "Remote"}</div>
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
                          className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-medium transition-colors cursor-pointer"
                        >
                          NOC
                        </button>
                        <button
                          onClick={() => handleDownloadOffer(intern)}
                          title="Generate Official Internship Offer Letter PDF"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Offer Letter
                        </button>
                        <button
                          onClick={() => openCredentialsModal(intern)}
                          title="View / Change Portal Password & Login Credentials"
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-neutral-300 border border-white/5 transition-colors cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/admin/interns/${intern.id}`}
                          title="View Complete Intern Profile"
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium border border-white/5 transition-colors"
                        >
                          Desk
                        </Link>
                        <button
                          onClick={() => openDeleteModal(intern)}
                          title="Delete Intern Permanently"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QUICK CREDENTIALS MODAL */}
      {showCredModal && credIntern && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{credIntern.fullName}</h3>
                  <p className="text-[11px] text-neutral-400 font-mono">{credIntern.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCredModal(false)}
                className="text-neutral-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-neutral-400 block text-[11px] mb-1">Active Password</span>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-white/10 font-mono text-white flex items-center justify-between">
                  <span className={credIntern.tempPassword ? "text-[#E8D18A] font-semibold" : "text-neutral-500 italic"}>
                    {credIntern.tempPassword 
                      ? (showPassword ? credIntern.tempPassword : "••••••••••••") 
                      : "[No password set on file]"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {credIntern.tempPassword && (
                      <>
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-neutral-400 hover:text-white p-1 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(credIntern.tempPassword || "");
                            setCopiedKey(true);
                            setTimeout(() => setCopiedKey(false), 2000);
                          }}
                          className="text-neutral-400 hover:text-white p-1 cursor-pointer"
                        >
                          {copiedKey ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={copyFullCreds}
                className="w-full py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedAll ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Credentials Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Login Info</span>
                  </>
                )}
              </button>

              {/* Set New Password Form */}
              <form onSubmit={handleUpdatePasswordFromList} className="pt-2 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300 font-semibold text-[11px]">Change / Set Password</span>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    Auto-Generate
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black text-xs font-bold hover:brightness-110 disabled:opacity-50 cursor-pointer"
                  >
                    {updatingPassword ? "..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* QUICK DELETE MODAL */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-rose-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Intern?</h3>
                <p className="text-xs text-rose-300/80">Permanent Removal</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">{deleteTarget.fullName}</strong> (<span className="font-mono text-neutral-400">{deleteTarget.internId}</span>) from the company?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow hover:brightness-110 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

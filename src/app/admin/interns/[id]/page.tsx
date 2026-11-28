"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/auth/AuthContext";
import { InternRecord, DocumentRecord } from "@/types/portal";
import { 
  GraduationCap, 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle,
  Download,
  Save,
  BookOpen,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  AlertTriangle,
  Send,
  RefreshCw,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { generateInternNocPDF, generateInternOfferPDF } from "@/lib/pdf/pdfEngine";
import { SlipGeneratorModal, SlipRecipient } from "@/components/admin/SlipGeneratorModal";

export default function InternDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuth();

  const [intern, setIntern] = useState<InternRecord | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Editable cohort & institutional fields
  const [accountStatus, setAccountStatus] = useState<any>("active");
  const [internshipRole, setInternshipRole] = useState("");
  const [department, setDepartment] = useState("");
  const [assignedSupervisor, setAssignedSupervisor] = useState("");
  const [monthlyStipend, setMonthlyStipend] = useState(0);
  const [collegeName, setCollegeName] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [collegeRollNo, setCollegeRollNo] = useState("");
  const [internshipMode, setInternshipMode] = useState<"remote" | "hybrid" | "on-site">("remote");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [durationMonths, setDurationMonths] = useState(6);

  // Slip Composer Modal state
  const [slipRecipient, setSlipRecipient] = useState<SlipRecipient | null>(null);

  // Credential management state
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [resetEmailSending, setResetEmailSending] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadInternData();
    }
  }, [id]);

  const loadInternData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "interns", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as InternRecord;
        setIntern(data);
        setAccountStatus(data.accountStatus || "active");
        setInternshipRole(data.internshipRole || "");
        setDepartment(data.department || "Engineering");
        setAssignedSupervisor(data.assignedSupervisor || "");
        setMonthlyStipend(data.monthlyStipend || 0);
        setCollegeName(data.collegeName || "");
        setUniversityName(data.universityName || data.collegeName || "");
        setCourse(data.course || "");
        setSemester(data.semester || "Final Year");
        setCollegeRollNo(data.collegeRollNo || "N/A");
        setInternshipMode(data.internshipMode || "remote");
        setStartDate(data.startDate || "");
        setEndDate(data.endDate || "");
        setDurationMonths(data.durationMonths || 6);

        // Fetch documents
        const docQ = query(
          collection(db, "documents"),
          where("relatedUserId", "==", id)
        );
        const docSnap = await getDocs(docQ);
        setDocuments(docSnap.docs.map(d => ({ id: d.id, ...d.data() } as DocumentRecord)));
      }
    } catch (err) {
      console.error("Error loading intern:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const updates = {
        accountStatus,
        internshipRole,
        department: department.trim() || "Engineering",
        assignedSupervisor,
        monthlyStipend: Number(monthlyStipend),
        collegeName: collegeName.trim(),
        universityName: universityName.trim() || collegeName.trim(),
        course: course.trim(),
        semester: semester.trim() || "Final Year",
        collegeRollNo: collegeRollNo.trim() || "N/A",
        internshipMode,
        startDate,
        endDate,
        durationMonths: Number(durationMonths) || 6,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(doc(db, "interns", id), updates);
      if (intern?.userId) {
        try {
          await updateDoc(doc(db, "users", intern.userId), {
            designation: internshipRole,
            department: updates.department,
            updatedAt: updates.updatedAt,
          });
        } catch {}
      }
      setIntern(prev => prev ? ({ ...prev, ...updates }) : null);
      setStatusMessage("Intern profile, department & semester details saved.");
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage("Failed to update: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Generate strong random password
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*";
    let pwd = "DD@";
    for (let i = 0; i < 8; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPasswordInput(pwd + "!");
  };

  // Change or Set Password
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intern || !newPasswordInput || newPasswordInput.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setPasswordUpdating(true);
    setStatusMessage(null);
    setErrorMessage(null);

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
          id: intern.id,
          userId: intern.userId,
          email: intern.email,
          newPassword: newPasswordInput.trim(),
          previousPassword: intern.tempPassword || "",
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to update password.");
      }

      // Update Firestore locally & remotely
      await updateDoc(doc(db, "interns", id), {
        tempPassword: newPasswordInput.trim(),
        updatedAt: new Date().toISOString(),
      });

      if (intern.userId) {
        try {
          await updateDoc(doc(db, "users", intern.userId), {
            tempPassword: newPasswordInput.trim(),
            mustChangePassword: true,
            updatedAt: new Date().toISOString(),
          });
        } catch (e) {
          // Non-blocking
        }
      }

      setIntern(prev => prev ? ({ ...prev, tempPassword: newPasswordInput.trim() }) : null);
      setShowPasswordModal(false);
      setNewPasswordInput("");
      setStatusMessage("Login credentials successfully updated and active.");
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update password.");
    } finally {
      setPasswordUpdating(false);
    }
  };

  // Send Password Reset Email
  const handleSendResetEmail = async () => {
    if (!intern?.email) return;
    setResetEmailSending(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const token = user ? await user.getIdToken() : "";
      const res = await fetch("/api/auth/manage-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "send-reset-email",
          email: intern.email,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to send reset email.");
      }

      setStatusMessage(`Official password reset instructions emailed to ${intern.email}.`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send reset email.");
    } finally {
      setResetEmailSending(false);
    }
  };

  // Copy Single Password
  const copyPasswordToClipboard = () => {
    if (!intern?.tempPassword) return;
    navigator.clipboard.writeText(intern.tempPassword);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Copy Full Login Credentials Card
  const copyAllCredentials = () => {
    if (!intern) return;
    const credText = [
      `DIGITAL DICTIONARY — STUDENT INTERN PORTAL ACCESS`,
      `Portal Login URL: https://digitaldictionary.in/portal/login`,
      `Authorized Email: ${intern.email}`,
      `Temporary Password: ${intern.tempPassword || "[Set by Administrator]"}`,
      `Student ID: ${intern.internId}`,
      `Role: ${intern.internshipRole}`,
      `Please log in, review your engagement terms, and download your official Offer Letter and NOC.`,
    ].join("\n");

    navigator.clipboard.writeText(credText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Delete Intern Permanently
  const handlePermanentDelete = async () => {
    if (!intern) return;
    setDeleting(true);
    setErrorMessage(null);

    try {
      const token = user ? await user.getIdToken() : "";
      // 1. Call server API to delete from Auth and clean up
      await fetch("/api/auth/manage-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "delete",
          type: "intern",
          id: intern.id,
          userId: intern.userId,
          email: intern.email,
        }),
      });

      // 2. Delete Firestore intern document
      await deleteDoc(doc(db, "interns", id));

      // 3. Delete user doc if exists
      if (intern.userId) {
        try {
          await deleteDoc(doc(db, "users", intern.userId));
        } catch (e) {}
      }

      router.push("/admin/interns");
    } catch (err: any) {
      setErrorMessage("Failed to delete intern: " + err.message);
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDownloadNOC = () => {
    if (!intern) return;
    const currentRole = internshipRole || intern.internshipRole || "Business Development Intern";
    const currentDept = department.trim() || intern.department || "Business Development";
    const currentSem = semester.trim() || intern.semester || "Final Year";
    const currentSupervisor = assignedSupervisor || intern.assignedSupervisor || "Operations & Strategy Lead";
    const currentStipend = monthlyStipend !== undefined ? Number(monthlyStipend) : (intern.monthlyStipend || 0);

    const data = {
      nocNumber: `DD-NOC-${new Date().getFullYear()}-${intern.internId.replace(/[^0-9]/g, "") || "001"}`,
      documentNumber: `DD-NOC-${new Date().getFullYear()}-${intern.internId.replace(/[^0-9]/g, "") || "001"}`,
      internId: intern.internId,
      internName: intern.fullName,
      fullName: intern.fullName,
      email: intern.email,
      phone: intern.phone,
      collegeName: collegeName.trim() || intern.collegeName,
      universityName: universityName.trim() || collegeName.trim() || intern.universityName || intern.collegeName,
      course: course.trim() || intern.course,
      semester: currentSem,
      rollNumber: collegeRollNo.trim() || intern.collegeRollNo || "N/A",
      collegeRollNo: collegeRollNo.trim() || intern.collegeRollNo || "N/A",
      department: currentDept,
      role: currentRole,
      internshipRole: currentRole,
      supervisorName: currentSupervisor,
      assignedSupervisor: currentSupervisor,
      startDate: startDate || intern.startDate || "2026-12-01",
      endDate: endDate || intern.endDate || "2027-05-30",
      durationMonths: durationMonths || intern.durationMonths || 6,
      internshipMode: internshipMode || intern.internshipMode || "Remote",
      workMode: internshipMode || intern.internshipMode || "Remote",
      monthlyStipend: currentStipend,
      stipendAmount: currentStipend,
      reportingDate: startDate || intern.startDate || "2026-12-01",
    };
    const pdf = generateInternNocPDF(data);
    pdf.doc.save(`College_NOC_${intern.fullName.replace(/\s+/g, "_")}.pdf`);
  };

  const handleDownloadOffer = () => {
    if (!intern) return;
    const currentRole = internshipRole || intern.internshipRole || "Business Development Intern";
    const currentDept = department.trim() || intern.department || "Business Development";
    const currentSem = semester.trim() || intern.semester || "Final Year";
    const currentSupervisor = assignedSupervisor || intern.assignedSupervisor || "Operations & Strategy Lead";
    const currentStipend = monthlyStipend !== undefined ? Number(monthlyStipend) : (intern.monthlyStipend || 0);

    const data = {
      offerNumber: `DD-OFF-${new Date().getFullYear()}-${intern.internId.replace(/[^0-9]/g, "") || "001"}`,
      documentNumber: `DD-OFF-${new Date().getFullYear()}-${intern.internId.replace(/[^0-9]/g, "") || "001"}`,
      internId: intern.internId,
      internName: intern.fullName,
      fullName: intern.fullName,
      email: intern.email,
      phone: intern.phone,
      collegeName: collegeName.trim() || intern.collegeName,
      universityName: universityName.trim() || collegeName.trim() || intern.universityName || intern.collegeName,
      course: course.trim() || intern.course,
      semester: currentSem,
      collegeRollNo: collegeRollNo.trim() || intern.collegeRollNo || "N/A",
      role: currentRole,
      internshipRole: currentRole,
      department: currentDept,
      supervisor: currentSupervisor,
      assignedSupervisor: currentSupervisor,
      startDate: startDate || intern.startDate || "2026-12-01",
      endDate: endDate || intern.endDate || "2027-05-30",
      durationMonths: durationMonths || intern.durationMonths || 6,
      stipendAmount: currentStipend,
      monthlyStipend: currentStipend,
      workMode: internshipMode || intern.internshipMode || "Remote",
      internshipMode: internshipMode || intern.internshipMode || "Remote",
      stipendCycle: "Monthly on 5th",
    };
    const pdf = generateInternOfferPDF(data);
    pdf.doc.save(`Intern_Offer_Letter_${intern.fullName.replace(/\s+/g, "_")}.pdf`);
  };

  const handleGenerateStipendSlip = () => {
    if (!intern) return;
    setSlipRecipient({
      type: "intern",
      name: intern.fullName,
      idCode: intern.internId,
      designation: internshipRole || intern.internshipRole || "Intern",
      department: department.trim() || intern.department || "General",
      baseAmount: Number(monthlyStipend ?? intern.monthlyStipend ?? 0),
    });
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-neutral-400">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading intern record...
      </div>
    );
  }

  if (!intern) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-neutral-400">Intern record not found.</p>
        <Link href="/admin/interns" className="text-xs text-[#D4AF37] underline">
          Return to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/interns"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Interns Cohort
        </Link>

        {/* Delete Intern Button */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Intern
        </button>
      </div>

      {/* Header Profile Bar */}
      <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37]/30 to-neutral-800 border-2 border-[#D4AF37]/50 flex items-center justify-center font-bold text-lg text-[#E8D18A]">
            {intern.fullName?.slice(0, 2).toUpperCase() || "IN"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{intern.fullName}</h1>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize border ${
                intern.accountStatus === "active"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : intern.accountStatus === "completed"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  : "bg-neutral-800 text-neutral-400 border-white/10"
              }`}>
                {intern.accountStatus}
              </span>
            </div>
            <p className="text-sm text-[#D4AF37] font-medium">{intern.internshipRole}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-1 font-mono">
              <span>ID: {intern.internId}</span>
              <span>•</span>
              <span>{intern.collegeName}</span>
              <span>•</span>
              <span className="capitalize">{intern.internshipMode || "Remote"}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleDownloadNOC}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold text-xs shadow hover:brightness-110 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Issue College NOC
          </button>
          <button
            onClick={handleDownloadOffer}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            Offer Letter
          </button>
          <button
            onClick={handleGenerateStipendSlip}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Stipend Slip
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Role & Academic Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl border border-white/10 bg-neutral-900/40 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-2.5">
              <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
              Cohort Status & Mentorship
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Status</label>
                <select
                  value={accountStatus}
                  onChange={(e) => setAccountStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                >
                  <option value="active">Active (Currently Mentored)</option>
                  <option value="completed">Completed (Issued Certificate)</option>
                  <option value="extended">Extended Duration</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Monthly Stipend (₹)</label>
                <input
                  type="number"
                  value={monthlyStipend}
                  onChange={(e) => setMonthlyStipend(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Role Title</label>
                <input
                  type="text"
                  value={internshipRole}
                  onChange={(e) => setInternshipRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Department (Used on Offer Letter &amp; NOC)</label>
                <input
                  type="text"
                  list="dd-intern-departments-edit"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Business Development"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                />
                <datalist id="dd-intern-departments-edit">
                  <option value="Engineering" />
                  <option value="Business Development" />
                  <option value="Digital Marketing & Growth" />
                  <option value="UI/UX & Brand Design" />
                  <option value="Operations & Strategy" />
                  <option value="Human Resources" />
                  <option value="Finance & Accounts" />
                </datalist>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Assigned Supervisor</label>
                <input
                  type="text"
                  value={assignedSupervisor}
                  onChange={(e) => setAssignedSupervisor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Work Mode</label>
                <select
                  value={internshipMode}
                  onChange={(e) => setInternshipMode(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="on-site">On-Site</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black font-semibold text-xs hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                {updating ? "Saving..." : "Save Intern Updates"}
              </button>
            </div>
          </div>

          {/* Academic Information Box (Editable for NOC & Offer Letter) */}
          <div className="p-5 rounded-2xl border border-white/10 bg-neutral-900/40 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              Institutional Affiliation Details (Used on NOC PDF)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">College / Institute</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Affiliated University</label>
                <input
                  type="text"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Course &amp; Degree</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-400 mb-1">Semester / Year (NOC)</label>
                  <input
                    type="text"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    placeholder="e.g. 6th Semester"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-[#D4AF37]/30 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Roll / Reg. No.</label>
                  <input
                    type="text"
                    value={collegeRollNo}
                    onChange={(e) => setCollegeRollNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white font-mono focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white font-mono focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white font-mono focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Months</label>
                  <input
                    type="number"
                    min={1}
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white font-mono focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                {updating ? "Saving..." : "Save Academic & Duration Details"}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Security Credentials & Quick Actions */}
        <div className="space-y-6">
          {/* Executive Security Credentials Panel */}
          <div className="p-5 rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-b from-neutral-900/90 to-neutral-950 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                Portal Access & Password
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#E8D18A] border border-[#D4AF37]/20">
                Super Admin Desk
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-neutral-400 block text-[11px] mb-1">Authorized Login Email</span>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-white/10 font-mono text-white flex items-center justify-between">
                  <span className="truncate">{intern.email}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(intern.email);
                      setStatusMessage("Email copied to clipboard.");
                      setTimeout(() => setStatusMessage(null), 2000);
                    }}
                    title="Copy Email"
                    className="text-neutral-400 hover:text-white transition-colors ml-2 shrink-0 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-neutral-400 block text-[11px] mb-1">Assigned Portal Password</span>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-white/10 font-mono text-white flex items-center justify-between">
                  <span className={intern.tempPassword ? "text-[#E8D18A] font-semibold" : "text-neutral-500 italic"}>
                    {intern.tempPassword 
                      ? (showPassword ? intern.tempPassword : "••••••••••••") 
                      : "[No password set on file]"}
                  </span>
                  <div className="flex items-center gap-1.5 ml-2 shrink-0">
                    {intern.tempPassword && (
                      <>
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          title={showPassword ? "Hide password" : "Show password"}
                          className="text-neutral-400 hover:text-white transition-colors p-1 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={copyPasswordToClipboard}
                          title="Copy Password"
                          className="text-neutral-400 hover:text-white transition-colors p-1 cursor-pointer"
                        >
                          {copiedKey ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Password Action Buttons */}
              <div className="pt-1 flex flex-col gap-2">
                <button
                  onClick={() => {
                    generateRandomPassword();
                    setShowPasswordModal(true);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {intern.tempPassword ? "Change Intern Password" : "Set Initial Password"}
                </button>

                <button
                  onClick={copyAllCredentials}
                  className="w-full py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedAll ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Credentials Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Complete Login Info</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleSendResetEmail}
                  disabled={resetEmailSending}
                  className="w-full py-1.5 px-3 rounded-lg bg-transparent hover:bg-white/5 text-neutral-400 hover:text-neutral-200 text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  {resetEmailSending ? "Sending link..." : "Send Reset Link to Student"}
                </button>
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="p-5 rounded-2xl border border-white/10 bg-neutral-900/40 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Mail className="w-4 h-4 text-[#D4AF37]" />
              Contact Information
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-neutral-500 block">Student Email</span>
                <span className="text-neutral-200 font-medium">{intern.email}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Telephone / WhatsApp</span>
                <span className="text-neutral-200 font-medium font-mono">{intern.phone}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Department</span>
                <span className="text-neutral-200 font-medium">{intern.department}</span>
              </div>
            </div>
          </div>

          {/* Official Documents Register */}
          <div className="p-5 rounded-2xl border border-white/10 bg-neutral-900/40 space-y-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-2.5">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              Official Documents
            </h2>

            {documents.length === 0 ? (
              <p className="text-xs text-neutral-500 py-3">No documents registered yet. Use the buttons above to issue NOC or Offer Letter.</p>
            ) : (
              <div className="space-y-2">
                {documents.map((docItem) => (
                  <div key={docItem.id} className="p-2.5 rounded-lg bg-neutral-950/60 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white font-medium">{docItem.title}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">{docItem.documentNumber}</div>
                    </div>
                    {docItem.pdfUrl && (
                      <a
                        href={docItem.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#D4AF37] hover:underline"
                      >
                        PDF
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: CHANGE / SET PASSWORD */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Change Intern Password</h3>
                <p className="text-xs text-neutral-400">Account: {intern.email}</p>
              </div>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4 pt-2">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300">New Password</label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="p-3 rounded-lg bg-neutral-900 border border-white/5 text-[11px] text-neutral-400 space-y-1">
                <p className="text-white font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Instant Authentication Synchronization
                </p>
                <p>The student will use this password alongside <span className="text-white font-mono">{intern.email}</span> to access their portal workspace.</p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordUpdating}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black text-xs font-bold shadow hover:brightness-110 disabled:opacity-50 cursor-pointer"
                >
                  {passwordUpdating ? "Updating..." : "Save & Activate Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM DELETE INTERN */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-rose-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Permanently Delete Intern?</h3>
                <p className="text-xs text-rose-300/80">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">{intern.fullName}</strong> (<span className="font-mono text-neutral-400">{intern.internId}</span>) from the company?
            </p>

            <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 text-[11px] text-rose-300 space-y-1">
              <p className="font-semibold text-rose-200">The following actions will occur immediately:</p>
              <ul className="list-disc list-inside space-y-0.5 text-neutral-400">
                <li>Portal authentication access will be permanently revoked.</li>
                <li>All cohort academic records and stipend allocations will be deleted.</li>
                <li>The student will no longer be able to log in.</li>
              </ul>
            </div>

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
                onClick={handlePermanentDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow hover:brightness-110 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {deleting ? "Deleting..." : "Confirm Permanent Deletion"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: STIPEND SLIP COMPOSER WITH BONUS / INCENTIVES */}
      <SlipGeneratorModal
        recipient={slipRecipient}
        onClose={() => setSlipRecipient(null)}
      />
    </div>
  );
}

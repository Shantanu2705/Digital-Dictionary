"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/auth/AuthContext";
import { PermanentEmployee, ClientAssignment, DocumentRecord } from "@/types/portal";
import { 
  Users, 
  ArrowLeft, 
  Building, 
  Mail, 
  Phone, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  CheckCircle,
  ExternalLink,
  Edit,
  Save,
  Download,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  AlertTriangle,
  Send,
  RefreshCw
} from "lucide-react";
import { SlipGeneratorModal, SlipRecipient } from "@/components/admin/SlipGeneratorModal";

export default function EmployeeDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuth();

  const [employee, setEmployee] = useState<PermanentEmployee | null>(null);
  const [assignedClients, setAssignedClients] = useState<ClientAssignment[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Editable fields
  const [employmentStatus, setEmploymentStatus] = useState<any>("active");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [basicSalary, setBasicSalary] = useState(0);
  const [allowances, setAllowances] = useState(0);

  // Credential management state
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [resetEmailSending, setResetEmailSending] = useState(false);
  const [slipRecipient, setSlipRecipient] = useState<SlipRecipient | null>(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadEmployeeData();
    }
  }, [id]);

  const loadEmployeeData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "employees", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as PermanentEmployee;
        setEmployee(data);
        setEmploymentStatus(data.employmentStatus || "active");
        setDesignation(data.designation || "");
        setDepartment(data.department || "");
        setBasicSalary(data.basicSalary || 0);
        setAllowances(data.allowances || 0);

        // Fetch client assignments
        const assignQ = query(
          collection(db, "assignments"),
          where("primaryEmployeeId", "==", id)
        );
        const assignSnap = await getDocs(assignQ);
        setAssignedClients(assignSnap.docs.map(d => ({ id: d.id, ...d.data() } as ClientAssignment)));

        // Fetch documents
        const docQ = query(
          collection(db, "documents"),
          where("relatedUserId", "==", id)
        );
        const docSnap = await getDocs(docQ);
        setDocuments(docSnap.docs.map(d => ({ id: d.id, ...d.data() } as DocumentRecord)));
      }
    } catch (err) {
      console.error("Error loading employee:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      await updateDoc(doc(db, "employees", id), {
        employmentStatus,
        designation,
        department,
        basicSalary: Number(basicSalary),
        allowances: Number(allowances),
        updatedAt: new Date().toISOString(),
      });
      setEmployee(prev => prev ? ({
        ...prev,
        employmentStatus,
        designation,
        department,
        basicSalary: Number(basicSalary),
        allowances: Number(allowances),
      }) : null);
      setStatusMessage("Employee profile successfully updated.");
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage("Failed to update: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*";
    let pwd = "DD@";
    for (let i = 0; i < 8; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPasswordInput(pwd + "!");
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee || !newPasswordInput || newPasswordInput.length < 6) {
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
          type: "employee",
          id: employee.id,
          userId: employee.userId,
          email: employee.email,
          newPassword: newPasswordInput.trim(),
          previousPassword: employee.tempPassword || "",
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to update password.");
      }

      await updateDoc(doc(db, "employees", id), {
        tempPassword: newPasswordInput.trim(),
        updatedAt: new Date().toISOString(),
      });

      if (employee.userId) {
        try {
          await updateDoc(doc(db, "users", employee.userId), {
            tempPassword: newPasswordInput.trim(),
            mustChangePassword: true,
            updatedAt: new Date().toISOString(),
          });
        } catch (e) {}
      }

      setEmployee(prev => prev ? ({ ...prev, tempPassword: newPasswordInput.trim() }) : null);
      setShowPasswordModal(false);
      setNewPasswordInput("");
      setStatusMessage("Employee portal credentials successfully updated.");
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update password.");
    } finally {
      setPasswordUpdating(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!employee?.email) return;
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
          email: employee.email,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to send reset email.");
      }

      setStatusMessage(`Password reset link emailed to ${employee.email}.`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send reset email.");
    } finally {
      setResetEmailSending(false);
    }
  };

  const copyAllCredentials = () => {
    if (!employee) return;
    const credText = [
      `DIGITAL DICTIONARY — EMPLOYEE ENTERPRISE PORTAL ACCESS`,
      `Portal Login URL: https://digitaldictionary.in/portal/login`,
      `Authorized Email: ${employee.email}`,
      `Temporary Password: ${employee.tempPassword || "[Set by Administrator]"}`,
      `Employee ID: ${employee.employeeId}`,
      `Designation: ${employee.designation}`,
      `Department: ${employee.department}`,
    ].join("\n");

    navigator.clipboard.writeText(credText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handlePermanentDelete = async () => {
    if (!employee) return;
    setDeleting(true);
    setErrorMessage(null);

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
          type: "employee",
          id: employee.id,
          userId: employee.userId,
          email: employee.email,
        }),
      });

      await deleteDoc(doc(db, "employees", id));
      if (employee.userId) {
        try {
          await deleteDoc(doc(db, "users", employee.userId));
        } catch (e) {}
      }

      router.push("/admin/employees");
    } catch (err: any) {
      setErrorMessage("Failed to delete employee: " + err.message);
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleGeneratePayslip = () => {
    if (!employee) return;
    setSlipRecipient({
      type: "employee",
      name: employee.fullName,
      idCode: employee.employeeId,
      designation: designation || employee.designation,
      department: department || employee.department || "General",
      baseAmount: Number(basicSalary ?? employee.basicSalary ?? 0),
      allowances: Number(allowances ?? employee.allowances ?? 0),
      deductions: Number(employee.deductions ?? 0),
    });
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-neutral-400">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading personnel profile...
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-neutral-400">Personnel profile not found.</p>
        <Link href="/admin/employees" className="text-xs text-[#D4AF37] underline">
          Return to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/employees"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Employees
        </Link>

        {/* Delete Employee Button */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Employee
        </button>
      </div>

      {/* Header Profile Bar */}
      <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37]/30 to-neutral-800 border-2 border-[#D4AF37]/50 flex items-center justify-center font-bold text-lg text-[#E8D18A]">
            {employee.fullName?.slice(0, 2).toUpperCase() || "DD"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{employee.fullName}</h1>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize border ${
                employee.employmentStatus === "active"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : employee.employmentStatus === "probation"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : "bg-neutral-800 text-neutral-400 border-white/10"
              }`}>
                {employee.employmentStatus?.replace("_", " ") || "active"}
              </span>
            </div>
            <p className="text-sm text-[#D4AF37] font-medium">{employee.designation}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-1 font-mono">
              <span>ID: {employee.employeeId}</span>
              <span>•</span>
              <span>{employee.department}</span>
              <span>•</span>
              <span className="capitalize">{employee.workMode || "Hybrid"}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleGeneratePayslip}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold text-xs shadow hover:brightness-110 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Generate Monthly Payslip
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
        {/* Left Column: Editable Status & Role */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl border border-white/10 bg-neutral-900/40 space-y-4 shadow-lg">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Briefcase className="w-4 h-4 text-[#D4AF37]" />
              Employment Role &amp; Status
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Employment Status</label>
                <select
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                >
                  <option value="active">Active (Full Operational)</option>
                  <option value="probation">Probationary Period</option>
                  <option value="notice_period">Notice Period</option>
                  <option value="resigned">Resigned / Relieved</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs text-neutral-400 mb-1">Designation Title</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
            </div>
          </div>

          {/* Payroll & Compensation */}
          <div className="p-5 rounded-2xl border border-white/10 bg-neutral-900/40 space-y-4 shadow-lg">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-2.5">
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              Monthly Remuneration Structure
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Basic Salary (₹ / month)</label>
                <input
                  type="number"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Allowances (₹ / month)</label>
                <input
                  type="number"
                  value={allowances}
                  onChange={(e) => setAllowances(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50 font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Total Monthly Gross:</span>
              <span className="text-[#E8D18A] font-bold text-sm font-mono">₹{(Number(basicSalary) + Number(allowances)).toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black font-semibold text-xs hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                {updating ? "Saving Changes..." : "Save Profile Updates"}
              </button>
            </div>
          </div>

          {/* Assigned Client Deployments */}
          <div className="p-5 rounded-2xl border border-white/10 bg-neutral-900/40 space-y-3 shadow-lg">
            <h2 className="text-sm font-semibold text-white flex items-center justify-between border-b border-white/5 pb-2.5">
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#D4AF37]" />
                Assigned Client Projects
              </span>
              <Link href="/admin/assignments" className="text-xs text-[#D4AF37] hover:underline">
                Reassign or Add Project
              </Link>
            </h2>

            {assignedClients.length === 0 ? (
              <p className="text-xs text-neutral-500 py-3">No active client deployments currently allocated to this engineer.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {assignedClients.map((assign) => (
                  <div key={assign.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">{assign.clientName}</div>
                      <div className="text-[11px] text-neutral-400">{assign.projectName}</div>
                    </div>
                    <Link
                      href={`/admin/clients/${assign.clientId}`}
                      className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                    >
                      View Desk
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Access & Metadata Card */}
        <div className="space-y-6">
          {/* Executive Security Credentials Panel */}
          <div className="p-5 rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-b from-neutral-900/90 to-neutral-950 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                Portal Access &amp; Password
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#E8D18A] border border-[#D4AF37]/20">
                Personnel Desk
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-neutral-400 block text-[11px] mb-1">Corporate Login Email</span>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-white/10 font-mono text-white flex items-center justify-between">
                  <span className="truncate">{employee.email}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(employee.email);
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
                  <span className={employee.tempPassword ? "text-[#E8D18A] font-semibold" : "text-neutral-500 italic"}>
                    {employee.tempPassword 
                      ? (showPassword ? employee.tempPassword : "••••••••••••") 
                      : "[No password set on file]"}
                  </span>
                  <div className="flex items-center gap-1.5 ml-2 shrink-0">
                    {employee.tempPassword && (
                      <>
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          title={showPassword ? "Hide password" : "Show password"}
                          className="text-neutral-400 hover:text-white transition-colors p-1 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(employee.tempPassword || "");
                            setCopiedKey(true);
                            setTimeout(() => setCopiedKey(false), 2000);
                          }}
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
                  {employee.tempPassword ? "Change Password" : "Set Initial Password"}
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
                  {resetEmailSending ? "Sending link..." : "Send Reset Link to Staff"}
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-neutral-900/40 space-y-4 shadow-lg">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              Official Records
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-neutral-500 block">Corporate Email</span>
                <span className="text-neutral-200 font-medium">{employee.email}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Direct Telephone</span>
                <span className="text-neutral-200 font-medium font-mono">{employee.phone || "Not provided"}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Reporting Manager</span>
                <span className="text-neutral-200 font-medium">{employee.reportingManager || "Operations Head"}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Employment Classification</span>
                <span className="text-neutral-200 font-medium capitalize">{employee.employmentType || "Permanent Full-Time"}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Probation Window</span>
                <span className="text-neutral-200 font-medium">{employee.probationPeriodMonths || 3} Months</span>
              </div>
            </div>
          </div>

          {/* Quick Documents Card */}
          <div className="p-5 rounded-2xl border border-white/10 bg-neutral-900/40 space-y-3 shadow-lg">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-2.5">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              Generated Documents
            </h2>

            {documents.length === 0 ? (
              <p className="text-xs text-neutral-500 py-3">No official documents registered yet.</p>
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
                <h3 className="text-base font-bold text-white">Change Employee Password</h3>
                <p className="text-xs text-neutral-400">Account: {employee.email}</p>
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
                <p>The employee will use this password alongside <span className="text-white font-mono">{employee.email}</span> to access their workspace.</p>
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

      {/* MODAL 2: CONFIRM DELETE EMPLOYEE */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-rose-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Permanently Delete Employee?</h3>
                <p className="text-xs text-rose-300/80">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">{employee.fullName}</strong> (<span className="font-mono text-neutral-400">{employee.employeeId}</span>) from the organization?
            </p>

            <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 text-[11px] text-rose-300 space-y-1">
              <p className="font-semibold text-rose-200">The following actions will occur immediately:</p>
              <ul className="list-disc list-inside space-y-0.5 text-neutral-400">
                <li>Portal authentication access will be permanently revoked.</li>
                <li>All corporate personnel records and payroll associations will be deleted.</li>
                <li>The staff member will no longer be able to log in.</li>
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

      <SlipGeneratorModal
        recipient={slipRecipient}
        onClose={() => setSlipRecipient(null)}
      />
    </div>
  );
}

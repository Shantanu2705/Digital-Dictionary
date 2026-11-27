"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { db } from "@/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import {
  Users,
  ArrowLeft,
  Save,
  ShieldCheck,
  Mail,
  Phone,
  Building,
  Briefcase,
  DollarSign,
  Calendar,
  Lock,
  Copy,
  CheckCircle,
  AlertCircle,
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";

export default function NewEmployeePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdResult, setCreatedResult] = useState<{
    success: boolean;
    email: string;
    tempPassword?: string;
    employeeId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    customPassword: "",
    designation: "Full Stack Engineer",
    department: "Engineering",
    role: "employee",
    employmentType: "permanent",
    workMode: "hybrid",
    dateOfJoining: new Date().toISOString().split("T")[0],
    ctc: 600000,
    basicSalary: 35000,
    allowances: 15000,
    deductions: 2000,
    probationPeriodMonths: 3,
    reportingManager: "COO / Operations",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    holderName: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*";
    let pwd = "DD@";
    for (let i = 0; i < 8; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, customPassword: pwd + "!" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = user ? await user.getIdToken() : "";
      const res = await fetch("/api/auth/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
          customPassword: formData.customPassword || undefined,
          designation: formData.designation,
          department: formData.department,
          role: formData.role,
          employmentType: "permanent",
          workMode: formData.workMode,
          dateOfJoining: formData.dateOfJoining,
          ctc: Number(formData.ctc),
          basicSalary: Number(formData.basicSalary),
          allowances: Number(formData.allowances),
          deductions: Number(formData.deductions),
          probationPeriodMonths: Number(formData.probationPeriodMonths),
          reportingManager: formData.reportingManager,
          autoGeneratePassword: !formData.customPassword,
        }),
      });

      const responseText = await res.text();
      let data: any = null;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch (parseErr) {
        console.warn("Could not parse JSON response:", responseText);
      }

      if (!res.ok || !data?.success) {
        const message =
          data?.error ||
          (responseText && responseText.length < 250 ? responseText : null) ||
          `Failed to create employee (Status ${res.status}).`;
        throw new Error(message);
      }

      const assignedId = data.employeeId || data.internId || `DD-EMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const assignedUid = data.uid || `emp-${Date.now()}`;
      const now = new Date().toISOString();
      const finalPassword = data.tempPassword || formData.customPassword || "";

      // Write directly to Firestore using client SDK to guarantee real-time synchronization
      const employeeDoc = {
        employeeId: assignedId,
        userId: assignedUid,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        designation: formData.designation.trim(),
        department: formData.department,
        reportingManager: formData.reportingManager,
        dateOfJoining: formData.dateOfJoining,
        employmentType: formData.employmentType || "full-time",
        workMode: formData.workMode || "hybrid",
        ctc: Number(formData.ctc) || 0,
        basicSalary: Number(formData.basicSalary) || 0,
        allowances: Number(formData.allowances) || 0,
        deductions: Number(formData.deductions) || 0,
        probationPeriodMonths: Number(formData.probationPeriodMonths) || 3,
        employmentStatus: "active",
        tempPassword: finalPassword,
        createdAt: now,
        updatedAt: now,
      };

      const userProfile = {
        uid: assignedUid,
        email: formData.email.trim().toLowerCase(),
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        designation: formData.designation.trim(),
        department: formData.department,
        employmentType: "permanent",
        role: formData.role,
        employeeId: assignedId,
        reportingManager: formData.reportingManager,
        accountStatus: "active",
        mustChangePassword: true,
        tempPassword: finalPassword,
        createdAt: now,
        updatedAt: now,
      };

      try {
        await Promise.all([
          setDoc(doc(db, "users", assignedUid), { ...data.userProfile, ...userProfile }, { merge: true }),
          setDoc(doc(db, "employees", assignedUid), { ...data.record, ...employeeDoc }, { merge: true }),
        ]);
      } catch (clientFsErr) {
        console.warn("Client Firestore sync notice:", clientFsErr);
      }

      setCreatedResult({
        success: true,
        email: data.email,
        tempPassword: finalPassword,
        employeeId: assignedId,
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    if (!createdResult?.tempPassword) return;
    const text = [
      `DIGITAL DICTIONARY — EMPLOYEE ENTERPRISE PORTAL ACCESS`,
      `Portal Login URL: https://digitaldictionary.in/portal/login`,
      `Authorized Email: ${createdResult.email}`,
      `Temporary Password: ${createdResult.tempPassword}`,
      `Employee ID: ${createdResult.employeeId}`,
      `Please log in, review assigned projects, and download your payslips.`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/admin/employees"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Employees
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Users className="w-6 h-6 text-[#D4AF37]" />
          Add Permanent Employee
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Registers personnel, sets salary and role tiers, and provisions employee workspace login credentials.
        </p>
      </div>

      {/* Credentials Banner on Success */}
      {createdResult && (
        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md space-y-4 shadow-xl">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-white">Employee Account Successfully Created &amp; Provisioned!</h3>
              <p className="text-xs text-emerald-300/80">
                Official employee portal account created. Copy credentials below to share with the staff member.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/10 font-mono text-xs space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-neutral-400">Employee ID:</span>
              <span className="text-white font-bold">{createdResult.employeeId}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-neutral-400">Portal Login URL:</span>
              <span className="text-[#D4AF37]">https://digitaldictionary.in/portal/login</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-neutral-400">Login Email:</span>
              <span className="text-white font-bold">{createdResult.email}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-neutral-400">Assigned Password:</span>
              <span className="text-[#E8D18A] font-bold text-sm tracking-wider">{createdResult.tempPassword}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={copyCredentials}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-all cursor-pointer shadow-md"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Copied Credentials Packet!" : "Copy Employee Welcome Packet"}
            </button>
            <Link
              href="/admin/employees"
              className="px-4 py-2.5 rounded-lg bg-neutral-800 text-neutral-300 font-medium text-xs hover:bg-neutral-700 transition-colors"
            >
              Back to Employee Directory
            </Link>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal & Account Identity */}
        <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4 shadow-lg">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            Personal &amp; Corporate Identity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Full Legal Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Corporate Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. rahul@digitaldictionary.in"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Contact Phone / WhatsApp <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                System Access Role <span className="text-red-400">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              >
                <option value="employee">Standard Employee (Portal)</option>
                <option value="project_manager">Project Manager (Portal + Client Ops)</option>
                <option value="sales_manager">Sales Manager</option>
                <option value="hr_manager">HR &amp; Talent Manager</option>
                <option value="finance_manager">Finance &amp; Payroll Manager</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: Password Configuration */}
        <div className="p-6 rounded-2xl border border-[#D4AF37]/20 bg-neutral-900/40 backdrop-blur-sm space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#D4AF37]" />
              Portal Access &amp; Password Configuration
            </h2>
            <button
              type="button"
              onClick={generateRandomPassword}
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Auto-Generate Secure Password
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Assigned Password (Optional - auto-generated if left blank)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="customPassword"
                  value={formData.customPassword}
                  onChange={handleChange}
                  placeholder="Leave empty to auto-generate or enter custom"
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center text-xs text-neutral-400 p-3 rounded-xl bg-neutral-950/60 border border-white/5">
              <span>
                The password configured here will be assigned to the staff portal account and saved in your Super Admin personnel desk for viewing, copying, or resetting at any time.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Department & Employment Details */}
        <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4 shadow-lg">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Briefcase className="w-4 h-4 text-[#D4AF37]" />
            Department &amp; Position Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              >
                <option value="Engineering">Engineering &amp; Web Tech</option>
                <option value="UI/UX Design">UI/UX Design Studio</option>
                <option value="Growth & Marketing">Growth &amp; Performance Marketing</option>
                <option value="Client Success">Client Success &amp; Operations</option>
                <option value="Finance & Admin">Finance &amp; Administration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Architect"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Work Mode</label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              >
                <option value="hybrid">Hybrid (Siliguri Studio)</option>
                <option value="remote">Remote (Pan India)</option>
                <option value="on-site">On-Site (Siliguri HQ)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Date of Joining</label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Probation Period</label>
              <select
                name="probationPeriodMonths"
                value={formData.probationPeriodMonths}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              >
                <option value={1}>1 Month</option>
                <option value={3}>3 Months (Standard)</option>
                <option value={6}>6 Months</option>
                <option value={0}>No Probation (Direct Confirmed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Reporting Officer</label>
              <input
                type="text"
                name="reportingManager"
                value={formData.reportingManager}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Compensation & Payroll Configuration */}
        <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4 shadow-lg">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
            Compensation &amp; Monthly Payroll Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Annual CTC (₹)</label>
              <input
                type="number"
                name="ctc"
                value={formData.ctc}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Basic Salary (Monthly ₹)</label>
              <input
                type="number"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Allowances (Monthly ₹)</label>
              <input
                type="number"
                name="allowances"
                value={formData.allowances}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Deductions (TDS/PF ₹)</label>
              <input
                type="number"
                name="deductions"
                value={formData.deductions}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
          <Link
            href="/admin/employees"
            className="px-5 py-2.5 rounded-lg bg-neutral-800 text-neutral-300 text-sm font-medium hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black font-semibold text-sm shadow-lg hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {loading ? "Registering..." : "Register Employee & Issue Account"}
          </button>
        </div>
      </form>
    </div>
  );
}

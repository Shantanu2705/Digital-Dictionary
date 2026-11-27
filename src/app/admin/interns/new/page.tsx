"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { db } from "@/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { 
  GraduationCap, 
  ArrowLeft, 
  Save, 
  Building2, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Copy, 
  AlertCircle,
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";

export default function NewInternPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdResult, setCreatedResult] = useState<{
    success: boolean;
    email: string;
    tempPassword?: string;
    internId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    customPassword: "",
    collegeName: "",
    universityName: "",
    course: "B.Tech in Computer Science & Engineering",
    semester: "6th Semester",
    collegeRollNo: "",
    department: "Engineering",
    internshipRole: "Frontend Web Engineering Intern",
    assignedSupervisor: "Technical Lead",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    durationMonths: 3,
    internshipMode: "remote",
    monthlyStipend: 5000,
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
          role: "intern",
          employmentType: "intern",
          department: formData.department,
          designation: formData.internshipRole,
          collegeName: formData.collegeName,
          universityName: formData.universityName || formData.collegeName,
          course: formData.course,
          semester: formData.semester,
          collegeRollNo: formData.collegeRollNo,
          internshipRole: formData.internshipRole,
          assignedSupervisor: formData.assignedSupervisor,
          startDate: formData.startDate,
          endDate: formData.endDate,
          durationMonths: Number(formData.durationMonths),
          internshipMode: formData.internshipMode,
          monthlyStipend: Number(formData.monthlyStipend),
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
          `Failed to enrol intern (Status ${res.status}).`;
        throw new Error(message);
      }

      const assignedId = data.internId || data.employeeId || `DD-INT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const assignedUid = data.uid || `int-${Date.now()}`;
      const now = new Date().toISOString();
      const finalPassword = data.tempPassword || formData.customPassword || "";

      // Write directly to Firestore using client SDK to guarantee real-time synchronization
      const internDoc = {
        internId: assignedId,
        userId: assignedUid,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        collegeName: formData.collegeName.trim(),
        universityName: (formData.universityName || formData.collegeName).trim(),
        course: formData.course.trim(),
        department: formData.department,
        semester: formData.semester,
        collegeRollNo: formData.collegeRollNo.trim() || "N/A",
        internshipRole: formData.internshipRole,
        assignedSupervisor: formData.assignedSupervisor,
        startDate: formData.startDate,
        endDate: formData.endDate,
        durationMonths: Number(formData.durationMonths),
        internshipMode: formData.internshipMode,
        monthlyStipend: Number(formData.monthlyStipend),
        accountStatus: "active",
        tempPassword: finalPassword,
        createdAt: now,
        updatedAt: now,
      };

      const userProfile = {
        uid: assignedUid,
        email: formData.email.trim().toLowerCase(),
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        designation: formData.internshipRole,
        department: formData.department,
        employmentType: "intern",
        role: "intern",
        employeeId: assignedId,
        reportingManager: formData.assignedSupervisor,
        accountStatus: "active",
        mustChangePassword: true,
        tempPassword: finalPassword,
        createdAt: now,
        updatedAt: now,
      };

      try {
        await Promise.all([
          setDoc(doc(db, "users", assignedUid), { ...data.userProfile, ...userProfile }, { merge: true }),
          setDoc(doc(db, "interns", assignedUid), { ...data.record, ...internDoc }, { merge: true }),
        ]);
      } catch (clientFsErr) {
        console.warn("Client Firestore sync notice:", clientFsErr);
      }

      setCreatedResult({
        success: true,
        email: data.email,
        tempPassword: finalPassword,
        internId: assignedId,
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    if (!createdResult) return;
    const credText = [
      `DIGITAL DICTIONARY — STUDENT INTERN PORTAL ACCESS`,
      `Portal Login URL: https://digitaldictionary.in/portal/login`,
      `Authorized Email: ${createdResult.email}`,
      `Temporary Password: ${createdResult.tempPassword || "[Check Administrator]"}`,
      `Student ID: ${createdResult.internId}`,
      `Please log in, review your engagement terms, and download your official Offer Letter and NOC.`,
    ].join("\n");

    navigator.clipboard.writeText(credText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/admin/interns"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Interns Cohort
        </Link>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <GraduationCap className="w-6 h-6 text-[#D4AF37]" />
          Enrol New Student Intern
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Registers academic affiliations, configures stipend terms, and issues student portal login credentials.
        </p>
      </div>

      {/* Success Notification Box */}
      {createdResult && (
        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md space-y-4 shadow-xl">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-white">Student Intern Successfully Registered &amp; Provisioned!</h3>
              <p className="text-xs text-emerald-300/80">Official student portal account created. Copy credentials below to share with the student.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/10 font-mono text-xs space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-neutral-400">Student ID:</span>
              <span className="text-white font-bold">{createdResult.internId}</span>
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
              {copied ? "Copied Credentials Packet!" : "Copy Student Welcome Packet"}
            </button>
            <Link
              href="/admin/interns"
              className="px-4 py-2.5 rounded-lg bg-neutral-800 text-neutral-300 font-medium text-xs hover:bg-neutral-700 transition-colors"
            >
              View Cohort Directory
            </Link>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Personal Info */}
        <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4 shadow-lg">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
            Student Identity &amp; Contact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Student Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Alvira Mallick"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. alvira@digitaldictionary.in"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Phone / WhatsApp <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 6398360422"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Portal Access Password Setup */}
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
                The password configured here will be assigned to the student portal and saved in your Super Admin cohort desk for viewing, copying, or resetting at any time.
              </span>
            </div>
          </div>
        </div>

        {/* College & University Details */}
        <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4 shadow-lg">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Building2 className="w-4 h-4 text-[#D4AF37]" />
            College &amp; University Details (For Institutional NOC)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                College / Institute Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="collegeName"
                required
                value={formData.collegeName}
                onChange={handleChange}
                placeholder="e.g. Aligarh Muslim University"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Affiliated University</label>
              <input
                type="text"
                name="universityName"
                value={formData.universityName}
                onChange={handleChange}
                placeholder="e.g. Aligarh Muslim University"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Course &amp; Degree</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g. Bachelors in Business Administration (BBA)"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Semester / Year</label>
                <input
                  type="text"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  placeholder="e.g. Final Year"
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Roll / Registration No.</label>
                <input
                  type="text"
                  name="collegeRollNo"
                  value={formData.collegeRollNo}
                  onChange={handleChange}
                  placeholder="e.g. AMU/2026/042"
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Internship Program Parameters */}
        <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4 shadow-lg">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
            Internship Terms, Mentorship &amp; Stipend
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Internship Role</label>
              <input
                type="text"
                name="internshipRole"
                value={formData.internshipRole}
                onChange={handleChange}
                placeholder="e.g. Business Development Intern"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Assigned Supervisor</label>
              <input
                type="text"
                name="assignedSupervisor"
                value={formData.assignedSupervisor}
                onChange={handleChange}
                placeholder="e.g. Operations & Strategy Lead"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Work Mode</label>
              <select
                name="internshipMode"
                value={formData.internshipMode}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              >
                <option value="remote">Remote (Pan-India)</option>
                <option value="hybrid">Hybrid (Siliguri Studio)</option>
                <option value="on-site">On-Site (Siliguri HQ)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Duration (Months)</label>
              <select
                name="durationMonths"
                value={formData.durationMonths}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              >
                <option value={1}>1 Month (Mini Project)</option>
                <option value={2}>2 Months (Summer / Winter)</option>
                <option value={3}>3 Months (Standard)</option>
                <option value={6}>6 Months (Semester Final)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Monthly Stipend (₹)</label>
              <input
                type="number"
                name="monthlyStipend"
                value={formData.monthlyStipend}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
          <Link
            href="/admin/interns"
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
            {loading ? "Enrolling..." : "Enrol Intern & Issue Account"}
          </button>
        </div>
      </form>
    </div>
  );
}

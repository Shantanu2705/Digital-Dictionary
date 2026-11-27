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
  AlertCircle 
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

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
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
          autoGeneratePassword: true,
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
        createdAt: now,
        updatedAt: now,
      };

      try {
        await Promise.all([
          setDoc(doc(db, "users", assignedUid), data.userProfile || userProfile, { merge: true }),
          setDoc(doc(db, "interns", assignedUid), data.record || internDoc, { merge: true }),
        ]);
      } catch (clientFsErr) {
        console.warn("Client Firestore sync notice:", clientFsErr);
      }

      setCreatedResult({
        success: true,
        email: data.email,
        tempPassword: data.tempPassword,
        internId: assignedId,
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    if (!createdResult?.tempPassword) return;
    const text = `Digital Dictionary Intern Portal Access:\nPortal: https://www.digitaldictionary.in/portal/login\nEmail: ${createdResult.email}\nTemp Password: ${createdResult.tempPassword}\nIntern ID: ${createdResult.internId}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/interns"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Interns Cohort
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <GraduationCap className="w-6 h-6 text-[#D4AF37]" />
          Enrol New Student Intern
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Registers academic affiliations, configures stipend terms, and issues student portal login credentials.
        </p>
      </div>

      {createdResult && (
        <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-950/30 backdrop-blur-md space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-emerald-300">
                Intern Enrolled & Credentials Issued!
              </h3>
              <p className="text-xs text-neutral-300">
                A student account has been created. The intern can sign in at <Link href="/portal/login" target="_blank" className="underline text-emerald-400">/portal/login</Link> to view assigned tasks, download College Clearance NOCs, and access stipend slips.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-black/60 border border-white/10 space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-neutral-400">Intern ID:</span>
              <span className="text-white font-bold">{createdResult.internId}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-neutral-400">Login Email:</span>
              <span className="text-white">{createdResult.email}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-neutral-400">Temporary Password:</span>
              <span className="text-[#E8D18A] font-bold text-sm tracking-wider">{createdResult.tempPassword}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={copyCredentials}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Copied Credentials!" : "Copy Intern Welcome Packet"}
            </button>
            <Link
              href="/admin/interns"
              className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-medium text-xs hover:bg-neutral-700 transition-colors"
            >
              Back to Interns List
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
        <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
            Student Identity & Contact
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
                placeholder="e.g. Ananya Das"
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
                placeholder="e.g. ananya@gmail.com"
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
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
          </div>
        </div>

        {/* College & Academic Affiliation */}
        <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Building2 className="w-4 h-4 text-[#D4AF37]" />
            College & University Details (For Institutional NOC)
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
                placeholder="e.g. Siliguri Institute of Technology"
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
                placeholder="e.g. MAKAUT, West Bengal"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Course & Degree</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Semester / Year</label>
                <input
                  type="text"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  placeholder="e.g. 6th Semester"
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
                  placeholder="e.g. SIT/2023/CS/042"
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Internship Role & Terms */}
        <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
            Internship Terms & Stipend
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Internship Role</label>
              <input
                type="text"
                name="internshipRole"
                value={formData.internshipRole}
                onChange={handleChange}
                placeholder="e.g. Next.js Full Stack Intern"
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
                placeholder="e.g. Technical Director"
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
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
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
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black font-semibold text-sm shadow-lg hover:brightness-110 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            {loading ? "Enrolling..." : "Enrol Intern & Issue Account"}
          </button>
        </div>
      </form>
    </div>
  );
}

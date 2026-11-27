"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
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
  BookOpen
} from "lucide-react";
import { generateInternNocPDF, generateInternOfferPDF, generatePayslipPDF } from "@/lib/pdf/pdfEngine";

export default function InternDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [intern, setIntern] = useState<InternRecord | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Editable fields
  const [accountStatus, setAccountStatus] = useState<any>("active");
  const [internshipRole, setInternshipRole] = useState("");
  const [assignedSupervisor, setAssignedSupervisor] = useState("");
  const [monthlyStipend, setMonthlyStipend] = useState(0);

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
        setAssignedSupervisor(data.assignedSupervisor || "");
        setMonthlyStipend(data.monthlyStipend || 0);

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
    try {
      await updateDoc(doc(db, "interns", id), {
        accountStatus,
        internshipRole,
        assignedSupervisor,
        monthlyStipend: Number(monthlyStipend),
        updatedAt: new Date().toISOString(),
      });
      setIntern(prev => prev ? ({
        ...prev,
        accountStatus,
        internshipRole,
        assignedSupervisor,
        monthlyStipend: Number(monthlyStipend),
      }) : null);
      setStatusMessage("Intern cohort record updated successfully.");
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert("Failed to update: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadNOC = () => {
    if (!intern) return;
    const currentRole = internshipRole || intern.internshipRole || "Business Development Intern";
    const currentSupervisor = assignedSupervisor || intern.assignedSupervisor || "Operations & Strategy Lead";
    const currentStipend = Number(monthlyStipend) || intern.monthlyStipend || 0;

    const data = {
      nocNumber: `DD-NOC-${new Date().getFullYear()}-${intern.internId.replace(/[^0-9]/g, "") || "001"}`,
      documentNumber: `DD-NOC-${new Date().getFullYear()}-${intern.internId.replace(/[^0-9]/g, "") || "001"}`,
      internId: intern.internId,
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
      department: intern.department || "Business Development",
      role: currentRole,
      internshipRole: currentRole,
      supervisorName: currentSupervisor,
      assignedSupervisor: currentSupervisor,
      startDate: intern.startDate || "2026-12-01",
      endDate: intern.endDate || "2027-05-30",
      durationMonths: intern.durationMonths || 6,
      internshipMode: intern.internshipMode || "Remote",
      workMode: intern.internshipMode || "Remote",
      monthlyStipend: currentStipend,
      stipendAmount: currentStipend,
      reportingDate: intern.startDate || "2026-12-01",
    };
    const pdf = generateInternNocPDF(data);
    pdf.doc.save(`College_NOC_${intern.fullName.replace(/\s+/g, "_")}.pdf`);
  };

  const handleDownloadOffer = () => {
    if (!intern) return;
    const currentRole = internshipRole || intern.internshipRole || "Business Development Intern";
    const currentSupervisor = assignedSupervisor || intern.assignedSupervisor || "Operations & Strategy Lead";
    const currentStipend = Number(monthlyStipend) || intern.monthlyStipend || 0;

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
      role: currentRole,
      internshipRole: currentRole,
      department: intern.department || "Business Development",
      supervisor: currentSupervisor,
      assignedSupervisor: currentSupervisor,
      startDate: intern.startDate || "2026-12-01",
      endDate: intern.endDate || "2027-05-30",
      durationMonths: intern.durationMonths || 6,
      stipendAmount: currentStipend,
      monthlyStipend: currentStipend,
      workMode: intern.internshipMode || "Remote",
      internshipMode: intern.internshipMode || "Remote",
      stipendCycle: "Monthly on 5th",
    };
    const pdf = generateInternOfferPDF(data);
    pdf.doc.save(`Intern_Offer_Letter_${intern.fullName.replace(/\s+/g, "_")}.pdf`);
  };

  const handleGenerateStipendSlip = () => {
    if (!intern) return;
    const payslipData = {
      payslipNumber: `DD-STP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeName: intern.fullName,
      employeeId: intern.internId,
      designation: intern.internshipRole,
      department: intern.department,
      type: "intern",
      salaryMonth: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
      payPeriod: "Full Month",
      basicSalary: intern.monthlyStipend || 0,
      allowances: 0,
      incentives: 0,
      overtime: 0,
      deductions: 0,
      totalEarnings: intern.monthlyStipend || 0,
      netPay: intern.monthlyStipend || 0,
      paymentDate: new Date().toLocaleDateString("en-IN"),
      paymentStatus: "paid",
      remarks: "Monthly academic internship stipend disbursement.",
    };

    const pdf = generatePayslipPDF(payslipData);
    pdf.doc.save(`Digital_Dictionary_Stipend_${intern.fullName.replace(/\s+/g, "_")}.pdf`);
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
      <div>
        <Link
          href="/admin/interns"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Interns Cohort
        </Link>
      </div>

      {/* Header Profile Bar */}
      <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37]/30 to-neutral-800 border-2 border-[#D4AF37]/50 flex items-center justify-center font-bold text-lg text-[#E8D18A]">
            {intern.fullName?.slice(0, 2).toUpperCase() || "IN"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{intern.fullName}</h1>
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold text-xs shadow hover:brightness-110 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Issue College NOC
          </button>
          <button
            onClick={handleDownloadOffer}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Offer Letter
          </button>
          <button
            onClick={handleGenerateStipendSlip}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Stipend Slip
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {statusMessage}
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Role & Academic Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-neutral-900/40 space-y-4">
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
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
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
                <label className="block text-xs text-neutral-400 mb-1">Assigned Supervisor</label>
                <input
                  type="text"
                  value={assignedSupervisor}
                  onChange={(e) => setAssignedSupervisor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black font-semibold text-xs hover:brightness-110 disabled:opacity-50 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                {updating ? "Saving..." : "Save Intern Updates"}
              </button>
            </div>
          </div>

          {/* Academic Information Box */}
          <div className="p-5 rounded-xl border border-white/5 bg-neutral-900/40 space-y-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              Institutional Affiliation Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 block">College / Institute</span>
                <span className="text-neutral-200 font-medium">{intern.collegeName}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Affiliated University</span>
                <span className="text-neutral-200 font-medium">{intern.universityName || intern.collegeName}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Course & Degree</span>
                <span className="text-neutral-200 font-medium">{intern.course}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Semester & Roll Number</span>
                <span className="text-neutral-200 font-medium">
                  {intern.semester || "N/A"} · Roll: {intern.collegeRollNo || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Internship Period</span>
                <span className="text-neutral-200 font-medium">
                  {intern.startDate} to {intern.endDate} ({intern.durationMonths} Months)
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Work Mode</span>
                <span className="text-neutral-200 font-medium capitalize">{intern.internshipMode || "Remote"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact & Quick Clearance Actions */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-neutral-900/40 space-y-4">
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
                <span className="text-neutral-200 font-medium">{intern.phone}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Department</span>
                <span className="text-neutral-200 font-medium">{intern.department}</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-neutral-900/40 space-y-3">
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
    </div>
  );
}

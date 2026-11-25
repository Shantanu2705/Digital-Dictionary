"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
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
  Download
} from "lucide-react";
import { generatePayslipPDF } from "@/lib/pdf/pdfEngine";

export default function EmployeeDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [employee, setEmployee] = useState<PermanentEmployee | null>(null);
  const [assignedClients, setAssignedClients] = useState<ClientAssignment[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Editable fields
  const [employmentStatus, setEmploymentStatus] = useState<any>("active");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [basicSalary, setBasicSalary] = useState(0);
  const [allowances, setAllowances] = useState(0);

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
    try {
      await updateDoc(doc(db, "employees", id), {
        employmentStatus,
        designation,
        department,
        basicSalary: Number(basicSalary),
        allowances: Number(allowances),
        updatedAt: new Date().toISOString(),
      });
      setStatusMessage("Employee profile successfully updated.");
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert("Failed to update: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleGeneratePayslip = () => {
    if (!employee) return;
    const payslipData = {
      payslipNumber: `DD-PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeName: employee.fullName,
      employeeId: employee.employeeId,
      designation: employee.designation,
      department: employee.department,
      type: "employee",
      salaryMonth: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
      payPeriod: "Full Month",
      basicSalary: employee.basicSalary || 0,
      allowances: employee.allowances || 0,
      incentives: 0,
      overtime: 0,
      deductions: employee.deductions || 0,
      totalEarnings: (employee.basicSalary || 0) + (employee.allowances || 0),
      netPay: (employee.basicSalary || 0) + (employee.allowances || 0) - (employee.deductions || 0),
      paymentDate: new Date().toLocaleDateString("en-IN"),
      paymentStatus: "paid",
      remarks: "Monthly remuneration directly processed to registered bank account.",
    };

    const pdf = generatePayslipPDF(payslipData);
    pdf.doc.save(`Digital_Dictionary_Payslip_${employee.fullName.replace(/\s+/g, "_")}.pdf`);
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
        <p className="text-neutral-400">Employee record not found.</p>
        <Link href="/admin/employees" className="text-xs text-[#D4AF37] underline">
          Return to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/admin/employees"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Employees Directory
        </Link>
      </div>

      {/* Header Profile Bar */}
      <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37]/30 to-neutral-800 border-2 border-[#D4AF37]/50 flex items-center justify-center font-bold text-lg text-[#E8D18A]">
            {employee.fullName?.slice(0, 2).toUpperCase() || "DD"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{employee.fullName}</h1>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize border ${
                employee.employmentStatus === "active"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}>
                {employee.employmentStatus}
              </span>
            </div>
            <p className="text-sm text-[#D4AF37] font-medium">{employee.designation} · {employee.department}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-1 font-mono">
              <span>ID: {employee.employeeId}</span>
              <span>•</span>
              <span>Joined: {employee.dateOfJoining || "N/A"}</span>
              <span>•</span>
              <span className="capitalize">{employee.workMode || "Hybrid"}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleGeneratePayslip}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Issue Instant Payslip
          </button>
          <Link
            href={`/admin/documents/generate?type=employee_offer&userId=${employee.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold hover:bg-[#D4AF37]/20 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            Draft Offer Letter
          </Link>
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
        {/* Left Column: Editable Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Position Settings */}
          <div className="p-5 rounded-xl border border-white/5 bg-neutral-900/40 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Briefcase className="w-4 h-4 text-[#D4AF37]" />
              Employment Role & Status
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
          <div className="p-5 rounded-xl border border-white/5 bg-neutral-900/40 space-y-4">
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
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Allowances (₹ / month)</label>
                <input
                  type="number"
                  value={allowances}
                  onChange={(e) => setAllowances(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Total Monthly Gross:</span>
              <span className="text-[#E8D18A] font-bold text-sm">₹{(Number(basicSalary) + Number(allowances)).toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black font-semibold text-xs hover:brightness-110 disabled:opacity-50 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                {updating ? "Saving Changes..." : "Save Profile Updates"}
              </button>
            </div>
          </div>

          {/* Assigned Client Deployments */}
          <div className="p-5 rounded-xl border border-white/5 bg-neutral-900/40 space-y-3">
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

        {/* Right Column: Contact & Metadata Card */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-neutral-900/40 space-y-4">
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
                <span className="text-neutral-200 font-medium">{employee.phone || "Not provided"}</span>
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
          <div className="p-5 rounded-xl border border-white/5 bg-neutral-900/40 space-y-3">
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
    </div>
  );
}

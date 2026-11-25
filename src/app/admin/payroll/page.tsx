"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { PermanentEmployee, InternRecord, PayslipRecord } from "@/types/portal";
import { 
  DollarSign, 
  Download, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Building2, 
  User, 
  Search, 
  FileText,
  AlertCircle
} from "lucide-react";
import { generatePayslipPDF } from "@/lib/pdf/pdfEngine";

export default function PayrollAdminPage() {
  const [employees, setEmployees] = useState<PermanentEmployee[]>([]);
  const [interns, setInterns] = useState<InternRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"employees" | "interns">("employees");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toLocaleString("default", { month: "long", year: "numeric" })
  );

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const [empSnap, intSnap] = await Promise.all([
        getDocs(collection(db, "employees")),
        getDocs(collection(db, "interns")),
      ]);
      setEmployees(empSnap.docs.map(d => ({ id: d.id, ...d.data() } as PermanentEmployee)));
      setInterns(intSnap.docs.map(d => ({ id: d.id, ...d.data() } as InternRecord)));
    } catch (err) {
      console.error("Error fetching staff for payroll:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssuePayslip = (emp: PermanentEmployee) => {
    const data = {
      payslipNumber: `DD-PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeName: emp.fullName,
      employeeId: emp.employeeId,
      designation: emp.designation,
      department: emp.department,
      type: "employee",
      salaryMonth: selectedMonth,
      payPeriod: "Full Month",
      basicSalary: emp.basicSalary || 0,
      allowances: emp.allowances || 0,
      incentives: 0,
      overtime: 0,
      deductions: emp.deductions || 0,
      totalEarnings: (emp.basicSalary || 0) + (emp.allowances || 0),
      netPay: (emp.basicSalary || 0) + (emp.allowances || 0) - (emp.deductions || 0),
      paymentDate: new Date().toLocaleDateString("en-IN"),
      paymentStatus: "paid",
      remarks: "Direct bank disbursement for services rendered.",
    };
    const pdf = generatePayslipPDF(data);
    pdf.doc.save(`Payslip_${emp.fullName.replace(/\s+/g, "_")}_${selectedMonth.replace(/\s+/g, "_")}.pdf`);
  };

  const handleIssueStipend = (intern: InternRecord) => {
    const data = {
      payslipNumber: `DD-STP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeName: intern.fullName,
      employeeId: intern.internId,
      designation: intern.internshipRole,
      department: intern.department,
      type: "intern",
      salaryMonth: selectedMonth,
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
      remarks: "Monthly academic mentorship stipend.",
    };
    const pdf = generatePayslipPDF(data);
    pdf.doc.save(`Stipend_${intern.fullName.replace(/\s+/g, "_")}_${selectedMonth.replace(/\s+/g, "_")}.pdf`);
  };

  const totalEmployeePayroll = employees
    .filter(e => e.employmentStatus === "active")
    .reduce((acc, curr) => acc + (Number(curr.basicSalary) || 0) + (Number(curr.allowances) || 0) - (Number(curr.deductions) || 0), 0);

  const totalInternStipends = interns
    .filter(i => i.accountStatus === "active")
    .reduce((acc, curr) => acc + (Number(curr.monthlyStipend) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <DollarSign className="w-6 h-6 text-[#D4AF37]" />
            Corporate Payroll & Stipend Management
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Monthly remuneration schedule, intern stipend disbursements and automated payslip generation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-neutral-400" />
          <span className="text-xs text-neutral-400">Remuneration Month:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
          >
            {["January 2026", "February 2026", "March 2026", "April 2026"].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
            Permanent Employee Payroll
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            ₹{totalEmployeePayroll.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">
            Net monthly commitments ({employees.filter(e => e.employmentStatus === "active").length} engineers)
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
            Intern Stipend Outlay
          </div>
          <div className="text-2xl font-bold text-[#E8D18A] mt-1">
            ₹{totalInternStipends.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">
            {interns.filter(i => i.accountStatus === "active").length} active students
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
            Total Monthly Human Capital
          </div>
          <div className="text-2xl font-bold text-[#D4AF37] mt-1">
            ₹{(totalEmployeePayroll + totalInternStipends).toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">Combined monthly disbursement</div>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("employees")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === "employees"
              ? "bg-[#D4AF37] text-black shadow-md"
              : "bg-neutral-900 text-neutral-400 hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Permanent Personnel ({employees.length})
        </button>
        <button
          onClick={() => setActiveTab("interns")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === "interns"
              ? "bg-[#D4AF37] text-black shadow-md"
              : "bg-neutral-900 text-neutral-400 hover:text-white"
          }`}
        >
          <User className="w-4 h-4" />
          Intern Cohort ({interns.length})
        </button>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-neutral-400">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading remuneration data...
          </div>
        ) : activeTab === "employees" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="bg-neutral-950/80 text-xs uppercase tracking-wider text-neutral-400 border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Designation & Dept</th>
                  <th className="py-3 px-4">Basic Salary</th>
                  <th className="py-3 px-4">Allowances</th>
                  <th className="py-3 px-4">Deductions</th>
                  <th className="py-3 px-4">Net Remuneration</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {employees.map((emp) => {
                  const net = (Number(emp.basicSalary) || 0) + (Number(emp.allowances) || 0) - (Number(emp.deductions) || 0);
                  return (
                    <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-white">{emp.fullName}</div>
                        <div className="text-xs text-neutral-500 font-mono">{emp.employeeId}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <div className="text-neutral-200">{emp.designation}</div>
                        <div className="text-neutral-500">{emp.department}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono">
                        ₹{(emp.basicSalary || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-emerald-400">
                        +₹{(emp.allowances || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-neutral-400">
                        -₹{(emp.deductions || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono font-bold text-[#E8D18A]">
                        ₹{net.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleIssuePayslip(emp)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-white text-xs font-semibold border border-white/5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                          Download Payslip
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="bg-neutral-950/80 text-xs uppercase tracking-wider text-neutral-400 border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Intern</th>
                  <th className="py-3 px-4">College & University</th>
                  <th className="py-3 px-4">Internship Role</th>
                  <th className="py-3 px-4">Monthly Stipend</th>
                  <th className="py-3 px-4">Disbursement Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {interns.map((intern) => (
                  <tr key={intern.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{intern.fullName}</div>
                      <div className="text-xs text-neutral-500 font-mono">{intern.internId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-neutral-300">
                      <div>{intern.collegeName}</div>
                      <div className="text-neutral-500">{intern.course}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-neutral-300">
                      <div>{intern.internshipRole}</div>
                      <div className="text-neutral-500">Lead: {intern.assignedSupervisor}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono font-bold text-[#E8D18A]">
                      ₹{(intern.monthlyStipend || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" />
                        Processed
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleIssueStipend(intern)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-white text-xs font-semibold border border-white/5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Stipend Advice
                      </button>
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

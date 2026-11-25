"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy, where, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { PermanentEmployee } from "@/types/portal";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  ShieldCheck, 
  MoreVertical, 
  ExternalLink,
  DollarSign,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function EmployeesListPage() {
  const [employees, setEmployees] = useState<PermanentEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "employees"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as PermanentEmployee));
      setEmployees(list);
    } catch (err) {
      console.error("Failed to load employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "all" || emp.department === selectedDept;
    const matchesStatus = selectedStatus === "all" || emp.employmentStatus === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#D4AF37]" />
            Permanent Employees
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Directory of full-time, part-time and contractual corporate personnel.
          </p>
        </div>
        <Link
          href="/admin/employees/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black font-semibold text-sm shadow-md hover:brightness-110 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Add Employee
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Total Employees</div>
          <div className="text-2xl font-bold text-white mt-1">{employees.length}</div>
          <div className="text-xs text-neutral-500 mt-0.5">Active team members</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Active Status</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {employees.filter(e => e.employmentStatus === "active").length}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">Fully operational</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">On Probation</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {employees.filter(e => e.employmentStatus === "probation").length}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">Under evaluation</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Monthly Payroll Outlay</div>
          <div className="text-2xl font-bold text-[#E8D18A] mt-1">
            ₹{employees.reduce((acc, curr) => acc + (Number(curr.basicSalary) || 0) + (Number(curr.allowances) || 0), 0).toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">Gross monthly commitments</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID, email, designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="probation">Probation</option>
              <option value="notice_period">Notice Period</option>
              <option value="resigned">Resigned</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-neutral-400">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading personnel directory...
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 space-y-3">
            <Users className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-base font-medium text-neutral-300">No employees found</p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {employees.length === 0 
                ? "Click 'Add Employee' to register your first permanent team member." 
                : "Try adjusting your search criteria or filters."}
            </p>
            {employees.length === 0 && (
              <Link
                href="/admin/employees/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold hover:bg-[#D4AF37]/20 transition-all mt-2"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add First Employee
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="bg-neutral-950/80 text-xs uppercase tracking-wider text-neutral-400 border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Designation & Dept</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Mode & Type</th>
                  <th className="py-3 px-4">Monthly CTC</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF37]/20 to-neutral-800 border border-[#D4AF37]/30 flex items-center justify-center font-bold text-xs text-[#E8D18A]">
                          {emp.fullName?.slice(0, 2).toUpperCase() || "DD"}
                        </div>
                        <div>
                          <Link 
                            href={`/admin/employees/${emp.id}`}
                            className="font-medium text-white hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                          >
                            {emp.fullName}
                          </Link>
                          <div className="text-xs text-neutral-500 font-mono">{emp.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-neutral-200">{emp.designation}</div>
                      <div className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-neutral-500" />
                        {emp.department}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <Mail className="w-3 h-3 text-neutral-500" />
                        {emp.email}
                      </div>
                      {emp.phone && (
                        <div className="flex items-center gap-1.5 text-neutral-400">
                          <Phone className="w-3 h-3 text-neutral-500" />
                          {emp.phone}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="capitalize text-neutral-200">{emp.employmentType || "full-time"}</div>
                      <div className="capitalize text-neutral-400 text-[11px] mt-0.5">{emp.workMode || "hybrid"}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono font-medium text-[#E8D18A]">
                      ₹{(Number(emp.basicSalary || 0) + Number(emp.allowances || 0)).toLocaleString("en-IN")}
                      <div className="text-[10px] text-neutral-500 font-sans">Gross / month</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium capitalize border ${
                        emp.employmentStatus === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : emp.employmentStatus === "probation"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : "bg-neutral-800 text-neutral-400 border-white/10"
                      }`}>
                        {emp.employmentStatus?.replace("_", " ") || "active"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/employees/${emp.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] border border-white/5 text-xs font-medium transition-colors"
                      >
                        Profile
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </Link>
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

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/auth/AuthContext";
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
  ExternalLink,
  DollarSign,
  Calendar,
  AlertCircle,
  KeyRound,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

export default function EmployeesListPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<PermanentEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Quick Credentials Modal state
  const [credEmployee, setCredEmployee] = useState<PermanentEmployee | null>(null);
  const [showCredModal, setShowCredModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Quick Delete Modal state
  const [deleteTarget, setDeleteTarget] = useState<PermanentEmployee | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const openCredentialsModal = (emp: PermanentEmployee) => {
    setCredEmployee(emp);
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
    if (!credEmployee || !newPasswordInput || newPasswordInput.length < 6) return;

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
          type: "employee",
          id: credEmployee.id,
          userId: credEmployee.userId,
          email: credEmployee.email,
          newPassword: newPasswordInput.trim(),
          previousPassword: credEmployee.tempPassword || "",
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to update password.");
      }

      await updateDoc(doc(db, "employees", credEmployee.id), {
        tempPassword: newPasswordInput.trim(),
        updatedAt: new Date().toISOString(),
      });

      setEmployees(prev => prev.map(e => e.id === credEmployee.id ? { ...e, tempPassword: newPasswordInput.trim() } : e));
      setCredEmployee(prev => prev ? { ...prev, tempPassword: newPasswordInput.trim() } : null);
      setNewPasswordInput("");
      setStatusMessage(`Password successfully updated for ${credEmployee.fullName}.`);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert("Error updating password: " + err.message);
    } finally {
      setUpdatingPassword(false);
    }
  };

  const copyFullCreds = () => {
    if (!credEmployee) return;
    const credText = [
      `DIGITAL DICTIONARY — EMPLOYEE ENTERPRISE PORTAL ACCESS`,
      `Portal Login URL: https://digitaldictionary.in/portal/login`,
      `Authorized Email: ${credEmployee.email}`,
      `Temporary Password: ${credEmployee.tempPassword || "[Set by Administrator]"}`,
      `Employee ID: ${credEmployee.employeeId}`,
      `Designation: ${credEmployee.designation}`,
    ].join("\n");

    navigator.clipboard.writeText(credText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const openDeleteModal = (emp: PermanentEmployee) => {
    setDeleteTarget(emp);
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
          type: "employee",
          id: deleteTarget.id,
          userId: deleteTarget.userId,
          email: deleteTarget.email,
        }),
      });

      await deleteDoc(doc(db, "employees", deleteTarget.id));
      if (deleteTarget.userId) {
        try {
          await deleteDoc(doc(db, "users", deleteTarget.userId));
        } catch (e) {}
      }

      setEmployees(prev => prev.filter(e => e.id !== deleteTarget.id));
      setShowDeleteModal(false);
      setStatusMessage(`Employee ${deleteTarget.fullName} permanently removed.`);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert("Failed to delete employee: " + err.message);
    } finally {
      setDeleting(false);
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
            Permanent Employees &amp; Engineering Staff
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Directory of corporate personnel, payroll profiles, and enterprise portal login credentials.
          </p>
        </div>
        <Link
          href="/admin/employees/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black font-semibold text-sm shadow-md hover:brightness-110 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Add Employee
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
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Monthly Outlay</div>
          <div className="text-2xl font-bold text-[#E8D18A] mt-1 font-mono">
            ₹{employees.reduce((acc, curr) => acc + (Number(curr.basicSalary || 0) + Number(curr.allowances || 0)), 0).toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">Gross payroll / month</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border border-white/5 bg-neutral-900/40">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, ID, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-neutral-400 whitespace-nowrap">Department:</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs text-neutral-400 whitespace-nowrap">Status:</label>
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
      <div className="rounded-xl border border-white/5 bg-neutral-900/40 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-neutral-400">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading employee records...
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 space-y-3">
            <Users className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-base font-medium text-neutral-300">No employees found</p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {employees.length === 0 
                ? "Click 'Add Employee' to register personnel and configure workspace portal accounts."
                : "No personnel match the search and filter criteria."}
            </p>
            {employees.length === 0 && (
              <Link
                href="/admin/employees/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold hover:bg-[#D4AF37]/20 transition-all mt-2"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Register First Employee
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="bg-neutral-950/80 text-xs uppercase tracking-wider text-neutral-400 border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Employee &amp; ID</th>
                  <th className="py-3 px-4">Role &amp; Department</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Employment &amp; Mode</th>
                  <th className="py-3 px-4">Remuneration</th>
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
                        <div className="flex items-center gap-1.5 text-neutral-400 font-mono">
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
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openCredentialsModal(emp)}
                          title="View / Change Password Credentials"
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-neutral-300 border border-white/5 transition-colors cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/admin/employees/${emp.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] border border-white/5 text-xs font-medium transition-colors"
                        >
                          Profile
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(emp)}
                          title="Delete Employee Permanently"
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
      {showCredModal && credEmployee && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{credEmployee.fullName}</h3>
                  <p className="text-[11px] text-neutral-400 font-mono">{credEmployee.email}</p>
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
                <span className="text-neutral-400 block text-[11px] mb-1">Active Portal Password</span>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-white/10 font-mono text-white flex items-center justify-between">
                  <span className={credEmployee.tempPassword ? "text-[#E8D18A] font-semibold" : "text-neutral-500 italic"}>
                    {credEmployee.tempPassword 
                      ? (showPassword ? credEmployee.tempPassword : "••••••••••••") 
                      : "[No password set on file]"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {credEmployee.tempPassword && (
                      <>
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-neutral-400 hover:text-white p-1 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(credEmployee.tempPassword || "");
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
                <h3 className="text-base font-bold text-white">Delete Employee?</h3>
                <p className="text-xs text-rose-300/80">Permanent Removal</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">{deleteTarget.fullName}</strong> (<span className="font-mono text-neutral-400">{deleteTarget.employeeId}</span>) from the organization?
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

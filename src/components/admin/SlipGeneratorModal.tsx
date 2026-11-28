"use client";

import React, { useState, useEffect } from "react";
import { X, Download, Plus, Trash2, DollarSign, Sparkles } from "lucide-react";
import { generatePayslipPDF } from "@/lib/pdf/pdfEngine";

export interface SlipRecipient {
  type: "employee" | "intern";
  name: string;
  idCode: string;
  designation: string;
  department: string;
  baseAmount: number;
  allowances?: number;
  deductions?: number;
}

interface SlipGeneratorModalProps {
  recipient: SlipRecipient | null;
  defaultMonth?: string;
  onClose: () => void;
}

export function SlipGeneratorModal({
  recipient,
  defaultMonth,
  onClose,
}: SlipGeneratorModalProps) {
  const [salaryMonth, setSalaryMonth] = useState(
    defaultMonth || new Date().toLocaleString("default", { month: "long", year: "numeric" })
  );
  const [payPeriod, setPayPeriod] = useState("Full Month");
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "processed" | "pending">("paid");
  const [basicSalary, setBasicSalary] = useState(0);
  const [allowances, setAllowances] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [incentives, setIncentives] = useState(0);
  const [overtime, setOvertime] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [customAdditions, setCustomAdditions] = useState<{ label: string; amount: number }[]>([]);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (recipient) {
      setBasicSalary(Number(recipient.baseAmount) || 0);
      setAllowances(Number(recipient.allowances) || 0);
      setDeductions(Number(recipient.deductions) || 0);
      setBonus(0);
      setIncentives(0);
      setOvertime(0);
      setCustomAdditions([]);
      setRemarks(
        recipient.type === "intern"
          ? "Monthly academic mentorship stipend disbursement."
          : "Monthly salary remuneration transferred directly to bank account."
      );
      if (defaultMonth) setSalaryMonth(defaultMonth);
    }
  }, [recipient, defaultMonth]);

  if (!recipient) return null;

  const isIntern = recipient.type === "intern";

  const customTotal = customAdditions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalEarnings =
    (Number(basicSalary) || 0) +
    (Number(allowances) || 0) +
    (Number(bonus) || 0) +
    (Number(incentives) || 0) +
    (Number(overtime) || 0) +
    customTotal;
  const totalDeductions = Number(deductions) || 0;
  const netPay = Math.max(0, totalEarnings - totalDeductions);

  const addCustomRow = () => {
    setCustomAdditions([...customAdditions, { label: "Special Performance Reward", amount: 1000 }]);
  };

  const updateCustomRow = (idx: number, field: "label" | "amount", value: string | number) => {
    const next = [...customAdditions];
    next[idx] = { ...next[idx], [field]: value };
    setCustomAdditions(next);
  };

  const removeCustomRow = (idx: number) => {
    setCustomAdditions(customAdditions.filter((_, i) => i !== idx));
  };

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = isIntern ? "DD-STP" : "DD-PAY";
    const docNum = `${prefix}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const pdf = generatePayslipPDF({
      documentNumber: docNum,
      payslipNumber: docNum,
      employeeName: recipient.name,
      employeeId: recipient.idCode,
      designation: recipient.designation,
      department: recipient.department,
      type: recipient.type,
      salaryMonth,
      payPeriod,
      paymentStatus,
      basicSalary: Number(basicSalary) || 0,
      monthlyStipend: Number(basicSalary) || 0,
      allowances: Number(allowances) || 0,
      bonus: Number(bonus) || 0,
      incentives: Number(incentives) || 0,
      overtime: Number(overtime) || 0,
      customAdditions,
      deductions: totalDeductions,
      totalEarnings,
      netPay,
      remarks: remarks.trim() || undefined,
    });

    const prefixName = isIntern ? "Stipend_Slip" : "Payslip";
    pdf.doc.save(
      `Digital_Dictionary_${prefixName}_${recipient.name.replace(/\s+/g, "_")}_${salaryMonth.replace(/\s+/g, "_")}.pdf`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <form
        onSubmit={handleDownload}
        className="w-full max-w-xl rounded-2xl bg-[#121212] border border-[#D4AF37]/30 p-6 space-y-5 shadow-2xl my-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {isIntern ? "Intern Stipend Slip Composer" : "Salary Payslip Composer"}
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">{recipient.name}</h3>
            <p className="text-xs text-neutral-400">
              {recipient.designation} · {recipient.department} · ID:{" "}
              <span className="font-mono text-[#E8D18A]">{recipient.idCode}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Period & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-neutral-400 mb-1">Month / Cycle</label>
            <input
              type="text"
              value={salaryMonth}
              onChange={(e) => setSalaryMonth(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>
          <div>
            <label className="block text-neutral-400 mb-1">Pay Period</label>
            <input
              type="text"
              value={payPeriod}
              onChange={(e) => setPayPeriod(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>
          <div>
            <label className="block text-neutral-400 mb-1">Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]/50"
            >
              <option value="paid">Paid</option>
              <option value="processed">Processed</option>
              <option value="pending">Pending Transfer</option>
            </select>
          </div>
        </div>

        {/* Earnings & Additions Grid */}
        <div className="p-4 rounded-xl bg-neutral-950/70 border border-white/10 space-y-3">
          <div className="text-xs font-semibold text-[#E8D18A] uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            Earnings, Bonus &amp; Incentives Breakdown (₹)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-neutral-400 mb-1">
                {isIntern ? "Base Stipend (₹)" : "Basic Salary (₹)"}
              </label>
              <input
                type="number"
                min={0}
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-white font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Performance Bonus (₹)</label>
              <input
                type="number"
                min={0}
                value={bonus}
                onChange={(e) => setBonus(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-black border border-[#D4AF37]/30 text-emerald-300 font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Incentives / Comm. (₹)</label>
              <input
                type="number"
                min={0}
                value={incentives}
                onChange={(e) => setIncentives(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-black border border-[#D4AF37]/30 text-emerald-300 font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">
                {isIntern ? "Allowances / Reimb. (₹)" : "HRA & Allowances (₹)"}
              </label>
              <input
                type="number"
                min={0}
                value={allowances}
                onChange={(e) => setAllowances(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-white font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Overtime / Milestone (₹)</label>
              <input
                type="number"
                min={0}
                value={overtime}
                onChange={(e) => setOvertime(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-white font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-rose-400 mb-1">Deductions (₹)</label>
              <input
                type="number"
                min={0}
                value={deductions}
                onChange={(e) => setDeductions(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-black border border-rose-500/30 text-rose-300 font-mono focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>

          {/* Custom Addition Rows */}
          <div className="pt-2 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">Custom Bonus / Addition Lines</span>
              <button
                type="button"
                onClick={addCustomRow}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-[11px] font-semibold hover:bg-[#D4AF37]/20 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                Add Custom Bonus / Item
              </button>
            </div>

            {customAdditions.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  value={row.label}
                  onChange={(e) => updateCustomRow(idx, "label", e.target.value)}
                  placeholder="Label (e.g. Sales Closure Bonus)"
                  className="col-span-7 px-2.5 py-1.5 rounded bg-black border border-white/10 text-white text-xs"
                />
                <input
                  type="number"
                  min={0}
                  value={row.amount}
                  onChange={(e) => updateCustomRow(idx, "amount", Number(e.target.value))}
                  className="col-span-4 px-2.5 py-1.5 rounded bg-black border border-white/10 text-emerald-300 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeCustomRow(idx)}
                  className="col-span-1 flex justify-center text-neutral-500 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Remarks */}
        <div className="text-xs">
          <label className="block text-neutral-400 mb-1">Slip Remarks (Optional)</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Includes ₹2,500 quarterly project bonus"
            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>

        {/* Live Totals Summary */}
        <div className="p-4 rounded-xl bg-black border border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-neutral-400 block text-[10px] uppercase">Gross Earnings</span>
            <span className="font-mono font-bold text-white text-sm">
              ₹{totalEarnings.toLocaleString("en-IN")}
            </span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[10px] uppercase">Deductions</span>
            <span className="font-mono font-bold text-rose-400 text-sm">
              -₹{totalDeductions.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[#D4AF37] block text-[10px] uppercase font-bold">
              Final Net Payable
            </span>
            <span className="font-mono font-bold text-[#E8D18A] text-xl">
              ₹{netPay.toLocaleString("en-IN")}/-
            </span>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#D4AF37] text-black text-xs font-bold shadow hover:brightness-110 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Generate &amp; Download Final PDF
          </button>
        </div>
      </form>
    </div>
  );
}

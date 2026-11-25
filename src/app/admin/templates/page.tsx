"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Layers, 
  FileText, 
  Copy, 
  CheckCircle, 
  Sparkles, 
  ShieldCheck, 
  Code,
  ExternalLink
} from "lucide-react";

interface TemplateItem {
  id: string;
  name: string;
  type: string;
  description: string;
  placeholders: string[];
  lastUpdated: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: "TMP-01",
    name: "Master Services & Development Agreement",
    type: "Legal Contract",
    description: "Standard bilateral development agreement detailing IP assignment, confidentiality, payment milestones and warranty.",
    placeholders: ["{{client_name}}", "{{company_name}}", "{{project_name}}", "{{total_amount}}", "{{advance_amount}}", "{{delivery_timeline}}"],
    lastUpdated: "2026-02-15",
  },
  {
    id: "TMP-02",
    name: "Tax & Commercial Invoice",
    type: "Finance",
    description: "Official GST/MSME-compliant commercial invoice with breakdown of services, bank account details, and proprietor endorsement.",
    placeholders: ["{{invoice_number}}", "{{client_name}}", "{{line_items}}", "{{subtotal}}", "{{cgst_sgst}}", "{{grand_total}}"],
    lastUpdated: "2026-02-15",
  },
  {
    id: "TMP-03",
    name: "Client Executive Welcome Kit",
    type: "Onboarding SLA",
    description: "First 60-minutes welcome dossier with project manager contacts, emergency escalation line, and SLA commitment.",
    placeholders: ["{{client_name}}", "{{project_name}}", "{{lead_developer}}", "{{project_manager}}", "{{support_email}}"],
    lastUpdated: "2026-02-15",
  },
  {
    id: "TMP-04",
    name: "Institutional College Clearance NOC",
    type: "Academic Clearance",
    description: "Official clearance letter on letterhead certifying student internship enrolment for submission to university authorities.",
    placeholders: ["{{intern_name}}", "{{college_name}}", "{{university}}", "{{course_degree}}", "{{semester}}", "{{supervisor_name}}", "{{stipend}}"],
    lastUpdated: "2026-02-15",
  },
  {
    id: "TMP-05",
    name: "Sub-Second Production Delivery Guide",
    type: "Technical SLA",
    description: "Comprehensive handover documentation including Google Lighthouse audit scores, DNS DNSSEC configs, and server runbooks.",
    placeholders: ["{{client_name}}", "{{domain}}", "{{lighthouse_score}}", "{{hosting_provider}}", "{{warranty_period}}"],
    lastUpdated: "2026-02-15",
  },
  {
    id: "TMP-06",
    name: "Monthly Salary / Stipend Disbursement Advice",
    type: "Payroll",
    description: "Detailed earnings and deduction schedule with bank transfer confirmation and official company seal.",
    placeholders: ["{{employee_name}}", "{{employee_id}}", "{{designation}}", "{{basic_salary}}", "{{allowances}}", "{{net_pay}}"],
    lastUpdated: "2026-02-15",
  },
];

export default function TemplatesPage() {
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const copyVariable = (v: string) => {
    navigator.clipboard.writeText(v);
    setCopiedVar(v);
    setTimeout(() => setCopiedVar(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-[#D4AF37]" />
            Document Templates & Variable Registry
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Standardised legal schemas and variable injection tokens for automated PDF generation.
          </p>
        </div>

        <Link
          href="/admin/documents/generate"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black font-semibold text-sm shadow-md hover:brightness-110 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Open PDF Generator Studio
        </Link>
      </div>

      {/* Global Variable Tokens Info Bar */}
      <div className="p-5 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Code className="w-4 h-4 text-[#D4AF37]" />
          Quick Injection Placeholder Tokens (Click to Copy)
        </h2>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            "{{client_name}}",
            "{{company_name}}",
            "{{project_name}}",
            "{{total_amount}}",
            "{{advance_amount}}",
            "{{msme_reg}}",
            "{{college_name}}",
            "{{course_degree}}",
            "{{supervisor_name}}",
            "{{stipend_amount}}",
            "{{date}}",
            "{{proprietor_stamp}}",
          ].map((token) => (
            <button
              key={token}
              onClick={() => copyVariable(token)}
              className="px-2.5 py-1 rounded bg-black/60 border border-white/10 hover:border-[#D4AF37]/50 font-mono text-neutral-300 hover:text-[#E8D18A] transition-colors flex items-center gap-1.5"
            >
              <span>{token}</span>
              {copiedVar === token ? (
                <CheckCircle className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-neutral-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-[#D4AF37]/30 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#E8D18A] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                  {tmpl.id}
                </span>
                <span className="text-xs text-neutral-400">{tmpl.type}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{tmpl.name}</h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Supported Variables
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tmpl.placeholders.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-[11px] font-mono text-[#D4AF37]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-neutral-500">Engine: Vector A4</span>
              <Link
                href="/admin/documents/generate"
                className="text-[#D4AF37] hover:underline flex items-center gap-1 font-medium"
              >
                Use in Studio
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

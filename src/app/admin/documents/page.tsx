"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { DocumentRecord, DocumentType } from "@/types/portal";
import { 
  FileText, 
  FilePlus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle, 
  Building2, 
  User, 
  Tag, 
  Sparkles 
} from "lucide-react";
import { 
  generateAgreementPDF, 
  generateInvoicePDF, 
  generateWelcomeDocPDF, 
  generateQuotationPDF, 
  generateInternNocPDF, 
  generatePayslipPDF, 
  generateDeliveryGuidePDF 
} from "@/lib/pdf/pdfEngine";

export default function DocumentCentrePage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "documents"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as DocumentRecord));
      setDocuments(list);
    } catch (err) {
      console.error("Error loading documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter((docItem) => {
    const matchesSearch = 
      docItem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      docItem.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      docItem.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      docItem.relatedUserName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || docItem.documentType === selectedType;
    const matchesStatus = selectedStatus === "all" || docItem.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDownload = (docItem: DocumentRecord) => {
    // If it has a direct pdfUrl stored, open it
    if (docItem.pdfUrl) {
      window.open(docItem.pdfUrl, "_blank");
      return;
    }

    // Otherwise dynamically synthesize vector PDF from saved document data
    const data = docItem.data || {};
    let pdfObj;

    switch (docItem.documentType) {
      case "agreement":
        pdfObj = generateAgreementPDF(data);
        break;
      case "invoice":
        pdfObj = generateInvoicePDF(data);
        break;
      case "welcome":
        pdfObj = generateWelcomeDocPDF(data);
        break;
      case "quotation":
        pdfObj = generateQuotationPDF(data);
        break;
      case "intern_noc":
        pdfObj = generateInternNocPDF(data);
        break;
      case "employee_payslip":
      case "intern_stipend":
        pdfObj = generatePayslipPDF(data);
        break;
      case "delivery_guide":
        pdfObj = generateDeliveryGuidePDF(data);
        break;
      default:
        pdfObj = generateWelcomeDocPDF(data);
        break;
    }

    pdfObj.doc.save(`${docItem.documentNumber}_${docItem.title.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#D4AF37]" />
            Corporate Document Centre
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Central repository of all executed legal agreements, tax invoices, student NOCs, and internal instruments.
          </p>
        </div>

        <Link
          href="/admin/documents/generate"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black font-semibold text-sm shadow-md hover:brightness-110 transition-all"
        >
          <FilePlus className="w-4 h-4" />
          Generate New Document
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Total Documents</div>
          <div className="text-2xl font-bold text-white mt-1">{documents.length}</div>
          <div className="text-xs text-neutral-500 mt-0.5">Archived records</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Client Agreements</div>
          <div className="text-2xl font-bold text-[#E8D18A] mt-1">
            {documents.filter(d => d.documentType === "agreement").length}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">Executed contracts</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Tax Invoices</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {documents.filter(d => d.documentType === "invoice").length}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">Commercial invoices</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Institutional NOCs</div>
          <div className="text-2xl font-bold text-[#D4AF37] mt-1">
            {documents.filter(d => d.documentType === "intern_noc").length}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">College clearances</div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by doc title, number, client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
            >
              <option value="all">All Document Types</option>
              <option value="agreement">Client Agreement</option>
              <option value="invoice">Tax Invoice</option>
              <option value="quotation">Commercial Quotation</option>
              <option value="welcome">Client Welcome Document</option>
              <option value="delivery_guide">Production Delivery Guide</option>
              <option value="intern_noc">College Clearance NOC</option>
              <option value="intern_offer">Intern Offer Letter</option>
              <option value="employee_payslip">Monthly Payslip</option>
              <option value="package_menu">Service Package Menu</option>
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
              <option value="draft">Draft</option>
              <option value="final">Final / Executed</option>
              <option value="shared">Shared with Client</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-neutral-400">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading corporate document repository...
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 space-y-3">
            <FileText className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-base font-medium text-neutral-300">No documents found</p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {documents.length === 0
                ? "Start generating legal agreements, client proposals, tax invoices, and college clearance NOCs."
                : "No documents match the current filter criteria."}
            </p>
            {documents.length === 0 && (
              <Link
                href="/admin/documents/generate"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold hover:bg-[#D4AF37]/20 transition-all mt-2"
              >
                <FilePlus className="w-3.5 h-3.5" />
                Launch Generator Studio
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="bg-neutral-950/80 text-xs uppercase tracking-wider text-neutral-400 border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Document Details</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Associated Entity</th>
                  <th className="py-3 px-4">Issued On</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDocuments.map((docItem) => (
                  <tr key={docItem.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{docItem.title}</div>
                      <div className="text-xs text-[#E8D18A] font-mono mt-0.5">{docItem.documentNumber}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize text-xs text-neutral-300 font-medium">
                        {docItem.documentType.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {docItem.clientName ? (
                        <div className="flex items-center gap-1 text-neutral-200">
                          <Building2 className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{docItem.clientName}</span>
                        </div>
                      ) : docItem.relatedUserName ? (
                        <div className="flex items-center gap-1 text-neutral-200">
                          <User className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{docItem.relatedUserName}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-500">General Corporate</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-neutral-400 font-mono">
                      {docItem.createdAt ? new Date(docItem.createdAt).toLocaleDateString("en-IN") : "N/A"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium capitalize border ${
                        docItem.status === "final" || docItem.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : docItem.status === "shared"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          : "bg-neutral-800 text-neutral-400 border-white/10"
                      }`}>
                        {docItem.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDownload(docItem)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-white text-xs font-semibold border border-white/5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Download PDF
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

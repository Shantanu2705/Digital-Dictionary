"use client";

import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/auth/AuthContext";
import { DocumentRecord } from "@/types/portal";
import { 
  FileText, 
  Download, 
  Clock, 
  Search, 
  CheckCircle,
  GraduationCap,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { 
  generateInternNocPDF, 
  generateInternOfferPDF, 
  generatePayslipPDF, 
  generateWelcomeDocPDF 
} from "@/lib/pdf/pdfEngine";

export default function PortalDocumentsPage() {
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user?.uid || user?.email) {
      loadDocuments();
    }
  }, [user?.uid, user?.email]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const docsList: DocumentRecord[] = [];

      // Query by user UID
      if (user?.uid) {
        const q = query(
          collection(db, "documents"),
          where("relatedUserId", "==", user.uid)
        );
        const snap = await getDocs(q);
        snap.forEach(d => docsList.push({ id: d.id, ...d.data() } as DocumentRecord));
      }

      // Query by user email
      if (user?.email) {
        const emailQ = query(
          collection(db, "documents"),
          where("relatedEmail", "==", user.email)
        );
        const emailSnap = await getDocs(emailQ);
        emailSnap.forEach(d => {
          if (!docsList.some(item => item.id === d.id)) {
            docsList.push({ id: d.id, ...d.data() } as DocumentRecord);
          }
        });
      }

      // If user is an intern, also ensure their Offer Letter and NOC are available dynamically
      const isIntern = profile?.employmentType === "intern" || profile?.role === "intern";
      if (isIntern && user?.email) {
        const internQ = query(
          collection(db, "interns"),
          where("email", "==", user.email)
        );
        const internSnap = await getDocs(internQ);
        if (!internSnap.empty) {
          const internData = internSnap.docs[0].data();
          
          if (!docsList.some(d => d.documentType === "intern_offer")) {
            docsList.unshift({
              id: `dyn-offer-${internData.internId}`,
              documentType: "intern_offer",
              title: "Formal Internship Appointment Offer",
              documentNumber: internData.offerNumber || `DD-OFF-${internData.internId}`,
              relatedUserId: user?.uid,
              status: "final",
              versionNumber: 1,
              createdBy: "DD-SYSTEM",
              createdAt: internData.createdAt || new Date().toISOString(),
              updatedAt: internData.updatedAt || new Date().toISOString(),
              data: internData,
            });
          }

          if (!docsList.some(d => d.documentType === "intern_noc")) {
            docsList.unshift({
              id: `dyn-noc-${internData.internId}`,
              documentType: "intern_noc",
              title: "Institutional No Objection Certificate (NOC)",
              documentNumber: internData.nocNumber || `DD-NOC-${internData.internId}`,
              relatedUserId: user?.uid,
              status: "final",
              versionNumber: 1,
              createdBy: "DD-SYSTEM",
              createdAt: internData.createdAt || new Date().toISOString(),
              updatedAt: internData.updatedAt || new Date().toISOString(),
              data: internData,
            });
          }
        }
      }

      setDocuments(docsList);
    } catch (err) {
      console.error("Error loading user documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = (docItem: DocumentRecord) => {
    if (docItem.pdfUrl) {
      window.open(docItem.pdfUrl, "_blank");
      return;
    }

    const data = docItem.data || {};
    let pdfObj;

    switch (docItem.documentType) {
      case "intern_noc":
        pdfObj = generateInternNocPDF(data);
        break;
      case "intern_offer":
        pdfObj = generateInternOfferPDF(data);
        break;
      case "employee_payslip":
      case "intern_stipend":
        pdfObj = generatePayslipPDF(data);
        break;
      default:
        pdfObj = generateWelcomeDocPDF(data);
        break;
    }

    pdfObj.doc.save(`${docItem.documentNumber}_${docItem.title.replace(/\s+/g, "_")}.pdf`);
  };

  const filteredDocs = documents.filter(d => 
    d.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-[#D4AF37]" />
          My Official Documents & Remuneration Slips
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Authorized legal instruments, college clearance NOCs, offer letters, and monthly salary disbursement advice.
        </p>
      </div>

      {/* Search */}
      <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by title or reference number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-neutral-400">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading your official documents...
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FileText className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-base font-semibold text-white">No Documents Available</p>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              {profile?.employmentType === "intern"
                ? "Your official College Clearance NOC and monthly stipend slips will be registered here by management."
                : "Your appointment letters and monthly payslips will appear here as soon as they are processed."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="bg-neutral-950/80 text-xs uppercase tracking-wider text-neutral-400 border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Reference Number</th>
                  <th className="py-3 px-4">Date Issued</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDocs.map((docItem) => (
                  <tr key={docItem.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{docItem.title}</div>
                      <div className="text-[11px] text-neutral-400 capitalize">
                        {docItem.documentType.replace("_", " ")}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-[#E8D18A]">
                      {docItem.documentNumber}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-neutral-400 font-mono">
                      {docItem.createdAt ? new Date(docItem.createdAt).toLocaleDateString("en-IN") : "N/A"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Official & Executed
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDownloadPDF(docItem)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-white text-xs font-semibold border border-white/5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Download A4 PDF
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

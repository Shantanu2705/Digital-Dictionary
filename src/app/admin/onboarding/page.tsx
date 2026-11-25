"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Share2, 
  FileText, 
  Sparkles, 
  Check, 
  Copy,
  ChevronRight,
  ExternalLink,
  Package,
  ArrowRight
} from "lucide-react";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { OnboardingTask, Client } from "@/types/portal";
import { 
  generateAgreementPDF, 
  generateInvoicePDF, 
  generateWelcomeDocPDF, 
  generateQuotationPDF, 
  generateDeliveryGuidePDF,
  generatePackageMenuPDF
} from "@/lib/pdf/pdfEngine";
import { INITIAL_PACKAGES } from "@/lib/data/initialCatalogue";
import { generateDocumentNumber } from "@/lib/utils/numbering";
import JSZip from "jszip";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<OnboardingTask | null>(null);
  const [clientDetails, setClientDetails] = useState<Client | null>(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      try {
        const snap = await getDocs(collection(db, "onboardingTasks"));
        const list: OnboardingTask[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as OnboardingTask));
        setTasks(list);
        if (list.length > 0) {
          setActiveTask(list[0]);
          loadClient(list[0].clientId);
        }
      } catch (err) {
        console.warn("Could not load onboarding tasks:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  async function loadClient(cid: string) {
    try {
      const snap = await getDoc(doc(db, "clients", cid));
      if (snap.exists()) {
        setClientDetails({ id: snap.id, ...snap.data() } as Client);
      }
    } catch (err) {
      console.warn("Error loading client:", err);
    }
  }

  const handleSelectTask = (task: OnboardingTask) => {
    setActiveTask(task);
    loadClient(task.clientId);
  };

  const toggleChecklistItem = async (taskId: string, itemId: string) => {
    if (!activeTask) return;
    const updatedChecklist = activeTask.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const allCompleted = updatedChecklist.every((i) => i.completed);
    const newStatus = allCompleted ? "ready_to_share" : "in_progress";

    setActiveTask({ ...activeTask, checklist: updatedChecklist, status: newStatus });
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, checklist: updatedChecklist, status: newStatus } : t))
    );

    try {
      await updateDoc(doc(db, "onboardingTasks", taskId), {
        checklist: updatedChecklist,
        status: newStatus,
      });
    } catch (err) {
      console.warn("Failed to update checklist item:", err);
    }
  };

  // Generate All 6 Onboarding PDFs and package them into a ZIP
  const handleDownloadAllZip = async () => {
    if (!clientDetails || !activeTask) return;
    setGeneratingAll(true);

    try {
      const zip = new JSZip();
      const folderName = `${clientDetails.companyName.replace(/\s+/g, "_")}_Onboarding_Pack`;
      const folder = zip.folder(folderName);

      // 1. Agreement
      const agrNum = await generateDocumentNumber("agreement");
      const agrPdf = generateAgreementPDF({
        documentNumber: agrNum,
        clientName: clientDetails.companyName,
        companyName: clientDetails.companyName,
        contactPerson: clientDetails.contactPerson,
        email: clientDetails.email,
        phone: clientDetails.phone,
        packageName: clientDetails.selectedPackageName,
        agreedAmount: clientDetails.agreedAmount,
        startDate: clientDetails.projectStartDate,
        deliveryDate: clientDetails.expectedDeliveryDate,
        deliverables: clientDetails.selectedServices,
      });
      folder?.file(`01_Agreement_${agrNum}.pdf`, agrPdf.doc.output("blob"));

      // 2. Welcome Guide
      const welNum = await generateDocumentNumber("welcome");
      const welPdf = generateWelcomeDocPDF({
        documentNumber: welNum,
        clientName: clientDetails.companyName,
        primaryEmployeeName: clientDetails.primaryEmployeeName,
      });
      folder?.file(`02_Welcome_Guide_${welNum}.pdf`, welPdf.doc.output("blob"));

      // 3. Invoice
      const invNum = await generateDocumentNumber("invoice");
      const invPdf = generateInvoicePDF({
        documentNumber: invNum,
        clientName: clientDetails.companyName,
        contactPerson: clientDetails.contactPerson,
        email: clientDetails.email,
        phone: clientDetails.phone,
        packageName: clientDetails.selectedPackageName,
        agreedAmount: clientDetails.agreedAmount,
        amountPaid: clientDetails.amountPaid,
        paymentStatus: clientDetails.paymentStatus,
      });
      folder?.file(`03_Tax_Invoice_${invNum}.pdf`, invPdf.doc.output("blob"));

      // 4. Quotation
      const quoNum = await generateDocumentNumber("quotation");
      const quoPdf = generateQuotationPDF({
        documentNumber: quoNum,
        clientName: clientDetails.companyName,
        contactPerson: clientDetails.contactPerson,
        quotedAmount: clientDetails.quotedAmount || clientDetails.agreedAmount,
        packageName: clientDetails.selectedPackageName,
      });
      folder?.file(`04_Quotation_${quoNum}.pdf`, quoPdf.doc.output("blob"));

      // 5. Delivery Guide
      const delNum = await generateDocumentNumber("delivery_guide");
      const delPdf = generateDeliveryGuidePDF({
        documentNumber: delNum,
        projectName: clientDetails.projectName,
      });
      folder?.file(`05_Delivery_Guide_${delNum}.pdf`, delPdf.doc.output("blob"));

      // 6. Package Menu
      const menuPdf = generatePackageMenuPDF(INITIAL_PACKAGES);
      folder?.file(`06_Solutions_Catalogue_Menu.pdf`, menuPdf.doc.output("blob"));

      // Generate ZIP and trigger browser download
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Update task state
      await updateDoc(doc(db, "onboardingTasks", activeTask.id), {
        status: "ready_to_share",
      });
      setActiveTask(prev => prev ? { ...prev, status: "ready_to_share" } : null);
    } catch (err: any) {
      console.error("ZIP Generation error:", err);
      alert(`Could not compile ZIP bundle: ${err.message}`);
    } finally {
      setGeneratingAll(false);
    }
  };

  const handleMarkAsShared = async () => {
    if (!activeTask) return;
    try {
      const now = new Date().toISOString();
      await updateDoc(doc(db, "onboardingTasks", activeTask.id), {
        status: "shared",
        sharedAt: now,
        sharedBy: "coo@digitaldictionary.in",
      });
      setActiveTask(prev => prev ? { ...prev, status: "shared", sharedAt: now } : null);
    } catch (err: any) {
      alert(`Error updating: ${err.message}`);
    }
  };

  const handleCopyLink = () => {
    if (!clientDetails) return;
    const link = `https://digitaldictionary.in/portal/login?email=${encodeURIComponent(clientDetails.email)}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Calculate countdown
  let minutesRemaining = 0;
  let isOverdue = false;
  if (activeTask?.deadlineAt) {
    const diff = new Date(activeTask.deadlineAt).getTime() - new Date().getTime();
    minutesRemaining = Math.max(0, Math.floor(diff / (1000 * 60)));
    isOverdue = diff < 0 && activeTask.status !== "shared";
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E2]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#A67C22] block mb-1">
            Executive SLA Protocol
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#101010]">
            First 60-Minutes Client Onboarding
          </h1>
          <p className="text-xs text-[#777777]">
            Rapid document assembly, verification, and handover package for Closed-Won client engagements.
          </p>
        </div>

        {activeTask && (
          <div className="flex items-center gap-3">
            <div className={cn(
              "px-4 py-2 rounded-xl border flex items-center gap-2",
              isOverdue 
                ? "bg-rose-50 border-rose-200 text-rose-700" 
                : "bg-amber-50 border-amber-200 text-amber-800"
            )}>
              <Clock className="w-4 h-4 animate-pulse text-[#D4AF37]" />
              <div className="text-xs font-mono font-bold">
                {isOverdue ? "SLA Overdue" : `${minutesRemaining}m Remaining`}
              </div>
            </div>

            <button
              onClick={handleDownloadAllZip}
              disabled={generatingAll || !clientDetails}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] text-[#101010] text-xs font-bold uppercase tracking-wider shadow-sm hover:scale-[1.01] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{generatingAll ? "Packaging ZIP..." : "Download 6-Doc ZIP Pack"}</span>
            </button>
          </div>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="p-16 text-center text-xs text-[#777777] bg-white rounded-2xl border border-[#E5E5E2] space-y-3">
          <Clock className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-[#101010]">No Active 60-Minute Onboarding Workflows</h3>
          <p className="max-w-md mx-auto">
            When a client status is set to &ldquo;Closed &mdash; Won&rdquo; in the Client Directory, an automated 60-minute countdown checklist will appear here immediately.
          </p>
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#101010] text-white font-semibold"
          >
            Create Closed-Won Client
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Active Onboarding Tasks List */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#777777] px-1 block">
              Active Engagements ({tasks.length})
            </span>
            {tasks.map((t) => {
              const isSelected = activeTask?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTask(t)}
                  className={cn(
                    "w-full p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer",
                    isSelected 
                      ? "bg-white border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/15" 
                      : "bg-[#FAFAF8] border-[#E5E5E2] hover:bg-white"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#101010]">{t.clientName}</h4>
                      <span className="text-[10px] text-[#777777] font-mono block mt-0.5">
                        Won at {new Date(t.closedWonAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className={cn(
                      "text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border",
                      t.status === "shared" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      t.status === "ready_to_share" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    )}>
                      {t.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-[#777777] mb-1 font-semibold">
                      <span>Documents Prepared</span>
                      <span>{t.checklist.filter(i => i.completed).length} / {t.checklist.length}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E5E5E2] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#A67C22]" 
                        style={{ width: `${(t.checklist.filter(i => i.completed).length / t.checklist.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Task Checklist & Document Actions */}
          {activeTask && clientDetails && (
            <div className="lg:col-span-2 space-y-6">
              {/* Card 1: Checklist Matrix */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E2]">
                  <div>
                    <h3 className="text-sm font-bold text-[#101010]">
                      60-Minute Preparation Checklist
                    </h3>
                    <span className="text-xs text-[#777777]">
                      Client: {clientDetails.companyName} &middot; {clientDetails.selectedPackageName}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#A67C22]">
                    ₹{Number(clientDetails.agreedAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="space-y-2">
                  {activeTask.checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(activeTask.id, item.id)}
                      className={cn(
                        "p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer",
                        item.completed 
                          ? "bg-emerald-50/40 border-emerald-200 text-emerald-900" 
                          : "bg-[#FAFAF8] border-[#E5E5E2] text-[#101010] hover:bg-white hover:border-[#D4AF37]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center border transition-colors",
                          item.completed 
                            ? "bg-emerald-600 border-emerald-600 text-white" 
                            : "bg-white border-[#E5E5E2]"
                        )}>
                          {item.completed && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs font-medium">{item.task}</span>
                      </div>
                      {item.docType && (
                        <span className="text-[10px] uppercase font-bold text-[#A67C22] bg-white border border-[#E5E5E2] px-2 py-0.5 rounded">
                          PDF
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Sharing & Delivery Execution */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-[#101010] pb-2 border-b border-[#E5E5E2]">
                  Secure Delivery &amp; Client Access Link
                </h3>
                <p className="text-xs text-[#777777]">
                  Send this secure onboarding access link directly to the client or primary contact.
                </p>

                <div className="flex items-center gap-3">
                  <input
                    readOnly
                    value={`https://digitaldictionary.in/portal/login?client=${clientDetails.clientId}`}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E5E5E2] bg-[#FAFAF8] text-xs font-mono text-[#101010]"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 rounded-xl border border-[#E5E5E2] bg-white hover:bg-[#F2F2F0] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-[#E5E5E2] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#101010] block">Delivery Status:</span>
                    <span className="text-xs text-[#777777]">
                      {activeTask.status === "shared" ? `Confirmed Shared at ${new Date(activeTask.sharedAt || "").toLocaleString()}` : "Awaiting transmission confirmation"}
                    </span>
                  </div>

                  {activeTask.status !== "shared" ? (
                    <button
                      onClick={handleMarkAsShared}
                      className="px-5 py-2.5 rounded-xl bg-[#101010] hover:bg-[#1B1B1B] text-white text-xs font-bold uppercase tracking-wider shadow-2xs cursor-pointer"
                    >
                      Confirm Mark as Shared
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Shared Successfully</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

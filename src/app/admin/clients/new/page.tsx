"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Briefcase, 
  ArrowLeft, 
  Save, 
  Clock, 
  DollarSign, 
  Building, 
  Users, 
  FileText,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { INITIAL_PACKAGES } from "@/lib/data/initialCatalogue";
import { generateDocumentNumber } from "@/lib/utils/numbering";
import { logActivity } from "@/lib/utils/audit";
import { ClientStatus, PaymentStatus, ServicePackage, UserProfile } from "@/types/portal";

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<UserProfile[]>([]);
  const [packages, setPackages] = useState<ServicePackage[]>(INITIAL_PACKAGES);

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Siliguri");
  const [state, setState] = useState("West Bengal");
  const [pinCode, setPinCode] = useState("734012");
  const [businessCategory, setBusinessCategory] = useState("Healthcare / Hospital");

  // Project Info
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState("pkg-opt-02");
  const [projectStatus, setProjectStatus] = useState<ClientStatus>("closed_won");
  const [projectStartDate, setProjectStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");

  // Financial Info
  const [quotedAmount, setQuotedAmount] = useState(25000);
  const [agreedAmount, setAgreedAmount] = useState(25000);
  const [discount, setDiscount] = useState(0);
  const [advancePayment, setAdvancePayment] = useState(12500);
  const [paymentSchedule, setPaymentSchedule] = useState("50% Advance, 30% Staging Approval, 20% Handover");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("partial");

  // Assignment
  const [primaryEmployeeId, setPrimaryEmployeeId] = useState("");

  useEffect(() => {
    async function loadTeam() {
      try {
        const snap = await getDocs(collection(db, "users"));
        const list: UserProfile[] = [];
        snap.forEach((d) => list.push(d.data() as UserProfile));
        setEmployees(list);
      } catch (err) {
        console.warn("Could not load employees:", err);
      }
    }
    loadTeam();
  }, []);

  const handlePackageChange = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    const selected = packages.find((p) => p.id === pkgId);
    if (selected) {
      setQuotedAmount(selected.price);
      setAgreedAmount(selected.price);
      setAdvancePayment(Math.round(selected.price * 0.5));
      if (!projectName) {
        setProjectName(`${companyName || "Client"} - ${selected.name}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const clientId = await generateDocumentNumber("client");
      const selectedPkg = packages.find((p) => p.id === selectedPackageId);
      const primaryEmp = employees.find((e) => e.uid === primaryEmployeeId);

      const now = new Date().toISOString();

      const newClientData = {
        clientId,
        companyName: companyName.trim(),
        contactPerson: contactPerson.trim(),
        email: email.trim(),
        phone: phone.trim(),
        whatsapp: (whatsapp || phone).trim(),
        website: website.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pinCode: pinCode.trim(),
        businessCategory,

        projectName: projectName.trim() || `${companyName} Digital Ecosystem`,
        projectDescription: projectDescription.trim(),
        selectedPackageId,
        selectedPackageName: selectedPkg?.name || "Custom Architecture",
        selectedServices: selectedPkg?.includedFeatures || [],
        projectStartDate,
        expectedDeliveryDate,
        projectStatus,
        statusChangedAt: now,

        quotedAmount: Number(quotedAmount),
        agreedAmount: Number(agreedAmount),
        discount: Number(discount),
        advancePayment: Number(advancePayment),
        amountPaid: Number(advancePayment),
        outstandingAmount: Number(agreedAmount) - Number(advancePayment),
        paymentSchedule,
        paymentStatus,

        primaryEmployeeId: primaryEmp?.uid || "",
        primaryEmployeeName: primaryEmp?.fullName || "",
        assignedEmployeeIds: primaryEmp?.uid ? [primaryEmp.uid] : [],

        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, "clients"), newClientData);

      // If Closed — Won, trigger First 60-Minutes Onboarding Task automatically
      if (projectStatus === "closed_won") {
        const closedWonTime = new Date();
        const deadlineTime = new Date(closedWonTime.getTime() + 60 * 60 * 1000); // 60 minutes

        const onboardingDoc = {
          clientId: docRef.id,
          clientName: companyName,
          closedWonAt: closedWonTime.toISOString(),
          deadlineAt: deadlineTime.toISOString(),
          status: "in_progress",
          checklist: [
            { id: "task-1", task: "Verify client details & project scope", completed: true },
            { id: "task-2", task: "Confirm agreed price & commercial terms", completed: true },
            { id: "task-3", task: "Generate Master Client Agreement PDF", completed: false, docType: "agreement" },
            { id: "task-4", task: "Generate Executive Welcome Document PDF", completed: false, docType: "welcome" },
            { id: "task-5", task: "Generate Official Tax / Advance Invoice PDF", completed: false, docType: "invoice" },
            { id: "task-6", task: "Generate Project Delivery Guide PDF", completed: false, docType: "delivery_guide" },
            { id: "task-7", task: "Generate Package Menu Catalogue PDF", completed: false, docType: "package_menu" },
            { id: "task-8", task: "Review entire onboarding bundle with COO", completed: false },
            { id: "task-9", task: "Mark document pack as Ready to Share", completed: false },
          ],
          documentsPrepared: [],
        };

        await addDoc(collection(db, "onboardingTasks"), onboardingDoc);
      }

      await logActivity({
        userId: "admin",
        userEmail: "coo@digitaldictionary.in",
        action: "CREATE_CLIENT",
        entityType: "client",
        entityId: docRef.id,
        details: `Created client ${companyName} (${clientId}) with status ${projectStatus}`,
      });

      router.push(`/admin/clients/${docRef.id}`);
    } catch (err: any) {
      console.error("Error creating client:", err);
      alert(`Error saving client record: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Client Directory</span>
        </Link>
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
          New Client Onboarding Form
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: Basic Information */}
        <div className="p-6 md:p-8 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
            <Building className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              1. Client &amp; Business Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Company / Brand Name *
              </label>
              <input
                required
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Hospital / Shivaay Corp"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white placeholder:text-slate-500 text-xs outline-none focus:border-[#D4AF37] transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Primary Contact Person *
              </label>
              <input
                required
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Dr. Rajesh Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white placeholder:text-slate-500 text-xs outline-none focus:border-[#D4AF37] transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Official Email Address *
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. contact@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white placeholder:text-slate-500 text-xs outline-none focus:border-[#D4AF37] transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Phone Number *
              </label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white placeholder:text-slate-500 text-xs outline-none focus:border-[#D4AF37] transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                WhatsApp Channel
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Leave blank to use phone number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white placeholder:text-slate-500 text-xs outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Existing Website URL
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="e.g. https://company.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white placeholder:text-slate-500 text-xs outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Registered Address &amp; Location
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, building, floor..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white placeholder:text-slate-500 text-xs outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Package Selection & Project Scope */}
        <div className="p-6 md:p-8 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
            <Briefcase className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              2. Package Selection &amp; Technical Scope
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Selected Service Package (Official Catalogue)
              </label>
              <select
                value={selectedPackageId}
                onChange={(e) => handlePackageChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white text-xs font-semibold outline-none focus:border-[#D4AF37] transition-all"
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id} className="bg-[#181818] text-white">
                    {pkg.code} &mdash; {pkg.name} (₹{pkg.price.toLocaleString("en-IN")}{pkg.billingType === "monthly" ? "/mo" : ""})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Project Name *
              </label>
              <input
                required
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Apex Health Next.js Platform"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white placeholder:text-slate-500 text-xs outline-none focus:border-[#D4AF37] transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Engagement Status
              </label>
              <select
                value={projectStatus}
                onChange={(e) => setProjectStatus(e.target.value as ClientStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white text-xs font-semibold outline-none focus:border-[#D4AF37] transition-all"
              >
                <option value="closed_won" className="bg-[#181818] text-white">Closed — Won (Triggers 60-Min Onboarding Pack)</option>
                <option value="active" className="bg-[#181818] text-white">Active (Production Underway)</option>
                <option value="proposal_sent" className="bg-[#181818] text-white">Proposal Sent</option>
                <option value="negotiation" className="bg-[#181818] text-white">Negotiation</option>
                <option value="lead" className="bg-[#181818] text-white">Lead</option>
                <option value="on_hold" className="bg-[#181818] text-white">On Hold</option>
                <option value="completed" className="bg-[#181818] text-white">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Kickoff / Start Date
              </label>
              <input
                type="date"
                value={projectStartDate}
                onChange={(e) => setProjectStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white text-xs outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Target Handover Date
              </label>
              <input
                type="date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white text-xs outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Detailed Scope Description &amp; Custom Requirements
              </label>
              <textarea
                rows={3}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Specific features, third-party APIs, custom workflows, or integrations required..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white placeholder:text-slate-500 text-xs outline-none focus:border-[#D4AF37] transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Financial & Commercial Terms */}
        <div className="p-6 md:p-8 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              3. Commercials &amp; Payment Architecture
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Agreed Amount (INR) *
              </label>
              <input
                required
                type="number"
                value={agreedAmount}
                onChange={(e) => setAgreedAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white text-xs font-mono font-bold outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Advance Deposit (INR)
              </label>
              <input
                type="number"
                value={advancePayment}
                onChange={(e) => setAdvancePayment(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white text-xs font-mono font-bold outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white text-xs font-semibold outline-none focus:border-[#D4AF37] transition-all"
              >
                <option value="partial" className="bg-[#181818] text-white">Partial (Advance Received)</option>
                <option value="paid" className="bg-[#181818] text-white">Fully Settled</option>
                <option value="unpaid" className="bg-[#181818] text-white">Unpaid / Awaiting Transfer</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Payment Schedule Condition
              </label>
              <input
                type="text"
                value={paymentSchedule}
                onChange={(e) => setPaymentSchedule(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white text-xs outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Team Assignment */}
        <div className="p-6 md:p-8 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
            <Users className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              4. Primary Team Assignment
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Primary Assigned Engineer / Lead
            </label>
            <select
              value={primaryEmployeeId}
              onChange={(e) => setPrimaryEmployeeId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-white text-xs font-semibold outline-none focus:border-[#D4AF37] transition-all"
            >
              <option value="" className="bg-[#181818] text-white">-- Select Primary Lead (Can assign later) --</option>
              {employees.map((emp) => (
                <option key={emp.uid} value={emp.uid} className="bg-[#181818] text-white">
                  {emp.fullName} &mdash; {emp.designation} ({emp.department})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Assigned employees will be able to view this client in their dedicated Employee Portal.
            </p>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/clients"
            className="px-5 py-2.5 rounded-xl border border-white/10 bg-[#181818] text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8D18A] to-[#A67C22] text-[#101010] font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Recording Client..." : "Save Client & Kickoff"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

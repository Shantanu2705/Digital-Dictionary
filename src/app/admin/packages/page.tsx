"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { ServicePackage, CustomPackage } from "@/types/portal";
import { INITIAL_PACKAGES } from "@/lib/data/initialCatalogue";
import { 
  Package, 
  Plus, 
  CheckCircle, 
  Download, 
  Clock, 
  Tag, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  Filter,
  Sparkles,
  Calculator,
  Save,
  Trash2
} from "lucide-react";
import { generatePackageMenuPDF, generateQuotationPDF } from "@/lib/pdf/pdfEngine";

export default function PackagesAdminPage() {
  const [packages, setPackages] = useState<ServicePackage[]>(INITIAL_PACKAGES);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"catalogue" | "custom_builder">("catalogue");

  // Custom Package Builder state
  const [clientName, setClientName] = useState("");
  const [customPackageName, setCustomPackageName] = useState("");
  const [selectedBasePackages, setSelectedBasePackages] = useState<string[]>([]);
  const [lineItems, setLineItems] = useState<{ description: string; quantity: number; unitPrice: number }[]>([
    { description: "Custom UI/UX Prototypes & Figma System", quantity: 1, unitPrice: 15000 },
  ]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [savingCustom, setSavingCustom] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter packages
  const filteredPackages = packages.filter(p => {
    if (selectedCategory === "all") return true;
    return p.category === selectedCategory;
  });

  const categories = [
    { id: "all", label: "All 11 Official Packages" },
    { id: "Web Architecture", label: "Web Architecture" },
    { id: "Mobile App Ecosystems", label: "Mobile App Ecosystems" },
    { id: "Ongoing Care & Growth", label: "Care & Growth Engines" },
  ];

  const handleDownloadMenuPDF = () => {
    const pdf = generatePackageMenuPDF(packages);
    pdf.doc.save("Digital_Dictionary_Premium_Service_Menu_2026.pdf");
  };

  // Custom Builder Calculations
  const basePackagesTotal = selectedBasePackages.reduce((acc, code) => {
    const pkg = packages.find(p => p.code === code);
    return acc + (pkg ? pkg.price : 0);
  }, 0);

  const customItemsTotal = lineItems.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unitPrice)), 0);
  const subTotal = basePackagesTotal + customItemsTotal;
  const grandTotal = Math.max(0, subTotal - Number(discountAmount));

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const copy = [...lineItems];
    copy[index] = { ...copy[index], [field]: value };
    setLineItems(copy);
  };

  const toggleBasePackage = (code: string) => {
    if (selectedBasePackages.includes(code)) {
      setSelectedBasePackages(selectedBasePackages.filter(c => c !== code));
    } else {
      setSelectedBasePackages([...selectedBasePackages, code]);
    }
  };

  const handleSaveCustomPackage = async () => {
    if (!clientName || !customPackageName) {
      alert("Please enter a Client Name and Custom Package Name.");
      return;
    }
    setSavingCustom(true);
    try {
      const customPkg: Omit<CustomPackage, "id"> = {
        clientId: "CUSTOM-" + Date.now(),
        clientName,
        packageName: customPackageName,
        basePackageCodes: selectedBasePackages,
        customServices: lineItems.map(i => i.description).filter(Boolean),
        lineItems: lineItems.map(i => ({ ...i, total: i.quantity * i.unitPrice })),
        totalPrice: subTotal,
        discount: Number(discountAmount),
        finalPrice: grandTotal,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "custom_packages"), customPkg);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setSavingCustom(false);
    }
  };

  const handleGenerateCustomQuotationPDF = () => {
    const items = [
      ...selectedBasePackages.map(code => {
        const pkg = packages.find(p => p.code === code);
        return {
          description: `${pkg?.name} (${pkg?.code}) - ${pkg?.shortDescription}`,
          qty: 1,
          rate: pkg?.price || 0,
          total: pkg?.price || 0,
        };
      }),
      ...lineItems.map(i => ({
        description: i.description,
        qty: Number(i.quantity),
        rate: Number(i.unitPrice),
        total: Number(i.quantity) * Number(i.unitPrice),
      })),
    ];

    const quotationData = {
      quotationNumber: `DD-QUO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: clientName || "Valued Enterprise Client",
      companyName: clientName ? `${clientName} Enterprises` : "Client Organization",
      email: "contact@client.com",
      phone: "+91 98765 43210",
      projectName: customPackageName || "Strategic Digital Architecture Engagement",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN"),
      items,
      subTotal,
      discount: Number(discountAmount),
      tax: Math.round(grandTotal * 0.18),
      grandTotal: Math.round(grandTotal * 1.18),
      notes: "Quotation generated via Digital Dictionary Custom Package Suite. Valid for 30 business days.",
      paymentTerms: "50% upfront commitment, 30% milestone review, 20% on production go-live.",
    };

    const pdf = generateQuotationPDF(quotationData);
    pdf.doc.save(`Quotation_${(clientName || "Proposal").replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-[#D4AF37]" />
            Service Catalogue & Custom Solution Builder
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Official tariff models from the Premium Service Catalogue with tailored package assembly engine.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadMenuPDF}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            Download Branded Menu PDF
          </button>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("catalogue")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === "catalogue"
              ? "bg-[#D4AF37] text-black shadow-md"
              : "bg-neutral-900 text-neutral-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          Standard 11 Packages Catalogue
        </button>
        <button
          onClick={() => setActiveTab("custom_builder")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === "custom_builder"
              ? "bg-[#D4AF37] text-black shadow-md"
              : "bg-neutral-900 text-neutral-400 hover:text-white"
          }`}
        >
          <Calculator className="w-4 h-4" />
          Custom Package & Proposal Builder
        </button>
      </div>

      {activeTab === "catalogue" ? (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === c.id
                    ? "bg-[#D4AF37]/20 text-[#E8D18A] border border-[#D4AF37]/40"
                    : "bg-neutral-900/60 text-neutral-400 hover:text-white border border-white/5"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.code}
                className="rounded-xl border border-white/5 bg-neutral-900/50 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-[#D4AF37]/30 transition-all group"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded bg-[#D4AF37]/10 text-[#E8D18A] border border-[#D4AF37]/30 text-xs font-bold font-mono tracking-wider">
                      {pkg.code}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                      {pkg.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                      {pkg.shortDescription}
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div className="p-3.5 rounded-lg bg-black/50 border border-white/5 space-y-1">
                    <div className="text-[10px] uppercase text-neutral-500 font-semibold">Official Investment</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold text-white font-mono">
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </span>
                      {pkg.billingType === "monthly" && (
                        <span className="text-xs text-neutral-400">/ month</span>
                      )}
                      {pkg.priceType === "starting_from" && (
                        <span className="text-xs text-[#E8D18A]">starting</span>
                      )}
                    </div>
                    {pkg.traditionalAgencyPrice && (
                      <div className="text-[11px] text-neutral-500 line-through">
                        Market standard: {pkg.traditionalAgencyPrice}
                      </div>
                    )}
                  </div>

                  {/* Designed For */}
                  {pkg.designedFor && (
                    <div className="text-xs text-neutral-300">
                      <span className="text-[#D4AF37] font-semibold">Target: </span>
                      {pkg.designedFor}
                    </div>
                  )}

                  {/* Delivery Timeline */}
                  {pkg.deliveryTimeline && (
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{pkg.deliveryTimeline}</span>
                    </div>
                  )}

                  {/* Deliverables / Key Features */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <div className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">Key Scope</div>
                    <ul className="space-y-1 text-xs text-neutral-400">
                      {pkg.includedFeatures.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-5 mt-5 border-t border-white/5">
                  <Link
                    href={`/admin/clients/new?package=${pkg.code}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-white text-xs font-semibold border border-white/5 transition-colors"
                  >
                    Onboard Client With This Package
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Custom Solution Builder View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Solution Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                Client & Engagement Definition
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Client Organization / Company <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Apollo Diagnostics Hub"
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Solution / Proposal Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={customPackageName}
                    onChange={(e) => setCustomPackageName(e.target.value)}
                    placeholder="e.g. Enterprise Next.js Ecosystem & 6-Month Growth Retainer"
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>
              </div>
            </div>

            {/* Base Packages Selector */}
            <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-3">
              <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <Package className="w-4 h-4 text-[#D4AF37]" />
                Select Foundation Packages (Multi-Select)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {packages.map((pkg) => {
                  const isSelected = selectedBasePackages.includes(pkg.code);
                  return (
                    <div
                      key={pkg.code}
                      onClick={() => toggleBasePackage(pkg.code)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white"
                          : "bg-neutral-950/60 border-white/5 text-neutral-400 hover:border-white/20"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#E8D18A]">{pkg.code}</span>
                          <span className="text-xs font-semibold text-white">{pkg.name}</span>
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">{pkg.category}</div>
                      </div>
                      <div className="text-xs font-mono font-bold text-[#D4AF37]">
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Line Items */}
            <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#D4AF37]" />
                  Custom Engineering Add-ons & Services
                </h2>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold hover:bg-[#D4AF37]/20 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Line Item
                </button>
              </div>

              <div className="space-y-2.5">
                {lineItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-6">
                      <input
                        type="text"
                        placeholder="Service description..."
                        value={item.description}
                        onChange={(e) => updateLineItem(index, "description", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, "quantity", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Rate (₹)"
                        value={item.unitPrice}
                        onChange={(e) => updateLineItem(index, "unitPrice", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Quote Breakdown & Actions */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-md space-y-4">
              <h3 className="text-base font-semibold text-white border-b border-white/5 pb-2.5">
                Commercial Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Base Packages ({selectedBasePackages.length})</span>
                  <span className="font-mono text-white font-medium">₹{basePackagesTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Custom Add-ons</span>
                  <span className="font-mono text-white font-medium">₹{customItemsTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-neutral-300 font-semibold pt-2 border-t border-white/5">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">₹{subTotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="pt-2">
                  <label className="block text-neutral-400 mb-1">Commercial Discount (₹)</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>

                <div className="p-3.5 rounded-lg bg-black/60 border border-white/10 flex items-center justify-between">
                  <span className="text-neutral-300 font-bold">Net Proposed Price:</span>
                  <span className="text-lg font-bold text-[#E8D18A] font-mono">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {saveSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Custom package saved to database.
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleGenerateCustomQuotationPDF}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#D4AF37] text-black font-semibold text-xs shadow hover:brightness-110 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Generate Branded Quotation PDF
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustomPackage}
                  disabled={savingCustom}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-white/10 transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {savingCustom ? "Saving..." : "Save Custom Package Record"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

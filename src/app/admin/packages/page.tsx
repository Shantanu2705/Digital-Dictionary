"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, getDocs, addDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { ServicePackage, CustomPackage, CatalogueCategory } from "@/types/portal";
import { INITIAL_PACKAGES, CATALOGUE_ADDONS } from "@/lib/data/initialCatalogue";
import {
  fetchLiveCatalogue,
  saveCataloguePackage,
  syncOfficialCatalogueToFirestore,
} from "@/lib/data/catalogueStore";
import {
  Package,
  Plus,
  CheckCircle,
  Download,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  Calculator,
  Save,
  Trash2,
  Edit3,
  RefreshCw,
  X,
  FileText,
  Sliders,
  Check,
  Monitor,
  Smartphone,
  Percent,
} from "lucide-react";
import { generatePackageMenuPDF, generateQuotationPDF } from "@/lib/pdf/pdfEngine";

export default function PackagesAdminPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<ServicePackage[]>(INITIAL_PACKAGES);
  const [isSyncedToDb, setIsSyncedToDb] = useState<boolean>(true);
  const [loadingCat, setLoadingCat] = useState<boolean>(true);
  const [syncingAll, setSyncingAll] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"catalogue" | "custom_builder">("catalogue");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Edit Master Package Modal state
  const [editingPkg, setEditingPkg] = useState<ServicePackage | null>(null);
  const [savingPkg, setSavingPkg] = useState(false);

  // Add New Bespoke Master Package Modal
  const [showAddPkgModal, setShowAddPkgModal] = useState(false);
  const [newPkgForm, setNewPkgForm] = useState<{
    code: string;
    name: string;
    category: CatalogueCategory;
    pageLimit: string;
    screenLimit: string;
    shortDescription: string;
    price: number;
    billingType: "one-time" | "monthly" | "custom";
    priceType: "fixed" | "starting_from" | "custom_quote";
    deliveryTimeline: string;
    designedFor: string;
  }>({
    code: "CST-01",
    name: "",
    category: "Custom",
    pageLimit: "",
    screenLimit: "",
    shortDescription: "",
    price: 50000,
    billingType: "one-time",
    priceType: "fixed",
    deliveryTimeline: "3 - 4 Weeks",
    designedFor: "",
  });

  // Custom Proposal / Client-Specific Pricing Builder State
  const [clientName, setClientName] = useState("");
  const [customPackageName, setCustomPackageName] = useState("");
  const [selectedBasePackages, setSelectedBasePackages] = useState<string[]>([]);
  const [packagePriceOverrides, setPackagePriceOverrides] = useState<Record<string, number>>({});
  const [globalPercentAdjust, setGlobalPercentAdjust] = useState<number>(0);

  // PDF Add-ons Calculator State (Extra Pages @ 2,500 / Extra Screens @ 4,000)
  const [extraPages, setExtraPages] = useState<number>(0);
  const [extraPageRate, setExtraPageRate] = useState<number>(CATALOGUE_ADDONS.additionalPageRate);
  const [extraScreens, setExtraScreens] = useState<number>(0);
  const [extraScreenRate, setExtraScreenRate] = useState<number>(CATALOGUE_ADDONS.additionalScreenRate);

  const [lineItems, setLineItems] = useState<{ description: string; quantity: number; unitPrice: number }[]>([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [includeGst, setIncludeGst] = useState(false);
  const [savingCustom, setSavingCustom] = useState(false);
  const [savedProposals, setSavedProposals] = useState<CustomPackage[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const loadInitialData = async () => {
    setLoadingCat(true);
    try {
      const { packages: live, isSyncedToDb: synced } = await fetchLiveCatalogue();
      setPackages(live);
      setIsSyncedToDb(synced);

      // Load saved custom proposals
      try {
        const snap = await getDocs(collection(db, "custom_packages"));
        const list: CustomPackage[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<CustomPackage, "id">) }));
        list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        setSavedProposals(list);
      } catch {}
    } finally {
      setLoadingCat(false);
    }
  };

  const handleSync2026Defaults = async () => {
    setSyncingAll(true);
    try {
      await syncOfficialCatalogueToFirestore(INITIAL_PACKAGES);
      setPackages(INITIAL_PACKAGES);
      setIsSyncedToDb(true);
      showToast("22 Official 2026 Service Catalogue packages synced to database.");
    } catch (err: any) {
      alert("Sync failed: " + err.message);
    } finally {
      setSyncingAll(false);
    }
  };

  const handleSaveMasterEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;
    setSavingPkg(true);
    try {
      const cleaned: ServicePackage = {
        ...editingPkg,
        price: editingPkg.priceType === "custom_quote" ? 0 : Number(editingPkg.price) || 0,
        updatedAt: new Date().toISOString(),
      };
      await saveCataloguePackage(cleaned);
      setPackages((prev) => prev.map((p) => (p.id === cleaned.id ? cleaned : p)));
      setIsSyncedToDb(true);
      setEditingPkg(null);
      showToast(`Custom catalog price saved for ${cleaned.name} (${cleaned.code}).`);
    } catch (err: any) {
      alert("Failed to update package: " + err.message);
    } finally {
      setSavingPkg(false);
    }
  };

  const handleAddBespokePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgForm.name.trim() || !newPkgForm.code.trim()) return;
    setSavingPkg(true);
    try {
      const newPkg: ServicePackage = {
        id: `pkg-custom-${Date.now()}`,
        code: newPkgForm.code.trim().toUpperCase(),
        name: newPkgForm.name.trim(),
        category: newPkgForm.category,
        pageLimit: newPkgForm.pageLimit.trim() || undefined,
        screenLimit: newPkgForm.screenLimit.trim() || undefined,
        shortDescription: newPkgForm.shortDescription.trim() || "Custom service package.",
        fullDescription: newPkgForm.shortDescription.trim() || "Tailored custom service tier.",
        price: newPkgForm.priceType === "custom_quote" ? 0 : Number(newPkgForm.price) || 0,
        currency: "INR",
        billingType: newPkgForm.billingType,
        priceType: newPkgForm.priceType,
        includedFeatures: ["Tailored custom deliverables as specified in client proposal"],
        deliveryTimeline: newPkgForm.deliveryTimeline.trim() || "Scoped per Proposal",
        designedFor: newPkgForm.designedFor.trim() || "Custom enterprise requirements",
        active: true,
        displayOrder: packages.length + 1,
        updatedAt: new Date().toISOString(),
      };
      await saveCataloguePackage(newPkg);
      setPackages((prev) => [...prev, newPkg]);
      setIsSyncedToDb(true);
      setShowAddPkgModal(false);
      setNewPkgForm({
        code: `CST-${String(packages.length + 1).padStart(2, "0")}`,
        name: "",
        category: "Custom",
        pageLimit: "",
        screenLimit: "",
        shortDescription: "",
        price: 50000,
        billingType: "one-time",
        priceType: "fixed",
        deliveryTimeline: "3 - 4 Weeks",
        designedFor: "",
      });
      showToast(`Added custom package ${newPkg.code} — ${newPkg.name} to official catalogue.`);
    } catch (err: any) {
      alert("Could not add package: " + err.message);
    } finally {
      setSavingPkg(false);
    }
  };

  const filteredPackages = packages.filter((p) => {
    if (selectedCategory === "all") return true;
    return p.category === selectedCategory;
  });

  const categories = [
    { id: "all", label: `All ${packages.length} Official Packages` },
    { id: "Website Architecture", label: "Website Architecture" },
    { id: "Mobile Application Systems", label: "Mobile Apps" },
    { id: "Connected Web + App", label: "Connected Web + App" },
    { id: "Commerce & Business Workflows", label: "Commerce & Workflows" },
    { id: "Ongoing Care & Growth", label: "Care & Growth" },
    { id: "Custom", label: "Custom Tiers" },
  ];

  const handleDownloadMenuPDF = () => {
    const activeList = packages.filter((p) => p.active !== false);
    const pdf = generatePackageMenuPDF(activeList);
    pdf.doc.save("Digital_Dictionary_Premium_Service_Catalogue_2026.pdf");
  };

  // ==========================================
  // CUSTOM PROPOSAL BUILDER LOGIC
  // ==========================================
  const toggleBasePackage = (pkg: ServicePackage) => {
    if (selectedBasePackages.includes(pkg.code)) {
      setSelectedBasePackages(selectedBasePackages.filter((c) => c !== pkg.code));
    } else {
      setSelectedBasePackages([...selectedBasePackages, pkg.code]);
      if (packagePriceOverrides[pkg.code] === undefined) {
        const adjusted =
          globalPercentAdjust !== 0
            ? Math.round((pkg.price * (100 + globalPercentAdjust)) / 100)
            : pkg.price;
        setPackagePriceOverrides((prev) => ({ ...prev, [pkg.code]: adjusted }));
      }
    }
  };

  const updateOverridePrice = (code: string, price: number) => {
    setPackagePriceOverrides((prev) => ({ ...prev, [code]: Math.max(0, price) }));
  };

  const applyGlobalMultiplierToSelected = (pct: number) => {
    setGlobalPercentAdjust(pct);
    const nextOverrides: Record<string, number> = { ...packagePriceOverrides };
    for (const code of selectedBasePackages) {
      const pkg = packages.find((p) => p.code === code);
      if (pkg && pkg.price > 0) {
        nextOverrides[code] = Math.round((pkg.price * (100 + pct)) / 100);
      }
    }
    setPackagePriceOverrides(nextOverrides);
  };

  const toggleOptionalModule = (mod: (typeof CATALOGUE_ADDONS.optionalModules)[0]) => {
    const existsIdx = lineItems.findIndex((i) => i.description === mod.name);
    if (existsIdx >= 0) {
      setLineItems(lineItems.filter((_, i) => i !== existsIdx));
    } else {
      setLineItems([...lineItems, { description: mod.name, quantity: 1, unitPrice: mod.suggestedPrice }]);
    }
  };

  const getEffectivePackagePrice = (pkg: ServicePackage) => {
    return packagePriceOverrides[pkg.code] !== undefined ? packagePriceOverrides[pkg.code] : pkg.price;
  };

  const basePackagesTotal = selectedBasePackages.reduce((acc, code) => {
    const pkg = packages.find((p) => p.code === code);
    return acc + (pkg ? getEffectivePackagePrice(pkg) : 0);
  }, 0);

  const extraPagesTotal = Number(extraPages) * Number(extraPageRate);
  const extraScreensTotal = Number(extraScreens) * Number(extraScreenRate);
  const customItemsTotal = lineItems.reduce(
    (acc, item) => acc + Number(item.quantity || 0) * Number(item.unitPrice || 0),
    0
  );

  const subTotal = basePackagesTotal + extraPagesTotal + extraScreensTotal + customItemsTotal;
  const netBeforeTax = Math.max(0, subTotal - Number(discountAmount || 0));
  const gstAmount = includeGst ? Math.round(netBeforeTax * 0.18) : 0;
  const grandTotal = netBeforeTax + gstAmount;

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

  const handleSaveCustomPackage = async () => {
    if (!clientName.trim() || !customPackageName.trim()) {
      alert("Please enter a Client Organization and Solution / Proposal Title.");
      return;
    }
    setSavingCustom(true);
    try {
      const customPkg: Omit<CustomPackage, "id"> = {
        clientId: "CUSTOM-" + Date.now(),
        clientName: clientName.trim(),
        packageName: customPackageName.trim(),
        basePackageCodes: selectedBasePackages,
        packagePriceOverrides,
        extraPages: Number(extraPages),
        extraPageRate: Number(extraPageRate),
        extraScreens: Number(extraScreens),
        extraScreenRate: Number(extraScreenRate),
        gstEnabled: includeGst,
        customServices: lineItems.map((i) => i.description).filter(Boolean),
        lineItems: lineItems.map((i) => ({
          ...i,
          total: Number(i.quantity) * Number(i.unitPrice),
        })),
        totalPrice: subTotal,
        discount: Number(discountAmount),
        finalPrice: grandTotal,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "custom_packages"), customPkg);
      setSavedProposals((prev) => [{ id: docRef.id, ...customPkg }, ...prev]);
      showToast(`Custom pricing record saved for ${clientName}.`);
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setSavingCustom(false);
    }
  };

  const handleGenerateCustomQuotationPDF = () => {
    const items = [
      ...selectedBasePackages.map((code) => {
        const pkg = packages.find((p) => p.code === code);
        const effPrice = pkg ? getEffectivePackagePrice(pkg) : 0;
        const limitTag = [pkg?.pageLimit, pkg?.screenLimit].filter(Boolean).join(" + ");
        return {
          description: `${pkg?.name} (${pkg?.code})${limitTag ? ` [${limitTag}]` : ""} — ${pkg?.shortDescription || ""}`,
          qty: 1,
          rate: effPrice,
          total: effPrice,
        };
      }),
      ...(extraPages > 0
        ? [
            {
              description: `Additional Standard Website Pages (${extraPages} extra pages beyond base tier)`,
              qty: extraPages,
              rate: extraPageRate,
              total: extraPagesTotal,
            },
          ]
        : []),
      ...(extraScreens > 0
        ? [
            {
              description: `Additional Standard Mobile App Screens (${extraScreens} extra screens beyond base tier)`,
              qty: extraScreens,
              rate: extraScreenRate,
              total: extraScreensTotal,
            },
          ]
        : []),
      ...lineItems
        .filter((i) => i.description.trim())
        .map((i) => ({
          description: i.description,
          qty: Number(i.quantity),
          rate: Number(i.unitPrice),
          total: Number(i.quantity) * Number(i.unitPrice),
        })),
    ];

    const quotationData = {
      quotationNumber: `DD-QUO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: clientName || "Valued Client",
      companyName: clientName || "Client Organization",
      email: "contact@client.com",
      phone: "+91 —",
      projectName: customPackageName || "Tailored Digital Ecosystem Proposal",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN"),
      items,
      subTotal,
      discount: Number(discountAmount),
      tax: gstAmount,
      grandTotal,
      notes: includeGst
        ? "Quotation includes 18% GST. Valid for 30 business days. Third-party APIs, domain/hosting & ad spend billed separately."
        : "Prices shown are in INR (Applicable GST extra unless stated). Valid for 30 business days.",
      paymentTerms: "50% Advance Commitment, 30% Milestone Review, 20% Production Handover.",
    };

    const pdf = generateQuotationPDF(quotationData);
    pdf.doc.save(`Custom_Quotation_${(clientName || "Client").replace(/\s+/g, "_")}.pdf`);
  };

  const handleDownloadCustomClientMenuPDF = () => {
    const tailoredPackages = packages
      .filter((p) => selectedBasePackages.length === 0 || selectedBasePackages.includes(p.code))
      .map((p) => {
        const eff = getEffectivePackagePrice(p);
        return {
          ...p,
          price: eff,
          priceType: eff > 0 && p.priceType === "custom_quote" ? "fixed" : p.priceType,
        };
      });

    const subtitle = clientName
      ? `Prepared Exclusively for ${clientName}`
      : "Tailored Client Service & Pricing Menu";
    const pdf = generatePackageMenuPDF(tailoredPackages, undefined, subtitle);
    pdf.doc.save(`Tailored_Service_Menu_${(clientName || "Custom").replace(/\s+/g, "_")}.pdf`);
  };

  const handleProceedToClientOnboarding = () => {
    const primaryCode = selectedBasePackages[0] || "";
    const params = new URLSearchParams();
    if (primaryCode) params.set("package", primaryCode);
    if (grandTotal > 0) params.set("customPrice", String(grandTotal));
    if (clientName.trim()) params.set("clientName", clientName.trim());
    if (customPackageName.trim()) params.set("projectName", customPackageName.trim());
    router.push(`/admin/clients/new?${params.toString()}`);
  };

  const loadSavedProposalIntoBuilder = (prop: CustomPackage) => {
    setClientName(prop.clientName || "");
    setCustomPackageName(prop.packageName || "");
    setSelectedBasePackages(prop.basePackageCodes || []);
    setPackagePriceOverrides(prop.packagePriceOverrides || {});
    setExtraPages(prop.extraPages || 0);
    setExtraPageRate(prop.extraPageRate || CATALOGUE_ADDONS.additionalPageRate);
    setExtraScreens(prop.extraScreens || 0);
    setExtraScreenRate(prop.extraScreenRate || CATALOGUE_ADDONS.additionalScreenRate);
    setIncludeGst(Boolean(prop.gstEnabled));
    setLineItems(
      (prop.lineItems || []).map((l) => ({
        description: l.description,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
      }))
    );
    setDiscountAmount(prop.discount || 0);
    showToast(`Loaded saved custom proposal for ${prop.clientName}.`);
  };

  const defaultForId = (id: string) => INITIAL_PACKAGES.find((d) => d.id === id);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-[#D4AF37]" />
            2026 Service Catalogue &amp; Custom Price Engine
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Official Digital Dictionary Premium Service Collection with live tariff overrides &amp; custom client menu builder.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddPkgModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
            Add Custom Package
          </button>

          <button
            onClick={handleSync2026Defaults}
            disabled={syncingAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-white/10 text-neutral-300 text-xs font-semibold border border-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#D4AF37] ${syncingAll ? "animate-spin" : ""}`} />
            {syncingAll ? "Syncing..." : "Reset to 2026 PDF Defaults"}
          </button>

          <button
            onClick={handleDownloadMenuPDF}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-xs font-bold shadow hover:brightness-110 transition-all"
          >
            <Download className="w-4 h-4" />
            Download Branded Menu PDF
          </button>
        </div>
      </div>

      {/* Status Toast */}
      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Unsynced Banner */}
      {!loadingCat && !isSyncedToDb && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-[#D4AF37]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs text-neutral-300">
            <span className="font-bold text-[#E8D18A]">2026 PDF Catalogue Ready:</span> Showing the 22 official updated packages. Click sync once to persist all 22 tiers in Firestore so your custom edits apply across the whole workspace.
          </div>
          <button
            onClick={handleSync2026Defaults}
            disabled={syncingAll}
            className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-bold shrink-0 hover:brightness-110 transition-all"
          >
            {syncingAll ? "Syncing..." : "Sync 2026 Catalogue to DB"}
          </button>
        </div>
      )}

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
          Master 22-Package Catalogue (Live Pricing)
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
          Smart Custom Client Price &amp; Proposal Builder
        </button>
      </div>

      {activeTab === "catalogue" ? (
        <div className="space-y-6">
          {/* Category Filter Pills & Add-On Rate Reference */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
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

            <div className="text-[11px] font-mono text-neutral-400 bg-neutral-900/60 border border-white/5 px-3 py-1.5 rounded-lg">
              Add-ons: <span className="text-[#E8D18A]">₹2,500/page</span> · <span className="text-[#E8D18A]">₹4,000/screen</span>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => {
              const baseline = defaultForId(pkg.id);
              const isCustomized = baseline && baseline.price !== pkg.price;

              return (
                <div
                  key={pkg.id}
                  className={`rounded-xl border bg-neutral-900/50 backdrop-blur-sm p-6 flex flex-col justify-between transition-all group ${
                    pkg.active === false
                      ? "border-red-500/20 opacity-60"
                      : isCustomized
                      ? "border-[#D4AF37]/50 hover:border-[#D4AF37]"
                      : "border-white/5 hover:border-[#D4AF37]/30"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded bg-[#D4AF37]/10 text-[#E8D18A] border border-[#D4AF37]/30 text-xs font-bold font-mono tracking-wider">
                          {pkg.code}
                        </span>
                        {isCustomized && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            Custom Rate
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold text-right">
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

                    {/* Limits Badges */}
                    {(pkg.pageLimit || pkg.screenLimit) && (
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.pageLimit && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-950 border border-white/10 text-[11px] text-neutral-300 font-mono">
                            <Monitor className="w-3 h-3 text-[#D4AF37]" />
                            {pkg.pageLimit}
                          </span>
                        )}
                        {pkg.screenLimit && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-950 border border-white/10 text-[11px] text-neutral-300 font-mono">
                            <Smartphone className="w-3 h-3 text-[#D4AF37]" />
                            {pkg.screenLimit}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Pricing Box */}
                    <div className="p-3.5 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] uppercase text-neutral-500 font-semibold">
                          {pkg.billingType === "monthly" ? "Monthly Retainer" : "Catalog Investment"}
                        </div>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-xl font-bold text-white font-mono">
                            {pkg.priceType === "custom_quote"
                              ? "Custom Quote"
                              : `₹${Number(pkg.price || 0).toLocaleString("en-IN")}`}
                          </span>
                          {pkg.billingType === "monthly" && pkg.priceType !== "custom_quote" && (
                            <span className="text-xs text-neutral-400">/ month</span>
                          )}
                          {pkg.priceType === "starting_from" && (
                            <span className="text-xs text-[#E8D18A] font-bold">+</span>
                          )}
                        </div>
                        {isCustomized && baseline && (
                          <div className="text-[10px] text-neutral-500 mt-0.5">
                            PDF baseline: ₹{baseline.price.toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditingPkg({ ...pkg })}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-neutral-300 text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1 shrink-0"
                        title="Edit Custom Price & Scope"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Price
                      </button>
                    </div>

                    {/* Designed For */}
                    {pkg.designedFor && (
                      <div className="text-xs text-neutral-300">
                        <span className="text-[#D4AF37] font-semibold">Best for: </span>
                        {pkg.designedFor}
                      </div>
                    )}

                    {/* Deliverables / Key Features */}
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <div className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">Key Scope</div>
                      <ul className="space-y-1 text-xs text-neutral-400">
                        {(pkg.includedFeatures || []).slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-5 mt-5 border-t border-white/5 flex items-center gap-2">
                    <Link
                      href={`/admin/clients/new?package=${pkg.code}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-white text-xs font-semibold border border-white/5 transition-colors"
                    >
                      Onboard Client
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedBasePackages.includes(pkg.code)) {
                          toggleBasePackage(pkg);
                        }
                        setActiveTab("custom_builder");
                      }}
                      className="px-3 py-2 rounded-lg bg-neutral-950 hover:bg-white/10 text-[#E8D18A] text-xs font-semibold border border-white/10 transition-colors"
                      title="Customize Price in Proposal Builder"
                    >
                      Custom Quote
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Smart Custom Client Price & Proposal Builder View */
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols */}
            <div className="lg:col-span-2 space-y-6">
              {/* Client & Rate Multiplier Preset */}
              <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    1. Client &amp; Custom Rate Strategy
                  </h2>

                  {/* Smart Multiplier Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-neutral-400 mr-1 flex items-center gap-1">
                      <Percent className="w-3 h-3 text-[#D4AF37]" /> Rate Preset:
                    </span>
                    {[
                      { label: "Standard (0%)", val: 0 },
                      { label: "-10% Partner", val: -10 },
                      { label: "-15% Startup", val: -15 },
                      { label: "+15% Priority", val: 15 },
                      { label: "+25% Enterprise", val: 25 },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => applyGlobalMultiplierToSelected(preset.val)}
                        className={`px-2 py-0.5 rounded border transition-colors ${
                          globalPercentAdjust === preset.val
                            ? "bg-[#D4AF37] text-black border-[#D4AF37] font-bold"
                            : "bg-neutral-950 text-neutral-400 border-white/10 hover:text-white"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

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
                      placeholder="e.g. Custom Connected Web + Mobile Launch Suite"
                      className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                    />
                  </div>
                </div>
              </div>

              {/* Base Packages Selector with INLINE CUSTOM PRICE INPUTS */}
              <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-3">
                <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                  <Package className="w-4 h-4 text-[#D4AF37]" />
                  2. Select Packages &amp; Set Client-Specific Custom Prices
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {packages.map((pkg) => {
                    const isSelected = selectedBasePackages.includes(pkg.code);
                    const effPrice = getEffectivePackagePrice(pkg);

                    return (
                      <div
                        key={pkg.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isSelected
                            ? "bg-[#D4AF37]/10 border-[#D4AF37]"
                            : "bg-neutral-950/60 border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div
                          onClick={() => toggleBasePackage(pkg)}
                          className="flex items-start justify-between gap-2 cursor-pointer"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#E8D18A]">{pkg.code}</span>
                              <span className="text-xs font-semibold text-white">{pkg.name}</span>
                            </div>
                            <div className="text-[11px] text-neutral-500 mt-0.5">
                              {pkg.category}
                              {pkg.pageLimit ? ` · ${pkg.pageLimit}` : ""}
                              {pkg.screenLimit ? ` · ${pkg.screenLimit}` : ""}
                            </div>
                          </div>
                          <div className="text-xs font-mono font-bold text-[#D4AF37] shrink-0">
                            {pkg.priceType === "custom_quote" && effPrice === 0
                              ? "Custom"
                              : `₹${pkg.price.toLocaleString("en-IN")}`}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="mt-3 pt-2.5 border-t border-[#D4AF37]/20 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-[#E8D18A] font-medium">
                              Your Custom Price (₹):
                            </span>
                            <input
                              type="number"
                              min={0}
                              value={effPrice}
                              onChange={(e) => updateOverridePrice(pkg.code, Number(e.target.value))}
                              className="w-32 px-2.5 py-1 rounded-lg bg-black border border-[#D4AF37]/40 text-white text-xs font-mono font-bold text-right focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PDF Extra Pages & Screens Calculator + Optional Modules */}
              <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-5">
                <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                  <Sliders className="w-4 h-4 text-[#D4AF37]" />
                  3. Additional Pages / Screens &amp; Optional Modules
                </h2>

                {/* Extra Page & Screen Counters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-white/5 space-y-2">
                    <div className="text-xs font-semibold text-white flex items-center justify-between">
                      <span>Additional Website Pages</span>
                      <span className="text-[11px] font-mono text-[#D4AF37]">
                        ₹{extraPagesTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-neutral-500 mb-1">Extra Pages</label>
                        <input
                          type="number"
                          min={0}
                          value={extraPages}
                          onChange={(e) => setExtraPages(Math.max(0, Number(e.target.value)))}
                          className="w-full px-2.5 py-1.5 rounded bg-black border border-white/10 text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-500 mb-1">Rate / Page (₹)</label>
                        <input
                          type="number"
                          min={0}
                          value={extraPageRate}
                          onChange={(e) => setExtraPageRate(Math.max(0, Number(e.target.value)))}
                          className="w-full px-2.5 py-1.5 rounded bg-black border border-white/10 text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-white/5 space-y-2">
                    <div className="text-xs font-semibold text-white flex items-center justify-between">
                      <span>Additional App Screens</span>
                      <span className="text-[11px] font-mono text-[#D4AF37]">
                        ₹{extraScreensTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-neutral-500 mb-1">Extra Screens</label>
                        <input
                          type="number"
                          min={0}
                          value={extraScreens}
                          onChange={(e) => setExtraScreens(Math.max(0, Number(e.target.value)))}
                          className="w-full px-2.5 py-1.5 rounded bg-black border border-white/10 text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-500 mb-1">Rate / Screen (₹)</label>
                        <input
                          type="number"
                          min={0}
                          value={extraScreenRate}
                          onChange={(e) => setExtraScreenRate(Math.max(0, Number(e.target.value)))}
                          className="w-full px-2.5 py-1.5 rounded bg-black border border-white/10 text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Common Optional Modules Pills */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-neutral-300">Quick-Add Optional Modules (from 2026 PDF):</div>
                  <div className="flex flex-wrap gap-2">
                    {CATALOGUE_ADDONS.optionalModules.map((mod) => {
                      const active = lineItems.some((i) => i.description === mod.name);
                      return (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => toggleOptionalModule(mod)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                            active
                              ? "bg-[#D4AF37]/20 text-[#E8D18A] border-[#D4AF37]"
                              : "bg-neutral-950 text-neutral-400 border-white/10 hover:text-white"
                          }`}
                        >
                          {active ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          {mod.name} (₹{mod.suggestedPrice.toLocaleString("en-IN")})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Engineering Line Items */}
                <div className="space-y-2.5 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-300">Custom Add-ons &amp; Module Line Items</span>
                    <button
                      type="button"
                      onClick={addLineItem}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold hover:bg-[#D4AF37]/20 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Custom Item
                    </button>
                  </div>

                  {lineItems.length === 0 ? (
                    <div className="text-xs text-neutral-500 py-3 text-center bg-neutral-950/40 rounded-lg border border-white/5">
                      Click any Optional Module above or &ldquo;Add Custom Item&rdquo; to include tailored services.
                    </div>
                  ) : (
                    lineItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-6">
                          <input
                            type="text"
                            placeholder="Service / module description..."
                            value={item.description}
                            onChange={(e) => updateLineItem(index, "description", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            min={1}
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(index, "quantity", Number(e.target.value))}
                            className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]/50"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            min={0}
                            placeholder="Rate (₹)"
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(index, "unitPrice", Number(e.target.value))}
                            className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]/50"
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
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Col: Commercial Summary & Smart Actions */}
            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-white/10 bg-neutral-900/70 backdrop-blur-md space-y-4 sticky top-6">
                <h3 className="text-base font-semibold text-white border-b border-white/10 pb-2.5 flex items-center justify-between">
                  <span>Custom Price Summary</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#E8D18A]">
                    INR
                  </span>
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Selected Packages ({selectedBasePackages.length})</span>
                    <span className="font-mono text-white font-medium">₹{basePackagesTotal.toLocaleString("en-IN")}</span>
                  </div>
                  {(extraPagesTotal > 0 || extraScreensTotal > 0) && (
                    <div className="flex justify-between text-neutral-400">
                      <span>Extra Pages / Screens</span>
                      <span className="font-mono text-white font-medium">
                        ₹{(extraPagesTotal + extraScreensTotal).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-400">
                    <span>Modules &amp; Add-ons ({lineItems.length})</span>
                    <span className="font-mono text-white font-medium">₹{customItemsTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300 font-semibold pt-2 border-t border-white/10">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">₹{subTotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="pt-1">
                    <label className="block text-neutral-400 mb-1">Commercial Discount (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]/50"
                    />
                  </div>

                  <label className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950/60 border border-white/5 cursor-pointer">
                    <span className="text-neutral-300">Include 18% GST</span>
                    <input
                      type="checkbox"
                      checked={includeGst}
                      onChange={(e) => setIncludeGst(e.target.checked)}
                      className="accent-[#D4AF37]"
                    />
                  </label>

                  {includeGst && (
                    <div className="flex justify-between text-neutral-400">
                      <span>Estimated GST (18%)</span>
                      <span className="font-mono text-white">₹{gstAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-black/70 border border-[#D4AF37]/30 flex items-center justify-between">
                    <span className="text-neutral-300 font-bold">Net Proposed Total:</span>
                    <span className="text-xl font-bold text-[#E8D18A] font-mono">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Milestone Split */}
                  {grandTotal > 0 && (
                    <div className="p-3 rounded-lg bg-neutral-950/50 border border-white/5 space-y-1 text-[11px] text-neutral-400">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-[#D4AF37] mb-1">
                        Suggested Payment Split
                      </div>
                      <div className="flex justify-between">
                        <span>50% Advance:</span>
                        <span className="font-mono text-white">₹{Math.round(grandTotal * 0.5).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>30% Staging:</span>
                        <span className="font-mono text-white">₹{Math.round(grandTotal * 0.3).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>20% Go-Live:</span>
                        <span className="font-mono text-white">
                          ₹{(grandTotal - Math.round(grandTotal * 0.5) - Math.round(grandTotal * 0.3)).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleGenerateCustomQuotationPDF}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#D4AF37] text-black font-bold text-xs shadow hover:brightness-110 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Custom Quotation PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadCustomClientMenuPDF}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-white text-xs font-semibold border border-white/10 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Export Custom Priced Menu PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToClientOnboarding}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    Onboard Client at ₹{grandTotal.toLocaleString("en-IN")}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustomPackage}
                    disabled={savingCustom}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold border border-white/10 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {savingCustom ? "Saving..." : "Save Custom Proposal to DB"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Custom Proposals History */}
          {savedProposals.length > 0 && (
            <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D4AF37]" />
                Saved Client-Specific Custom Proposals ({savedProposals.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedProposals.slice(0, 6).map((prop) => (
                  <div
                    key={prop.id}
                    className="p-4 rounded-xl bg-neutral-950/70 border border-white/5 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{prop.clientName}</div>
                      <div className="text-[11px] text-neutral-400 line-clamp-1">{prop.packageName}</div>
                      <div className="text-base font-mono font-bold text-[#E8D18A] mt-2">
                        ₹{Number(prop.finalPrice || 0).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => loadSavedProposalIntoBuilder(prop)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-xs font-semibold text-white transition-colors"
                    >
                      Load Into Builder
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 1: EDIT MASTER CATALOG PRICE & SCOPE */}
      {/* ========================================== */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveMasterEdit}
            className="w-full max-w-lg rounded-2xl bg-[#121212] border border-[#D4AF37]/30 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
                  {editingPkg.code} · {editingPkg.category}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">Edit Catalog Price &amp; Scope</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPkg(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Package Title</label>
                <input
                  type="text"
                  required
                  value={editingPkg.name}
                  onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Price Type</label>
                  <select
                    value={editingPkg.priceType}
                    onChange={(e) =>
                      setEditingPkg({ ...editingPkg, priceType: e.target.value as any })
                    }
                    className="w-full px-2.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="starting_from">Starting From (+)</option>
                    <option value="custom_quote">Custom Quote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Billing Type</label>
                  <select
                    value={editingPkg.billingType}
                    onChange={(e) =>
                      setEditingPkg({ ...editingPkg, billingType: e.target.value as any })
                    }
                    className="w-full px-2.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white"
                  >
                    <option value="one-time">One-Time</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Custom Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    disabled={editingPkg.priceType === "custom_quote"}
                    value={editingPkg.price}
                    onChange={(e) =>
                      setEditingPkg({ ...editingPkg, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-[#D4AF37]/40 text-[#E8D18A] font-mono font-bold disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Website Page Limit</label>
                  <input
                    type="text"
                    value={editingPkg.pageLimit || ""}
                    onChange={(e) => setEditingPkg({ ...editingPkg, pageLimit: e.target.value })}
                    placeholder="e.g. Up to 10 pages"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Mobile Screen Limit</label>
                  <input
                    type="text"
                    value={editingPkg.screenLimit || ""}
                    onChange={(e) => setEditingPkg({ ...editingPkg, screenLimit: e.target.value })}
                    placeholder="e.g. Up to 15 screens"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Scope Summary</label>
                <textarea
                  rows={2}
                  value={editingPkg.shortDescription}
                  onChange={(e) =>
                    setEditingPkg({ ...editingPkg, shortDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white resize-none"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingPkg.active !== false}
                  onChange={(e) => setEditingPkg({ ...editingPkg, active: e.target.checked })}
                  className="accent-[#D4AF37]"
                />
                <span className="text-neutral-300">Active in Onboarding &amp; Menu PDF</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingPkg(null)}
                className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingPkg}
                className="px-5 py-2 rounded-lg bg-[#D4AF37] text-black text-xs font-bold hover:brightness-110 disabled:opacity-50"
              >
                {savingPkg ? "Saving..." : "Save Custom Price"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: ADD BRAND NEW CUSTOM PACKAGE      */}
      {/* ========================================== */}
      {showAddPkgModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddBespokePackage}
            className="w-full max-w-lg rounded-2xl bg-[#121212] border border-[#D4AF37]/30 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Add Custom Service Package</h3>
              <button
                type="button"
                onClick={() => setShowAddPkgModal(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Code *</label>
                  <input
                    type="text"
                    required
                    value={newPkgForm.code}
                    onChange={(e) => setNewPkgForm({ ...newPkgForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-neutral-400 mb-1">Package Name *</label>
                  <input
                    type="text"
                    required
                    value={newPkgForm.name}
                    onChange={(e) => setNewPkgForm({ ...newPkgForm, name: e.target.value })}
                    placeholder="e.g. AI Chatbot + WhatsApp Funnel"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Category</label>
                  <select
                    value={newPkgForm.category}
                    onChange={(e) =>
                      setNewPkgForm({ ...newPkgForm, category: e.target.value as CatalogueCategory })
                    }
                    className="w-full px-2.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white"
                  >
                    <option value="Custom">Custom</option>
                    <option value="Website Architecture">Website Architecture</option>
                    <option value="Mobile Application Systems">Mobile Application Systems</option>
                    <option value="Connected Web + App">Connected Web + App</option>
                    <option value="Commerce & Business Workflows">Commerce &amp; Business Workflows</option>
                    <option value="Ongoing Care & Growth">Ongoing Care &amp; Growth</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newPkgForm.price}
                    onChange={(e) => setNewPkgForm({ ...newPkgForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-[#D4AF37]/40 text-[#E8D18A] font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Billing Type</label>
                  <select
                    value={newPkgForm.billingType}
                    onChange={(e) =>
                      setNewPkgForm({ ...newPkgForm, billingType: e.target.value as any })
                    }
                    className="w-full px-2.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white"
                  >
                    <option value="one-time">One-Time</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Pricing Mode</label>
                  <select
                    value={newPkgForm.priceType}
                    onChange={(e) =>
                      setNewPkgForm({ ...newPkgForm, priceType: e.target.value as any })
                    }
                    className="w-full px-2.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="starting_from">Starting From (+)</option>
                    <option value="custom_quote">Custom Quote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Scope Summary</label>
                <textarea
                  rows={2}
                  value={newPkgForm.shortDescription}
                  onChange={(e) =>
                    setNewPkgForm({ ...newPkgForm, shortDescription: e.target.value })
                  }
                  placeholder="Describe deliverables and positioning..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAddPkgModal(false)}
                className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingPkg}
                className="px-5 py-2 rounded-lg bg-[#D4AF37] text-black text-xs font-bold hover:brightness-110 disabled:opacity-50"
              >
                {savingPkg ? "Creating..." : "Add to Catalogue"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

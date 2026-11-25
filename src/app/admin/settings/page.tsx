"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { CompanySettings } from "@/types/portal";
import { DEFAULT_COMPANY_SETTINGS } from "@/lib/data/initialCatalogue";
import { 
  Settings, 
  Save, 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  ShieldCheck, 
  CheckCircle,
  FileText,
  CreditCard,
  Stamp
} from "lucide-react";

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_COMPANY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "settings", "company");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setSettings({ ...DEFAULT_COMPANY_SETTINGS, ...snap.data() });
      }
    } catch (err) {
      console.error("Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    try {
      await setDoc(doc(db, "settings", "company"), settings);
      setSuccessMessage("Company settings & letterhead configuration saved successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-neutral-400">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading company configuration...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-[#D4AF37]" />
          Company & Legal Governance Settings
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Master company metadata, Govt. MSME registration, banking details, and official PDF letterhead configuration.
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Brand & Contact Info */}
        <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Building2 className="w-4 h-4 text-[#D4AF37]" />
            Corporate Identity & Communication
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Company Legal Name</label>
              <input
                type="text"
                name="companyName"
                value={settings.companyName}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Tagline / Motto</label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-neutral-300 mb-1">Registered Address</label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">City, State & PIN</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={settings.city}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={settings.state}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
                <input
                  type="text"
                  name="pinCode"
                  placeholder="PIN"
                  value={settings.pinCode}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Direct Contact Telephone</label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Corporate Email</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Official Website</label>
              <input
                type="text"
                name="website"
                value={settings.website}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Statutory & Banking Details */}
        <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <CreditCard className="w-4 h-4 text-[#D4AF37]" />
            Statutory Registration & Settlement Bank Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Govt. MSME Registration (Udyam)
              </label>
              <input
                type="text"
                name="msmeRegistration"
                value={settings.msmeRegistration}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">GSTIN Number</label>
              <input
                type="text"
                name="gstin"
                placeholder="e.g. 19ABCDE1234F1Z5"
                value={settings.gstin || ""}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={settings.bankName || "HDFC Bank"}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Account Number</label>
              <input
                type="text"
                name="bankAccountNumber"
                value={settings.bankAccountNumber || "50200088991122"}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Bank IFSC Code</label>
              <input
                type="text"
                name="bankIfsc"
                value={settings.bankIfsc || "HDFC0001234"}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Bank Branch</label>
              <input
                type="text"
                name="bankBranch"
                value={settings.bankBranch || "Siliguri Main Branch"}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Proprietor Signature & Stamp Artwork */}
        <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Stamp className="w-4 h-4 text-[#D4AF37]" />
            Authorized Signatory & Proprietor Mark
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Authorized Signatory Name</label>
                <input
                  type="text"
                  name="authorizedSignatoryName"
                  value={settings.authorizedSignatoryName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Signatory Title</label>
                <input
                  type="text"
                  name="authorizedSignatoryDesignation"
                  value={settings.authorizedSignatoryDesignation}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="pdfDoubleBorder"
                  name="pdfDoubleBorder"
                  checked={settings.pdfDoubleBorder}
                  onChange={handleChange}
                  className="rounded border-white/10 text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <label htmlFor="pdfDoubleBorder" className="text-xs text-neutral-300 cursor-pointer">
                  Enforce Metallic Gold Double Borders on all A4 PDF outputs (#D4AF37 / #E8D18A)
                </label>
              </div>
            </div>

            {/* Stamp Artwork Display */}
            <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/80 flex flex-col items-center justify-center space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                Official Proprietor Stamp & Signature Mark
              </span>
              <div className="w-56 h-28 relative bg-white rounded-lg p-2 flex items-center justify-center overflow-hidden">
                <Image
                  src="/official-stamp.jpg"
                  alt="Official Proprietor Mark"
                  width={220}
                  height={110}
                  className="object-contain"
                />
              </div>
              <span className="text-[10px] text-neutral-500">
                Loaded directly into PDF letterhead engine signature block.
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C22] text-black font-semibold text-sm shadow-lg hover:brightness-110 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Configuration..." : "Save Company Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}

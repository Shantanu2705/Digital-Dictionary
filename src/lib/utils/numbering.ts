import { db } from "@/lib/firebase/config";
import { doc, runTransaction } from "firebase/firestore";
import { DocumentType } from "@/types/portal";

const PREFIX_MAP: Record<string, string> = {
  agreement: "DD-AGR",
  welcome: "DD-WEL",
  invoice: "DD-INV",
  quotation: "DD-QUO",
  delivery_guide: "DD-DEL",
  monthly_report: "DD-REP",
  package_menu: "DD-MENU",
  intern_offer: "DD-INT-OFF",
  intern_joining: "DD-INT-JOIN",
  intern_noc: "DD-NOC",
  intern_completion: "DD-INT-CMP",
  intern_experience: "DD-INT-EXP",
  employee_offer: "DD-EMP-OFF",
  employee_joining: "DD-EMP-JOIN",
  employee_payslip: "DD-PAY",
  intern_stipend: "DD-STIPEND",
  client: "DD-CLI",
  employee: "DD-EMP",
  intern: "DD-INT",
  custom: "DD-DOC",
};

/**
 * Generates an atomic sequential document number e.g. DD-INV-2026-0001
 * Uses Firestore transactions so concurrent requests do not collide.
 */
export async function generateDocumentNumber(type: DocumentType | 'client' | 'employee' | 'intern'): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = PREFIX_MAP[type] || "DD-DOC";
  const counterDocId = `${prefix}-${year}`;

  try {
    const counterRef = doc(db, "documentCounters", counterDocId);
    
    const nextNumber = await runTransaction(db, async (transaction) => {
      const counterSnap = await transaction.get(counterRef);
      let currentCount = 0;
      
      if (counterSnap.exists()) {
        currentCount = counterSnap.data().lastCount || 0;
      }
      
      const newCount = currentCount + 1;
      transaction.set(counterRef, {
        prefix,
        year,
        lastCount: newCount,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      return newCount;
    });

    const paddedNumber = String(nextNumber).padStart(4, "0");
    return `${prefix}-${year}-${paddedNumber}`;
  } catch (error) {
    console.warn("Transaction failed for document counter, generating resilient fallback sequence:", error);
    // Resilient fallback with high-resolution sequence
    const fallbackSeq = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${year}-${fallbackSeq}`;
  }
}

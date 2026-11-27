import { collection, doc, getDocs, setDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { ServicePackage } from "@/types/portal";
import { INITIAL_PACKAGES } from "./initialCatalogue";

/**
 * Fetches live service packages from Firestore, intelligently merging with
 * the 2026 PDF catalogue defaults so any custom prices set by the COO
 * automatically propagate across the portal, onboarding, and PDF exports.
 */
export async function fetchLiveCatalogue(): Promise<{
  packages: ServicePackage[];
  isSyncedToDb: boolean;
}> {
  try {
    const snap = await getDocs(collection(db, "packages"));
    if (snap.empty) {
      return { packages: INITIAL_PACKAGES, isSyncedToDb: false };
    }

    const dbPackages: ServicePackage[] = [];
    snap.forEach((d) => {
      dbPackages.push({ id: d.id, ...(d.data() as Omit<ServicePackage, "id">) });
    });

    // Detect if Firestore still holds the legacy 11-package OPT-* schema only
    const hasUpdatedSchema = dbPackages.some(
      (p) => p.id.startsWith("pkg-web-") || p.id.startsWith("pkg-cmb-") || p.id.startsWith("pkg-custom-")
    );

    if (!hasUpdatedSchema) {
      return { packages: INITIAL_PACKAGES, isSyncedToDb: false };
    }

    // Merge updated 2026 PDF defaults with live DB overrides so new tiers or custom edits coexist
    const byId = new Map<string, ServicePackage>();
    for (const defPkg of INITIAL_PACKAGES) {
      byId.set(defPkg.id, defPkg);
    }
    for (const dbPkg of dbPackages) {
      // Skip superseded legacy OPT-* documents if migrated
      if (dbPkg.id.startsWith("pkg-opt-")) continue;
      const existing = byId.get(dbPkg.id);
      byId.set(dbPkg.id, existing ? { ...existing, ...dbPkg } : dbPkg);
    }

    const merged = Array.from(byId.values()).sort(
      (a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999)
    );

    return { packages: merged, isSyncedToDb: true };
  } catch (err) {
    console.warn("Catalogue Firestore fetch fallback to INITIAL_PACKAGES:", err);
    return { packages: INITIAL_PACKAGES, isSyncedToDb: false };
  }
}

/**
 * Saves or updates a single service package (including custom COO prices) in Firestore.
 */
export async function saveCataloguePackage(pkg: ServicePackage): Promise<void> {
  const ref = doc(db, "packages", pkg.id);
  await setDoc(
    ref,
    {
      ...pkg,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Seeds or resets the Firestore `packages` collection to the 22 official 2026 PDF packages.
 */
export async function syncOfficialCatalogueToFirestore(
  packagesToSync: ServicePackage[] = INITIAL_PACKAGES
): Promise<void> {
  const batch = writeBatch(db);
  const now = new Date().toISOString();

  // Remove old legacy OPT-* docs if present
  try {
    const existingSnap = await getDocs(collection(db, "packages"));
    existingSnap.forEach((d) => {
      if (d.id.startsWith("pkg-opt-")) {
        batch.delete(d.ref);
      }
    });
  } catch {}

  for (const pkg of packagesToSync) {
    const ref = doc(db, "packages", pkg.id);
    batch.set(ref, { ...pkg, updatedAt: now }, { merge: true });
  }

  await batch.commit();
}

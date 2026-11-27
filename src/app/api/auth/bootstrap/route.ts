import { NextResponse } from "next/server";
import { adminAuth, adminFirestoreGet, adminFirestoreSet, hasAdminCredentials } from "@/lib/firebase/admin";
import { INITIAL_PACKAGES, DEFAULT_COMPANY_SETTINGS } from "@/lib/data/initialCatalogue";

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "coo@digitaldictionary.in";
const EXPECTED_SECRET = process.env.BOOTSTRAP_SECRET_KEY || "dd-secure-bootstrap-key-2026";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const body = await request.json();
    const { password, secretKey } = body;

    // 1. Strict Secret Key Validation
    if (!secretKey || secretKey.trim() !== EXPECTED_SECRET) {
      return NextResponse.json(
        { error: "Forbidden: Invalid or missing bootstrap authorization key." },
        { status: 403 }
      );
    }

    if (!hasAdminCredentials()) {
      return NextResponse.json(
        { error: "Server configuration missing Firebase Admin credentials." },
        { status: 500 }
      );
    }

    // 2. Check if bootstrap is already permanently locked in system metadata
    try {
      const lockDoc = await adminFirestoreGet("system/bootstrapState");
      if (lockDoc.exists && lockDoc.data()?.isLocked === true) {
        return NextResponse.json(
          { error: "Access Denied: Initial system bootstrap has already been executed and permanently locked." },
          { status: 403 }
        );
      }
    } catch (e) {
      // Continue if collection does not exist yet
    }

    // 3. Password Strength Validation (Min 10 characters for super admin)
    if (!password || password.length < 10) {
      return NextResponse.json(
        { error: "Security Requirement: Master administrator password must be at least 10 characters." },
        { status: 400 }
      );
    }

    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(SUPER_ADMIN_EMAIL);
      await adminAuth.updateUser(userRecord.uid, { password });
      await adminAuth.setCustomUserClaims(userRecord.uid, { role: "super_admin" });
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        userRecord = await adminAuth.createUser({
          email: SUPER_ADMIN_EMAIL,
          password,
          displayName: "Chief Operating Officer",
          emailVerified: true,
        });
        await adminAuth.setCustomUserClaims(userRecord.uid, { role: "super_admin" });
      } else {
        throw err;
      }
    }

    // 4. Save/Update profile in Firestore
    const userProfile = {
      uid: userRecord.uid,
      email: SUPER_ADMIN_EMAIL,
      fullName: "Chief Operating Officer",
      designation: "Company Administrator / COO",
      department: "Executive Leadership",
      employmentType: "permanent",
      role: "super_admin",
      employeeId: "DD-ADM-001",
      accountStatus: "active",
      mustChangePassword: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await adminFirestoreSet(`users/${userRecord.uid}`, userProfile);

    // 5. Seed initial packages & company settings if absent
    for (const pkg of INITIAL_PACKAGES) {
      const existingPkg = await adminFirestoreGet(`packages/${pkg.id}`);
      if (!existingPkg.exists) {
        await adminFirestoreSet(`packages/${pkg.id}`, pkg);
      }
    }

    const existingSettings = await adminFirestoreGet("settings/company");
    if (!existingSettings.exists) {
      await adminFirestoreSet("settings/company", DEFAULT_COMPANY_SETTINGS);
    }

    // 6. Permanently lock bootstrap
    await adminFirestoreSet("system/bootstrapState", {
      isLocked: true,
      bootstrappedAt: new Date().toISOString(),
      bootstrappedByUid: userRecord.uid,
      bootstrappedIp: ip,
    });

    // 7. Log security event
    await adminFirestoreSet(`audit_logs/boot_${Date.now()}`, {
      userId: userRecord.uid,
      userEmail: SUPER_ADMIN_EMAIL,
      action: "MASTER_SYSTEM_BOOTSTRAP_LOCKED",
      entityType: "auth",
      details: `Executive Super Admin initialized and bootstrap service permanently locked from IP ${ip}.`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Master COO Administrator established and bootstrap state permanently locked.",
      uid: userRecord.uid,
    });
  } catch (error: any) {
    console.error("Bootstrap security exception:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error during bootstrap." },
      { status: 500 }
    );
  }
}

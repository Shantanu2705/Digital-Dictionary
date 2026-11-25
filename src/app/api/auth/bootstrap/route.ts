import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { INITIAL_PACKAGES, DEFAULT_COMPANY_SETTINGS } from "@/lib/data/initialCatalogue";

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "coo@digitaldictionary.in";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, secretKey } = body;

    // Verify secret key for security if configured
    const expectedSecret = process.env.BOOTSTRAP_SECRET_KEY || "dd-secure-bootstrap-key-2026";
    if (secretKey && secretKey !== expectedSecret) {
      return NextResponse.json({ error: "Invalid bootstrap authorization key." }, { status: 403 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(SUPER_ADMIN_EMAIL);
      // User exists, update password and custom claims
      await adminAuth.updateUser(userRecord.uid, {
        password: password,
      });
      await adminAuth.setCustomUserClaims(userRecord.uid, { role: "super_admin" });
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        // Create user
        userRecord = await adminAuth.createUser({
          email: SUPER_ADMIN_EMAIL,
          password: password,
          displayName: "Chief Operating Officer",
          emailVerified: true,
        });
        await adminAuth.setCustomUserClaims(userRecord.uid, { role: "super_admin" });
      } else {
        throw err;
      }
    }

    // Save/Update in Firestore
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

    await adminDb.collection("users").doc(userRecord.uid).set(userProfile, { merge: true });

    // Seed initial packages if collection is empty
    const packagesSnap = await adminDb.collection("packages").limit(1).get();
    if (packagesSnap.empty) {
      const batch = adminDb.batch();
      for (const pkg of INITIAL_PACKAGES) {
        const pkgRef = adminDb.collection("packages").doc(pkg.id);
        batch.set(pkgRef, pkg);
      }
      await batch.commit();
    }

    // Seed initial company settings if empty
    const settingsRef = adminDb.collection("companySettings").doc("default");
    const settingsSnap = await settingsRef.get();
    if (!settingsSnap.exists) {
      await settingsRef.set(DEFAULT_COMPANY_SETTINGS);
    }

    return NextResponse.json({
      success: true,
      message: "Super Admin account initialized successfully.",
      email: SUPER_ADMIN_EMAIL,
      uid: userRecord.uid,
    });
  } catch (error: any) {
    console.error("Bootstrap API error:", error);
    return NextResponse.json({ error: error.message || "Bootstrap failed." }, { status: 500 });
  }
}

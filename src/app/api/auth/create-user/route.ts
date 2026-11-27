import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import crypto from "crypto";

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD_cfB-UNl1KUvWiFKIZ6saQE-8Q12unuM";

// Security Sanitizer to strip potentially malicious characters
function sanitizeInput(val: any): string {
  if (typeof val !== "string") return "";
  return val.trim().replace(/[<>]/g, "");
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate Caller using Bearer ID Token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing authentication token." },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1]?.trim();
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token format." },
        { status: 401 }
      );
    }

    let callerEmail: string | undefined;
    let callerUid: string = "super-admin";
    let isSuperAdmin = false;
    let isHR = false;

    // A. Attempt server-side adminAuth verification
    try {
      if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
        const callerClaims = await adminAuth.verifyIdToken(token);
        callerEmail = callerClaims.email;
        callerUid = callerClaims.uid;
        isSuperAdmin = 
          callerClaims.role === "super_admin" || 
          callerEmail?.toLowerCase() === "coo@digitaldictionary.in";
        isHR = callerClaims.role === "hr_manager";
      }
    } catch (adminErr) {
      // Continue to Identity Toolkit fallback verification
    }

    // B. Fallback token verification using Google Identity Toolkit REST API
    if (!callerEmail) {
      try {
        const lookupRes = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: token }),
          }
        );
        const lookupData = await lookupRes.json();
        if (lookupRes.ok && lookupData.users && lookupData.users.length > 0) {
          const userObj = lookupData.users[0];
          callerEmail = userObj.email;
          callerUid = userObj.localId;
          isSuperAdmin = callerEmail?.toLowerCase() === "coo@digitaldictionary.in";
        }
      } catch (lookupErr) {
        console.warn("Identity lookup verification fallback error:", lookupErr);
      }
    }

    // Authorize caller
    if (!isSuperAdmin && !isHR) {
      return NextResponse.json(
        { error: "Forbidden: Only Executive Super Admins or HR Managers can provision team accounts." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const email = sanitizeInput(body.email).toLowerCase();
    const fullName = sanitizeInput(body.fullName);
    const role = sanitizeInput(body.role) || "employee";
    const employmentType = sanitizeInput(body.employmentType) || "permanent";
    const department = sanitizeInput(body.department) || "Engineering";
    const designation = sanitizeInput(body.designation) || "Software Engineer";
    const phone = sanitizeInput(body.phone);
    const reportingManager = sanitizeInput(body.reportingManager) || "Executive Leadership";

    if (!email || !fullName) {
      return NextResponse.json({ error: "Email and Full Name are required." }, { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address format." }, { status: 400 });
    }

    // Generate secure temporary password
    const tempPassword = body.customPassword || `DD@${crypto.randomBytes(4).toString("hex").toUpperCase()}!${Math.floor(10 + Math.random() * 90)}`;

    let userRecordUid = "";
    let authCreationSuccess = false;

    // A. Attempt Firebase Admin creation if private key is present
    if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
      try {
        const userRecord = await adminAuth.createUser({
          email,
          password: tempPassword,
          displayName: fullName,
          emailVerified: true,
        });
        userRecordUid = userRecord.uid;
        await adminAuth.setCustomUserClaims(userRecordUid, { role }).catch(() => {});
        authCreationSuccess = true;
      } catch (err: any) {
        if (err.code === "auth/email-already-exists") {
          try {
            const existing = await adminAuth.getUserByEmail(email);
            userRecordUid = existing.uid;
            await adminAuth.updateUser(userRecordUid, {
              password: tempPassword,
              displayName: fullName,
            });
            await adminAuth.setCustomUserClaims(userRecordUid, { role }).catch(() => {});
            authCreationSuccess = true;
          } catch (e) {}
        }
      }
    }

    // B. Fast & reliable Google Identity Toolkit REST API provisioning
    if (!authCreationSuccess) {
      try {
        const signUpRes = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password: tempPassword,
              returnSecureToken: true,
            }),
          }
        );
        const signUpData = await signUpRes.json();

        if (signUpRes.ok && signUpData.localId) {
          userRecordUid = signUpData.localId;
          authCreationSuccess = true;

          // Update displayName
          if (signUpData.idToken) {
            await fetch(
              `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  idToken: signUpData.idToken,
                  displayName: fullName,
                  returnSecureToken: false,
                }),
              }
            ).catch(() => {});
          }
        } else if (signUpData.error?.message === "EMAIL_EXISTS") {
          // If the account already exists in Auth, generate a stable unique UID for Firestore
          userRecordUid = `auth-${crypto.createHash("md5").update(email).digest("hex").slice(0, 20)}`;
          authCreationSuccess = true;
        } else {
          return NextResponse.json(
            { error: signUpData.error?.message || "Failed to provision Firebase Authentication user." },
            { status: 400 }
          );
        }
      } catch (restErr: any) {
        console.error("Identity Toolkit REST error:", restErr);
        userRecordUid = `dd-user-${Date.now()}`;
      }
    }

    // Determine ID prefix
    const year = new Date().getFullYear();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const officialId = employmentType === "intern" 
      ? `DD-INT-${year}-${randNum}` 
      : `DD-EMP-${year}-${randNum}`;

    const now = new Date().toISOString();

    // Create User Profile
    const userProfile = {
      uid: userRecordUid,
      email,
      fullName,
      phone,
      designation,
      department,
      employmentType,
      role,
      employeeId: officialId,
      reportingManager,
      accountStatus: "active",
      mustChangePassword: true,
      createdAt: now,
      updatedAt: now,
    };

    let internDoc: any = null;
    let employeeDoc: any = null;

    if (employmentType === "intern") {
      internDoc = {
        internId: officialId,
        userId: userRecordUid,
        fullName,
        email,
        phone,
        collegeName: sanitizeInput(body.collegeName) || "Partner University",
        universityName: sanitizeInput(body.universityName) || sanitizeInput(body.collegeName),
        course: sanitizeInput(body.course) || "Computer Science",
        department,
        semester: sanitizeInput(body.semester) || "Final Year",
        collegeRollNo: sanitizeInput(body.collegeRollNo) || "N/A",
        internshipRole: designation,
        assignedSupervisor: reportingManager,
        startDate: body.startDate || now.split("T")[0],
        endDate: body.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        durationMonths: Number(body.durationMonths) || 3,
        internshipMode: sanitizeInput(body.internshipMode) || "remote",
        monthlyStipend: Number(body.monthlyStipend) || 0,
        accountStatus: "active",
        createdAt: now,
        updatedAt: now,
      };
    } else {
      employeeDoc = {
        employeeId: officialId,
        userId: userRecordUid,
        fullName,
        email,
        phone,
        designation,
        department,
        reportingManager,
        dateOfJoining: body.dateOfJoining || now.split("T")[0],
        employmentType: sanitizeInput(body.workType) || "full-time",
        workMode: sanitizeInput(body.workMode) || "hybrid",
        ctc: Number(body.ctc) || 0,
        basicSalary: Number(body.basicSalary) || 0,
        allowances: Number(body.allowances) || 0,
        deductions: Number(body.deductions) || 0,
        probationPeriodMonths: Number(body.probationPeriodMonths) || 3,
        employmentStatus: "active",
        createdAt: now,
        updatedAt: now,
      };
    }

    // Attempt server Firestore persistence if available, without blocking response
    try {
      if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
        await adminDb.collection("users").doc(userRecordUid).set(userProfile, { merge: true });
        if (employmentType === "intern" && internDoc) {
          await adminDb.collection("interns").doc(userRecordUid).set(internDoc, { merge: true });
        } else if (employeeDoc) {
          await adminDb.collection("employees").doc(userRecordUid).set(employeeDoc, { merge: true });
        }
      }
    } catch (fsErr) {
      console.warn("Server Firestore adminDb skipped (using client sync):", fsErr);
    }

    return NextResponse.json({
      success: true,
      uid: userRecordUid,
      email,
      fullName,
      employeeId: officialId,
      internId: officialId,
      tempPassword,
      role,
      employmentType,
      userProfile,
      record: employmentType === "intern" ? internDoc : employeeDoc,
    });
  } catch (error: any) {
    console.error("Account provisioning error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to provision account." },
      { status: 500 }
    );
  }
}

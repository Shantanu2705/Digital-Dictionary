import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import crypto from "crypto";

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

    let callerClaims;
    try {
      callerClaims = await adminAuth.verifyIdToken(token);
    } catch (err: any) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication token is invalid or expired." },
        { status: 401 }
      );
    }

    // 2. Authorize Caller (Must be Super Admin or HR Manager)
    const isSuperAdmin = 
      callerClaims.role === "super_admin" || 
      callerClaims.email?.toLowerCase() === "coo@digitaldictionary.in";
    const isHR = callerClaims.role === "hr_manager";

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

    // Non-super-admins cannot elevate another user to super_admin
    if (role === "super_admin" && !isSuperAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Only the Master Super Admin can delegate super_admin authority." },
        { status: 403 }
      );
    }

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

    let userRecord;
    try {
      userRecord = await adminAuth.createUser({
        email,
        password: tempPassword,
        displayName: fullName,
        emailVerified: true,
      });
      await adminAuth.setCustomUserClaims(userRecord.uid, { role });
    } catch (err: any) {
      if (err.code === "auth/email-already-exists") {
        userRecord = await adminAuth.getUserByEmail(email);
        await adminAuth.updateUser(userRecord.uid, {
          password: tempPassword,
          displayName: fullName,
        });
        await adminAuth.setCustomUserClaims(userRecord.uid, { role });
      } else {
        throw err;
      }
    }

    // Determine ID prefix
    const year = new Date().getFullYear();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const officialId = employmentType === "intern" 
      ? `DD-INT-${year}-${randNum}` 
      : `DD-EMP-${year}-${randNum}`;

    // Create User Profile in Firestore
    const userProfile = {
      uid: userRecord.uid,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await adminDb.collection("users").doc(userRecord.uid).set(userProfile, { merge: true });

    // Store in respective sub-collection (employees or interns)
    if (employmentType === "intern") {
      const internDoc = {
        internId: officialId,
        userId: userRecord.uid,
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
        startDate: body.startDate || new Date().toISOString().split("T")[0],
        endDate: body.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        durationMonths: Number(body.durationMonths) || 3,
        internshipMode: sanitizeInput(body.internshipMode) || "remote",
        monthlyStipend: Number(body.monthlyStipend) || 0,
        accountStatus: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await adminDb.collection("interns").doc(userRecord.uid).set(internDoc, { merge: true });
    } else {
      const employeeDoc = {
        employeeId: officialId,
        userId: userRecord.uid,
        fullName,
        email,
        phone,
        designation,
        department,
        reportingManager,
        dateOfJoining: body.dateOfJoining || new Date().toISOString().split("T")[0],
        employmentType: sanitizeInput(body.workType) || "full-time",
        workMode: sanitizeInput(body.workMode) || "hybrid",
        ctc: Number(body.ctc) || 0,
        basicSalary: Number(body.basicSalary) || 0,
        allowances: Number(body.allowances) || 0,
        deductions: Number(body.deductions) || 0,
        probationPeriodMonths: Number(body.probationPeriodMonths) || 3,
        employmentStatus: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await adminDb.collection("employees").doc(userRecord.uid).set(employeeDoc, { merge: true });
    }

    // Security audit log
    await adminDb.collection("audit_logs").add({
      userId: callerClaims.uid,
      userEmail: callerClaims.email || "system",
      action: "ACCOUNT_PROVISIONED",
      entityType: employmentType === "intern" ? "intern" : "employee",
      entityId: userRecord.uid,
      details: `Account created for ${fullName} (${email}) with role ${role} and ID ${officialId}.`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      uid: userRecord.uid,
      email,
      fullName,
      employeeId: officialId,
      tempPassword,
      role,
      employmentType,
    });
  } catch (error: any) {
    console.error("Account provisioning security error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to provision account." },
      { status: 500 }
    );
  }
}

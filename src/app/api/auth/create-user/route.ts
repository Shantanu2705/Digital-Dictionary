import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      fullName,
      role = "employee",
      employmentType = "permanent",
      department,
      designation,
      employeeId,
      phone,
      reportingManager,
      customPassword,
      autoGeneratePassword = true,
      collegeName,
      universityName,
      course,
      semester,
      collegeRollNo,
      internshipRole,
      startDate,
      endDate,
      durationMonths,
      monthlyStipend,
      ctc,
      basicSalary,
      allowances,
      deductions,
    } = body;

    if (!email || !fullName) {
      return NextResponse.json({ error: "Email and Full Name are required." }, { status: 400 });
    }

    // Generate secure temporary password if not provided
    const tempPassword = customPassword || (autoGeneratePassword 
      ? `DD@${crypto.randomBytes(4).toString("hex").toUpperCase()}!${Math.floor(10 + Math.random() * 90)}`
      : "DigitalDict@2026");

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

    const now = new Date().toISOString();
    const finalEmployeeId = employeeId || (employmentType === "intern" 
      ? `DD-INT-${Math.floor(100 + Math.random() * 900)}` 
      : `DD-EMP-${Math.floor(100 + Math.random() * 900)}`);

    // 1. Create or update user profile in `users`
    const userProfile = {
      uid: userRecord.uid,
      email,
      fullName,
      phone: phone || "",
      designation: designation || (employmentType === "intern" ? "Intern" : "Associate"),
      department: department || "Engineering",
      employmentType,
      role,
      employeeId: finalEmployeeId,
      reportingManager: reportingManager || "COO",
      accountStatus: "active",
      mustChangePassword: true,
      createdAt: now,
      updatedAt: now,
    };
    await adminDb.collection("users").doc(userRecord.uid).set(userProfile, { merge: true });

    // 2. If intern, save to `interns` collection
    if (employmentType === "intern") {
      const internDoc = {
        internId: finalEmployeeId,
        userId: userRecord.uid,
        fullName,
        email,
        phone: phone || "",
        collegeName: collegeName || "Institution",
        universityName: universityName || "",
        course: course || "",
        department: department || "Engineering",
        semester: semester || "",
        collegeRollNo: collegeRollNo || "",
        internshipRole: internshipRole || designation || "Web Developer Intern",
        assignedSupervisor: reportingManager || "Lead Architect",
        startDate: startDate || now.split("T")[0],
        endDate: endDate || "",
        durationMonths: durationMonths ? Number(durationMonths) : 3,
        internshipMode: "hybrid",
        monthlyStipend: monthlyStipend ? Number(monthlyStipend) : 0,
        accountStatus: "active",
        createdAt: now,
        updatedAt: now,
      };
      await adminDb.collection("interns").doc(userRecord.uid).set(internDoc, { merge: true });
    } else {
      // 3. If permanent employee, save to `employees` collection
      const empDoc = {
        employeeId: finalEmployeeId,
        userId: userRecord.uid,
        fullName,
        email,
        phone: phone || "",
        designation: designation || "Software Engineer",
        department: department || "Engineering",
        reportingManager: reportingManager || "COO",
        dateOfJoining: startDate || now.split("T")[0],
        employmentType: "full-time",
        workMode: "hybrid",
        ctc: ctc ? Number(ctc) : 0,
        basicSalary: basicSalary ? Number(basicSalary) : 0,
        allowances: allowances ? Number(allowances) : 0,
        deductions: deductions ? Number(deductions) : 0,
        employmentStatus: "active",
        createdAt: now,
        updatedAt: now,
      };
      await adminDb.collection("employees").doc(userRecord.uid).set(empDoc, { merge: true });
    }

    // 4. Audit Log
    await adminDb.collection("activityLogs").add({
      userId: "admin",
      userEmail: "admin",
      action: "CREATE_EMPLOYEE_ACCOUNT",
      entityType: "employee",
      entityId: userRecord.uid,
      details: `Created ${employmentType} account for ${fullName} (${email})`,
      timestamp: now,
    });

    return NextResponse.json({
      success: true,
      uid: userRecord.uid,
      email,
      fullName,
      employeeId: finalEmployeeId,
      tempPassword,
      message: "Account created successfully.",
    });
  } catch (error: any) {
    console.error("Create User API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create user account." }, { status: 500 });
  }
}

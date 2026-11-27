"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  updatePassword
} from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { UserProfile, UserRole } from "@/types/portal";
import { logActivity } from "@/lib/utils/audit";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserPassword: (newPass: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (newPass: string) => Promise<{ success: boolean; error?: string }>;
  isSuperAdmin: boolean;
  isHRManager: boolean;
  isFinanceManager: boolean;
  isSalesManager: boolean;
  isProjectManager: boolean;
  isEmployee: boolean;
  isIntern: boolean;
  canAccessClient: (clientId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPER_ADMIN_EMAIL = "coo@digitaldictionary.in";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data() as UserProfile;
            setProfile(data);
          } else {
            const userEmail = currentUser.email?.toLowerCase().trim() || "";
            const isInitialAdmin = userEmail === SUPER_ADMIN_EMAIL.toLowerCase();

            let resolvedProfile: UserProfile | null = null;

            // 1. Check if user document exists under another key with matching email
            try {
              const usersQ = query(collection(db, "users"), where("email", "==", currentUser.email));
              const usersSnap = await getDocs(usersQ);
              if (!usersSnap.empty) {
                const uDoc = usersSnap.docs[0].data() as UserProfile;
                resolvedProfile = { ...uDoc, uid: currentUser.uid };
              }
            } catch (e) {
              console.warn("Could not query users collection by email:", e);
            }

            // 2. If not found, check interns collection by email
            if (!resolvedProfile) {
              try {
                const internsQ = query(collection(db, "interns"), where("email", "==", currentUser.email));
                const internsSnap = await getDocs(internsQ);
                if (!internsSnap.empty) {
                  const intData = internsSnap.docs[0].data();
                  resolvedProfile = {
                    uid: currentUser.uid,
                    email: currentUser.email || "",
                    fullName: intData.fullName || "Intern",
                    designation: intData.internshipRole || "Intern",
                    department: intData.department || "Engineering",
                    employmentType: "intern",
                    role: "intern",
                    employeeId: intData.internId || "DD-INT",
                    accountStatus: intData.accountStatus || "active",
                    tempPassword: intData.tempPassword || "",
                    createdAt: intData.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  };
                }
              } catch (e) {
                console.warn("Could not query interns collection by email:", e);
              }
            }

            // 3. If not found, check employees collection by email
            if (!resolvedProfile) {
              try {
                const empQ = query(collection(db, "employees"), where("email", "==", currentUser.email));
                const empSnap = await getDocs(empQ);
                if (!empSnap.empty) {
                  const empData = empSnap.docs[0].data();
                  resolvedProfile = {
                    uid: currentUser.uid,
                    email: currentUser.email || "",
                    fullName: empData.fullName || "Employee",
                    designation: empData.designation || "Staff Member",
                    department: empData.department || "Engineering",
                    employmentType: "permanent",
                    role: (empData.role as UserRole) || "employee",
                    employeeId: empData.employeeId || "DD-EMP",
                    accountStatus: empData.accountStatus || "active",
                    tempPassword: empData.tempPassword || "",
                    createdAt: empData.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  };
                }
              } catch (e) {
                console.warn("Could not query employees collection by email:", e);
              }
            }

            // 4. Fallback profile
            if (!resolvedProfile) {
              resolvedProfile = {
                uid: currentUser.uid,
                email: currentUser.email || "",
                fullName: isInitialAdmin ? "Chief Operating Officer" : (currentUser.displayName || "Staff Member"),
                designation: isInitialAdmin ? "Company Administrator / COO" : "Team Member",
                department: isInitialAdmin ? "Executive Leadership" : "Engineering",
                employmentType: isInitialAdmin ? "permanent" : "employee" as any,
                role: isInitialAdmin ? "super_admin" : "employee",
                employeeId: isInitialAdmin ? "DD-ADM-001" : "DD-EMP-001",
                accountStatus: "active",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
            }

            try {
              await setDoc(userDocRef, resolvedProfile, { merge: true });
            } catch (err) {
              console.warn("Could not save initial profile in Firestore (check rules):", err);
            }
            setProfile(resolvedProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          if (currentUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
            setProfile({
              uid: currentUser.uid,
              email: currentUser.email,
              fullName: "Chief Operating Officer",
              designation: "Company Administrator / COO",
              department: "Executive Leadership",
              employmentType: "permanent",
              role: "super_admin",
              employeeId: "DD-ADM-001",
              accountStatus: "active",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      await logActivity({
        userId: userCredential.user.uid,
        userEmail: email,
        action: "USER_LOGIN",
        entityType: "auth",
        entityId: userCredential.user.uid,
        details: `Successful login for ${email}`,
      });
      return { success: true };
    } catch (err: any) {
      console.error("Firebase Login Error:", err);
      let message = "Invalid email or password.";
      if (err.code === "auth/user-not-found") message = "No account found with this email.";
      if (err.code === "auth/wrong-password") message = "Incorrect password.";
      if (err.code === "auth/too-many-requests") message = "Account temporarily locked due to failed attempts. Try again later.";
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    if (user) {
      await logActivity({
        userId: user.uid,
        userEmail: user.email || "",
        action: "USER_LOGOUT",
        entityType: "auth",
        entityId: user.uid,
        details: `User signed out`,
      });
    }
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const updateUserPassword = async (newPass: string) => {
    if (!auth.currentUser) return { success: false, error: "Not authenticated" };
    try {
      await updatePassword(auth.currentUser, newPass);
      if (profile) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userDocRef, { mustChangePassword: false, updatedAt: new Date().toISOString() }, { merge: true });
        setProfile(prev => prev ? { ...prev, mustChangePassword: false } : null);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update password" };
    }
  };

  const role = profile?.role || (user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() ? "super_admin" : null);

  const isSuperAdmin = role === "super_admin" || user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
  const isHRManager = isSuperAdmin || role === "hr_manager";
  const isFinanceManager = isSuperAdmin || role === "finance_manager";
  const isSalesManager = isSuperAdmin || role === "sales_manager";
  const isProjectManager = isSuperAdmin || role === "project_manager";
  const isEmployee = role === "employee" || isSuperAdmin;
  const isIntern = role === "intern" || profile?.employmentType === "intern";

  const canAccessClient = (clientId: string) => {
    if (isSuperAdmin || isFinanceManager) return true;
    if (!profile?.assignedClientIds) return false;
    return profile.assignedClientIds.includes(clientId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        login,
        logout,
        updateUserPassword,
        changePassword: updateUserPassword,
        isSuperAdmin,
        isHRManager,
        isFinanceManager,
        isSalesManager,
        isProjectManager,
        isEmployee,
        isIntern,
        canAccessClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

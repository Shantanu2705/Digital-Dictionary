import { getApps, initializeApp, cert, getApp, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Ensure single instance across serverless invocations with safe fallback
function getFirebaseAdminApp(): App | null {
  try {
    const apps = getApps();
    if (apps.length > 0) {
      return apps[0]!;
    }

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "digital-dictionary-8a9d6";
    const rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

    // Check if valid private key and client email exist
    if (rawKey && clientEmail) {
      try {
        let privateKey = rawKey.replace(/\\n/g, "\n").trim();
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
          privateKey = privateKey.slice(1, -1).replace(/\\n/g, "\n").trim();
        }
        return initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "digital-dictionary-8a9d6.firebasestorage.app",
        });
      } catch (certError) {
        console.warn("Firebase Admin cert failed, continuing in fallback mode:", certError);
      }
    }

    // Fallback to project-id only initialization
    return initializeApp({
      projectId,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "digital-dictionary-8a9d6.firebasestorage.app",
    });
  } catch (error) {
    console.warn("Firebase Admin initializeApp failed safely:", error);
    try {
      return getApp();
    } catch {
      return null;
    }
  }
}

let adminApp: App | null = null;
let adminAuth: any = null;
let adminDb: any = null;
let adminStorage: any = null;

try {
  adminApp = getFirebaseAdminApp();
  if (adminApp) {
    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
    adminStorage = getStorage(adminApp);
  }
} catch (e) {
  console.warn("Firebase Admin service init notice:", e);
}

export { adminApp, adminAuth, adminDb, adminStorage };

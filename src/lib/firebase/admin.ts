import { getApps, initializeApp, cert, getApp, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Ensure single instance across serverless invocations
function getFirebaseAdminApp(): App {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0]!;
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "digital-dictionary-8a9d6";

  // Check if private key and client email exist in env
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

  if (privateKey && clientEmail) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "digital-dictionary-8a9d6.firebasestorage.app",
    });
  }

  // Fallback to project-id only initialization
  try {
    return initializeApp({
      projectId,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "digital-dictionary-8a9d6.firebasestorage.app",
    });
  } catch (error) {
    console.warn("Firebase Admin initialized in fallback mode:", error);
    return getApp();
  }
}

const adminApp = getFirebaseAdminApp();
const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);
const adminStorage = getStorage(adminApp);

export { adminApp, adminAuth, adminDb, adminStorage };

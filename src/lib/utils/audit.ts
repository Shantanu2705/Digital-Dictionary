import { db } from "@/lib/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ActivityLog } from "@/types/portal";

export async function logActivity({
  userId,
  userEmail,
  action,
  entityType,
  entityId,
  details,
}: Omit<ActivityLog, "timestamp">): Promise<void> {
  try {
    const logData: ActivityLog = {
      userId: userId || "system",
      userEmail: userEmail || "system@digitaldictionary.in",
      action,
      entityType,
      entityId: entityId || "",
      details,
      timestamp: new Date().toISOString(),
    };

    await addDoc(collection(db, "activityLogs"), logData);
  } catch (error) {
    console.warn("Failed to write to audit log (likely offline or rules restricted):", error);
  }
}

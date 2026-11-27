import crypto from "crypto";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "digital-dictionary-8a9d6";

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

let tokenCache: CachedToken | null = null;

function parsePrivateKey(rawKey?: string): string | null {
  if (!rawKey) return null;
  let key = rawKey.replace(/\\n/g, "\n").trim();
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1).replace(/\\n/g, "\n").trim();
  }
  return key.includes("BEGIN PRIVATE KEY") ? key : null;
}

export function hasAdminCredentials(): boolean {
  return Boolean(parsePrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY) && process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
}

export async function getGoogleAccessToken(): Promise<string | null> {
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const privateKey = parsePrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY);
  if (!clientEmail || !privateKey) return null;

  const nowSec = Math.floor(Date.now() / 1000);
  if (tokenCache && tokenCache.expiresAt > nowSec + 60) {
    return tokenCache.accessToken;
  }

  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: clientEmail,
      sub: clientEmail,
      aud: "https://oauth2.googleapis.com/token",
      iat: nowSec,
      exp: nowSec + 3600,
      scope:
        "https://www.googleapis.com/auth/identitytoolkit https://www.googleapis.com/auth/datastore",
    })
  ).toString("base64url");

  const unsignedJwt = `${header}.${payload}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsignedJwt);
  const signature = signer.sign(privateKey, "base64url");
  const assertion = `${unsignedJwt}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }).toString(),
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "Failed to obtain Google OAuth2 access token.");
  }

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: nowSec + Number(data.expires_in || 3600),
  };
  return tokenCache.accessToken;
}

async function callIdentityToolkitAdmin(endpoint: string, body: Record<string, any>) {
  const accessToken = await getGoogleAccessToken();
  if (!accessToken) {
    throw new Error("Firebase Admin service account credentials are not configured.");
  }
  const url = `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/${endpoint}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    const errMsg = data?.error?.message || `Identity Toolkit Admin error (${res.status})`;
    const err: any = new Error(errMsg);
    if (errMsg === "USER_NOT_FOUND" || errMsg === "EMAIL_NOT_FOUND") {
      err.code = "auth/user-not-found";
    }
    throw err;
  }
  return data;
}

/**
 * Lightweight, zero-dependency Admin Auth client compatible with all serverless runtimes.
 */
export const adminAuth = {
  async getUserByEmail(email: string) {
    const data = await callIdentityToolkitAdmin("accounts:lookup", { email: [email] });
    const user = data?.users?.[0];
    if (!user?.localId) {
      const err: any = new Error("User not found");
      err.code = "auth/user-not-found";
      throw err;
    }
    return {
      uid: user.localId as string,
      email: user.email as string,
      displayName: user.displayName as string | undefined,
    };
  },

  async createUser(params: { email: string; password: string; displayName?: string; emailVerified?: boolean }) {
    const data = await callIdentityToolkitAdmin("accounts:signUp", {
      email: params.email,
      password: params.password,
      displayName: params.displayName,
      emailVerified: Boolean(params.emailVerified),
    });
    return { uid: data.localId as string };
  },

  async updateUser(uid: string, params: { password?: string; displayName?: string }) {
    await callIdentityToolkitAdmin("accounts:update", {
      localId: uid,
      ...params,
    });
  },

  async setCustomUserClaims(uid: string, claims: Record<string, any>) {
    await callIdentityToolkitAdmin("accounts:update", {
      localId: uid,
      customAttributes: JSON.stringify(claims),
    });
  },

  async deleteUser(uid: string) {
    await callIdentityToolkitAdmin("accounts:delete", {
      localId: uid,
    });
  },
};

function toFirestoreValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  if (typeof val === "string") return { stringValue: val };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
  if (typeof val === "object") {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function fromFirestoreFields(fields: Record<string, any> = {}): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [k, v] of Object.entries(fields)) {
    result[k] = fromFirestoreValue(v);
  }
  return result;
}

function fromFirestoreValue(v: any): any {
  if (!v) return null;
  if ("nullValue" in v) return null;
  if ("booleanValue" in v) return v.booleanValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return Number(v.doubleValue);
  if ("stringValue" in v) return v.stringValue;
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(fromFirestoreValue);
  if ("mapValue" in v) return fromFirestoreFields(v.mapValue.fields);
  return null;
}

/**
 * Lightweight Firestore REST helper compatible with all serverless runtimes.
 */
export async function adminFirestoreGet(path: string): Promise<{ exists: boolean; data: () => any }> {
  const token = await getGoogleAccessToken();
  if (!token) throw new Error("Admin credentials not configured.");
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${path}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 404) {
    return { exists: false, data: () => null };
  }
  const doc = await res.json();
  if (!res.ok) throw new Error(doc?.error?.message || "Firestore REST get error");
  const parsed = fromFirestoreFields(doc.fields);
  return { exists: true, data: () => parsed };
}

export async function adminFirestoreSet(path: string, data: Record<string, any>): Promise<void> {
  const token = await getGoogleAccessToken();
  if (!token) throw new Error("Admin credentials not configured.");
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${path}`;
  const fields: Record<string, any> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) fields[k] = toFirestoreValue(v);
  }
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "Firestore REST set error");
  }
}

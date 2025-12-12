import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { env } from "@/env";

type SessionPayload = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  tokenType?: string;
  scope?: string;
  idToken?: string;
};

// Multi-account session type
type MultiAccountSession = {
  accountId: string;
  accountName: string;
  accountHandle: string;
  avatarUrl?: string;
  payload: SessionPayload;
  color: string;
};

const encoder = new TextEncoder();
const secretKey = encoder.encode(env.SESSION_SECRET);

export async function setSession(payload: SessionPayload) {
  const jwt = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey);

  const cookieStore = await cookies();
  cookieStore.set(env.SESSION_COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(env.SESSION_COOKIE_NAME);
}

// Multi-account functions
export async function addAccountToMultiSession(account: Omit<MultiAccountSession, 'payload'>, payload: SessionPayload) {
  const cookieStore = await cookies();
  const existingAccounts = await getMultiAccounts();
  
  // Check if account already exists
  const accountExists = existingAccounts.some(acc => acc.accountId === account.accountId);
  
  if (!accountExists) {
    const updatedAccounts = [...existingAccounts, { ...account, payload }];
    const accountsJson = JSON.stringify(updatedAccounts);
    
    cookieStore.set('fanvue_multi_accounts', accountsJson, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }
}

export async function getMultiAccounts(): Promise<MultiAccountSession[]> {
  const cookieStore = await cookies();
  const accountsJson = cookieStore.get('fanvue_multi_accounts')?.value;
  
  if (!accountsJson) return [];
  
  try {
    return JSON.parse(accountsJson) as MultiAccountSession[];
  } catch {
    return [];
  }
}

export async function removeAccountFromMultiSession(accountId: string) {
  const cookieStore = await cookies();
  const existingAccounts = await getMultiAccounts();
  
  const updatedAccounts = existingAccounts.filter(account => account.accountId !== accountId);
  const accountsJson = JSON.stringify(updatedAccounts);
  
  cookieStore.set('fanvue_multi_accounts', accountsJson, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function setActiveAccount(accountId: string) {
  const accounts = await getMultiAccounts();
  const account = accounts.find(acc => acc.accountId === accountId);
  
  if (account) {
    await setSession(account.payload);
    return account;
  }
  
  return null;
}
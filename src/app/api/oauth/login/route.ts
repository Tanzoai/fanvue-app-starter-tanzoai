import { NextResponse } from "next/server";
import { generatePkce, getAuthorizeUrl } from "@/lib/oauth";
import { cookies } from "next/headers";
import { env } from "@/env";

export async function GET(request: Request) {
  const { verifier, challenge } = generatePkce();
  const state = crypto.randomUUID();

  const url = new URL(request.url);
  const redirectUri = env.OAUTH_REDIRECT_URI;

  const authUrl = getAuthorizeUrl({
    state,
    codeChallenge: challenge,
    redirectUri,
  });

  const cookieStore = await cookies();
  // Use SameSite=None for production so third-party OAuth redirects preserve cookies.
  // Keep secure enabled in production (required for SameSite=None).
  const isProd = process.env.NODE_ENV === "production";
  cookieStore.set("oauth_state", state, { httpOnly: true, path: "/", sameSite: isProd ? "none" : "lax", secure: isProd, maxAge: 600 });
  cookieStore.set("oauth_verifier", verifier, { httpOnly: true, path: "/", sameSite: isProd ? "none" : "lax", secure: isProd, maxAge: 600 });

  const res = NextResponse.redirect(authUrl);
  res.headers.set("Content-Security-Policy", "frame-ancestors 'self'");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  return res;
}

import { env } from "@/env";
import { getSession, setSession } from "@/lib/session";
import { refreshAccessToken } from "@/lib/oauth";

/**
 * Make an authenticated request to the Fanvue API
 * Automatically handles token refresh if needed
 */
export async function fanvueApiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  let session = await getSession();
  if (!session) return null;

  // Check if token needs refresh (30 seconds before expiry)
  if (Date.now() >= session.expiresAt - 30_000 && session.refreshToken) {
    try {
      const refreshed = await refreshAccessToken(session.refreshToken);
      session = {
        ...session,
        accessToken: refreshed.access_token,
        refreshToken: refreshed.refresh_token ?? session.refreshToken,
        tokenType: refreshed.token_type,
        scope: refreshed.scope ?? session.scope,
        idToken: refreshed.id_token ?? session.idToken,
        expiresAt: Date.now() + refreshed.expires_in * 1000,
      };
      await setSession(session);
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  }

  try {
    const res = await fetch(`${env.API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
      cache: options?.cache ?? "no-store",
    });

    if (!res.ok) {
      console.error(`API request failed: ${res.status} ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("API request error:", error);
    return null;
  }
}

/**
 * Get current user profile with all details
 */
export async function getFanvueUser() {
  return fanvueApiRequest<{
    id: string;
    handle: string;
    displayName?: string;
    avatarUrl?: string;
    isCreator: boolean;
    fanCounts?: {
      followersCount?: number;
      followingCount?: number;
      subscribersCount?: number;
    };
    contentCounts?: {
      imageCount?: number;
      videoCount?: number;
      postCount?: number;
    };
  }>("/users/me");
}

/**
 * Get user's stats and analytics
 * NOTE: Currently returns null because /users/me/stats endpoint returns 404
 * TODO: Check Fanvue API documentation for correct stats endpoint
 */
export async function getFanvueStats() {
  // This endpoint doesn't exist in Fanvue API - returns 404
  // Return null to prevent error logs
  // The dashboard will use fallback test data for charts
  console.log('getFanvueStats: Endpoint /users/me/stats not available (404), returning null');
  return null;

  // Uncomment and update with correct endpoint when available:
  // return fanvueApiRequest<{
  //   revenue?: {
  //     total?: number;
  //     subscriptions?: number;
  //     tips?: number;
  //     messages?: number;
  //   };
  //   engagement?: {
  //     messagesSent?: number;
  //     messagesReceived?: number;
  //     responseRate?: number;
  //   };
  // }>("/correct/stats/endpoint");
}

/**
 * Get all conversations/chats
 */
export async function getFanvueConversations() {
  return fanvueApiRequest<{
    data: Array<{
      userUuid: string;
      username: string;
      displayName?: string;
      avatarUrl?: string;
      lastMessage?: {
        content: string;
        createdAt: string;
        isFromMe: boolean;
      };
      unreadCount?: number;
      isOnline?: boolean;
    }>;
  }>("/chats");
}

/**
 * Get messages for a specific conversation
 */
export async function getFanvueMessages(userUuid: string) {
  return fanvueApiRequest<{
    data: Array<{
      id: string;
      content: string;
      createdAt: string;
      isFromMe: boolean;
      senderUuid: string;
      senderUsername?: string;
      status?: 'sent' | 'delivered' | 'read';
    }>;
  }>(`/chats/${userUuid}/messages`);
}

/**
 * Send a message to a user
 */
export async function sendFanvueMessage(
  userUuid: string,
  content: string
) {
  return fanvueApiRequest<{
    id: string;
    content: string;
    createdAt: string;
    isFromMe: boolean;
  }>(`/chats/${userUuid}/message`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(userUuid: string) {
  return fanvueApiRequest(`/chats/${userUuid}/mark-read`, {
    method: 'POST',
  });
}

/**
 * Get access token from session
 */
export async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.accessToken ?? null;
}

/**
 * Check if session is valid
 */
export async function isSessionValid(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  // Check if token is expired
  if (Date.now() >= session.expiresAt) {
    return false;
  }

  return true;
}

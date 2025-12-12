'use client';

/**
 * Client-side Fanvue API utilities
 * Use these functions in client components to make API calls
 */

/**
 * Make an API call from a client component
 * The API route should handle authentication on the server side
 */
export async function clientApiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data: T | null; error?: string }> {
  try {
    const res = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { 
        data: null, 
        error: `Request failed: ${res.status} ${errorText}` 
      };
    }

    const data = await res.json();
    return { data };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Example: Fetch user data from client component
 */
export async function fetchUserData() {
  return clientApiRequest('/api/fanvue/user', {
    method: 'GET',
  });
}

/**
 * Example: Send a message
 */
export async function sendMessage(recipientId: string, content: string) {
  return clientApiRequest('/api/fanvue/messages', {
    method: 'POST',
    body: JSON.stringify({ recipientId, content }),
  });
}

/**
 * Webhook utilities for storing and processing events
 * This file provides utilities for logging webhook events and managing automated responses
 */

export interface WebhookEvent {
  id: string;
  event: string;
  timestamp: string;
  status: 'success' | 'error';
  data: Record<string, unknown>;
  error?: string;
}

export interface AutoResponseConfig {
  enabled: boolean;
  delay?: number; // in milliseconds
  script?: string;
}

/**
 * In-memory storage for webhook events (for demonstration)
 * In production, replace this with a proper database like PostgreSQL, MongoDB, etc.
 */
const webhookEvents: WebhookEvent[] = [];
const MAX_STORED_EVENTS = 100;

/**
 * Log a webhook event
 */
export function logWebhookEvent(
  event: string,
  data: Record<string, unknown>,
  status: 'success' | 'error' = 'success',
  error?: string
): WebhookEvent {
  const webhookEvent: WebhookEvent = {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    event,
    timestamp: new Date().toISOString(),
    status,
    data,
    error,
  };

  webhookEvents.unshift(webhookEvent);
  
  // Keep only the most recent events
  if (webhookEvents.length > MAX_STORED_EVENTS) {
    webhookEvents.splice(MAX_STORED_EVENTS);
  }

  return webhookEvent;
}

/**
 * Get recent webhook events
 */
export function getRecentWebhookEvents(limit: number = 10): WebhookEvent[] {
  return webhookEvents.slice(0, limit);
}

/**
 * Get webhook events by type
 */
export function getWebhookEventsByType(eventType: string, limit: number = 10): WebhookEvent[] {
  return webhookEvents
    .filter(e => e.event === eventType)
    .slice(0, limit);
}

/**
 * Get webhook statistics
 */
export function getWebhookStats() {
  const total = webhookEvents.length;
  const successful = webhookEvents.filter(e => e.status === 'success').length;
  const failed = webhookEvents.filter(e => e.status === 'error').length;

  const eventCounts: Record<string, number> = {};
  webhookEvents.forEach(event => {
    eventCounts[event.event] = (eventCounts[event.event] || 0) + 1;
  });

  return {
    total,
    successful,
    failed,
    successRate: total > 0 ? (successful / total) * 100 : 0,
    eventCounts,
  };
}

/**
 * Clear all webhook events
 */
export function clearWebhookEvents(): void {
  webhookEvents.length = 0;
}

/**
 * Get auto-response configuration for a user
 * In production, fetch this from database based on user settings
 */
export async function getAutoResponseConfig(): Promise<AutoResponseConfig> {
  // TODO: Fetch from database
  return {
    enabled: false,
    delay: 0,
  };
}

/**
 * Schedule an automated response
 * In production, use a job queue like Bull, BullMQ, or similar
 */
export async function scheduleAutoResponse(
  userUuid: string,
  messageContent: string,
  delay: number = 0
): Promise<void> {
  console.log(`[AUTO-RESPONSE] Scheduling response to ${userUuid} with delay ${delay}ms`);
  
  if (delay > 0) {
    setTimeout(async () => {
      await sendAutoResponse(userUuid, messageContent);
    }, delay);
  } else {
    await sendAutoResponse(userUuid, messageContent);
  }
}

/**
 * Send an automated response
 */
async function sendAutoResponse(
  userUuid: string,
  messageContent: string
): Promise<void> {
  console.log(`[AUTO-RESPONSE] Sending to ${userUuid}: ${messageContent}`);
  
  // TODO: Integrate with AI service to generate response
  // TODO: Use Fanvue API to send the message
  // For now, just log
  
  // Example implementation:
  // 1. Get conversation context
  // 2. Generate AI response based on context and user settings
  // 3. Send via Fanvue API
  // 4. Log the response
}

/**
 * Check if a user should receive an auto-response
 */
export async function shouldAutoRespond(userUuid: string): Promise<boolean> {
  // TODO: Check user settings, rate limits, blocklist, etc.
  const config = await getAutoResponseConfig();
  
  if (!config.enabled) {
    return false;
  }

  // Add additional checks:
  // - Is user on a blocklist?
  // - Has this user received a response recently?
  // - Are we within rate limits?
  
  return true;
}

/**
 * Track revenue from tips and purchases
 */
export interface RevenueEvent {
  type: 'tip' | 'purchase' | 'subscription';
  amount: number;
  currency: string;
  userUuid?: string;
  timestamp: string;
}

const revenueEvents: RevenueEvent[] = [];

/**
 * Log a revenue event
 */
export function logRevenueEvent(event: RevenueEvent): void {
  revenueEvents.unshift(event);
  console.log('[REVENUE] Event logged:', event);
}

/**
 * Get revenue statistics
 */
export function getRevenueStats(period: 'day' | 'week' | 'month' | 'all' = 'all') {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'day':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(0);
  }

  const filteredEvents = revenueEvents.filter(
    e => new Date(e.timestamp) >= startDate
  );

  const total = filteredEvents.reduce((sum, e) => sum + e.amount, 0);
  const byType = filteredEvents.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    byType,
    count: filteredEvents.length,
  };
}

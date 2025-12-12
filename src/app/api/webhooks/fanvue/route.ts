import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  logWebhookEvent,
  shouldAutoRespond,
  scheduleAutoResponse,
  logRevenueEvent,
} from '@/lib/webhook-utils';

// Types for Fanvue webhook events
type WebhookEventType = 
  | 'message.received'
  | 'subscriber.new'
  | 'tip.received'
  | 'purchase.received'
  | 'subscription.renewed'
  | 'subscription.cancelled';

interface WebhookPayload {
  event: WebhookEventType;
  timestamp: string;
  data: {
    userUuid?: string;
    username?: string;
    message?: {
      id: string;
      content: string;
      createdAt: string;
    };
    amount?: number;
    currency?: string;
    subscriptionTier?: string;
  };
}

/**
 * Verify webhook signature from Fanvue
 * This ensures the webhook is actually from Fanvue and not a malicious request
 */
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

/**
 * Process webhook events
 */
async function processWebhookEvent(payload: WebhookPayload) {
  console.log(`[WEBHOOK] Processing event: ${payload.event}`, payload.data);

  try {
    switch (payload.event) {
      case 'message.received':
        await handleMessageReceived(payload.data);
        break;
      
      case 'subscriber.new':
        await handleNewSubscriber(payload.data);
        break;
      
      case 'tip.received':
        await handleTipReceived(payload.data);
        break;
      
      case 'purchase.received':
        await handlePurchaseReceived(payload.data);
        break;
      
      case 'subscription.renewed':
        await handleSubscriptionRenewed(payload.data);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(payload.data);
        break;
      
      default:
        console.log(`[WEBHOOK] Unknown event type: ${payload.event}`);
    }
  } catch (error) {
    console.error('[WEBHOOK] Error processing event:', error);
    throw error;
  }
}

/**
 * Handle new message received - trigger auto-response if enabled
 */
async function handleMessageReceived(data: WebhookPayload['data']) {
  console.log('[WEBHOOK] New message received:', data);
  
  try {
    const { userUuid, message } = data;
    
    if (!userUuid || !message) {
      console.warn('[WEBHOOK] Missing required data for message.received');
      return;
    }

    // Check if auto-response is enabled for this user
    const shouldRespond = await shouldAutoRespond(userUuid);
    
    if (shouldRespond) {
      // Schedule auto-response (you can add a delay here)
      await scheduleAutoResponse(
        userUuid,
        message.content,
        0 // No delay, respond immediately. Change to add delay (e.g., 5000 for 5 seconds)
      );
    }

    // Log the event
    logWebhookEvent('message.received', data, 'success');
  } catch (error) {
    console.error('[WEBHOOK] Error handling message.received:', error);
    logWebhookEvent('message.received', data, 'error', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

/**
 * Handle new subscriber - schedule welcome script
 */
async function handleNewSubscriber(data: WebhookPayload['data']) {
  console.log('[WEBHOOK] New subscriber:', data);
  
  try {
    const { userUuid, username } = data;
    
    if (!userUuid) {
      console.warn('[WEBHOOK] Missing userUuid for subscriber.new');
      return;
    }

    // Schedule welcome message to send after 10 minutes (600000ms)
    const welcomeMessage = `Welcome! Thank you for subscribing, ${username || 'there'}! 🎉`;
    await scheduleAutoResponse(userUuid, welcomeMessage, 600000); // 10 minutes delay

    // Log the event
    logWebhookEvent('subscriber.new', data, 'success');
  } catch (error) {
    console.error('[WEBHOOK] Error handling subscriber.new:', error);
    logWebhookEvent('subscriber.new', data, 'error', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

/**
 * Handle tip received - update analytics
 */
async function handleTipReceived(data: WebhookPayload['data']) {
  console.log('[WEBHOOK] Tip received:', data);
  
  try {
    const { amount, currency, userUuid } = data;
    
    if (!amount || !currency) {
      console.warn('[WEBHOOK] Missing amount or currency for tip.received');
      return;
    }

    // Log revenue event
    logRevenueEvent({
      type: 'tip',
      amount,
      currency,
      userUuid,
      timestamp: new Date().toISOString(),
    });

    // Optionally send thank you message
    if (userUuid) {
      const thankYouMessage = `Thank you so much for the tip! 💖`;
      await scheduleAutoResponse(userUuid, thankYouMessage, 0);
    }

    // Log the event
    logWebhookEvent('tip.received', data, 'success');
  } catch (error) {
    console.error('[WEBHOOK] Error handling tip.received:', error);
    logWebhookEvent('tip.received', data, 'error', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

/**
 * Handle purchase received - trigger thank you script
 */
async function handlePurchaseReceived(data: WebhookPayload['data']) {
  console.log('[WEBHOOK] Purchase received:', data);
  
  try {
    const { amount, currency, userUuid } = data;
    
    if (!amount || !currency) {
      console.warn('[WEBHOOK] Missing amount or currency for purchase.received');
      return;
    }

    // Log revenue event
    logRevenueEvent({
      type: 'purchase',
      amount,
      currency,
      userUuid,
      timestamp: new Date().toISOString(),
    });

    // Send thank you message
    if (userUuid) {
      const thankYouMessage = `Thank you for your purchase! I hope you enjoy it! 😊`;
      await scheduleAutoResponse(userUuid, thankYouMessage, 0);
    }

    // Log the event
    logWebhookEvent('purchase.received', data, 'success');
  } catch (error) {
    console.error('[WEBHOOK] Error handling purchase.received:', error);
    logWebhookEvent('purchase.received', data, 'error', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

/**
 * Handle subscription renewed
 */
async function handleSubscriptionRenewed(data: WebhookPayload['data']) {
  console.log('[WEBHOOK] Subscription renewed:', data);
  
  try {
    const { userUuid, amount, currency } = data;

    if (amount && currency) {
      // Log revenue event
      logRevenueEvent({
        type: 'subscription',
        amount,
        currency,
        userUuid,
        timestamp: new Date().toISOString(),
      });
    }

    // Log the event
    logWebhookEvent('subscription.renewed', data, 'success');
  } catch (error) {
    console.error('[WEBHOOK] Error handling subscription.renewed:', error);
    logWebhookEvent('subscription.renewed', data, 'error', error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Handle subscription cancelled
 */
async function handleSubscriptionCancelled(data: WebhookPayload['data']) {
  console.log('[WEBHOOK] Subscription cancelled:', data);
  
  try {
    // Log the event
    logWebhookEvent('subscription.cancelled', data, 'success');
    
    // TODO: Optionally trigger win-back campaign
  } catch (error) {
    console.error('[WEBHOOK] Error handling subscription.cancelled:', error);
    logWebhookEvent('subscription.cancelled', data, 'error', error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * POST /api/webhooks/fanvue
 * Receive and process webhook events from Fanvue
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    
    // Get webhook signature from headers
    const signature = request.headers.get('x-fanvue-signature');
    if (!signature) {
      console.error('[WEBHOOK] Missing signature header');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    // NOTE: You need to set WEBHOOK_SECRET in your environment variables
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('[WEBHOOK] WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.error('[WEBHOOK] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload: WebhookPayload = JSON.parse(rawBody);

    // Process the webhook event asynchronously
    // We return 200 immediately to acknowledge receipt
    processWebhookEvent(payload).catch(error => {
      console.error('[WEBHOOK] Failed to process event:', error);
    });

    // Return success response
    return NextResponse.json({
      success: true,
      event: payload.event,
      receivedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[WEBHOOK] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/fanvue
 * Test endpoint to verify webhook configuration
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Fanvue webhook endpoint is ready',
    timestamp: new Date().toISOString(),
  });
}

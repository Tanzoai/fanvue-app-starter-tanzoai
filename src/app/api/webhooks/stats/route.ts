import { NextResponse } from 'next/server';
import {
  getRecentWebhookEvents,
  getWebhookStats,
  getRevenueStats,
} from '@/lib/webhook-utils';

/**
 * GET /api/webhooks/stats
 * Get webhook statistics and recent events
 */
export async function GET() {
  try {
    const stats = getWebhookStats();
    const recentEvents = getRecentWebhookEvents(10);
    const revenueStats = getRevenueStats('all');

    return NextResponse.json({
      stats,
      recentEvents,
      revenueStats,
    });
  } catch (error) {
    console.error('[WEBHOOK STATS] Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webhook stats' },
      { status: 500 }
    );
  }
}

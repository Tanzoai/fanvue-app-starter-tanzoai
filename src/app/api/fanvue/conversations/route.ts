import { NextResponse } from 'next/server';
import { getFanvueConversations } from '@/lib/fanvue-api';

/**
 * GET /api/fanvue/conversations
 * Returns all conversations for the authenticated user
 */
export async function GET() {
  try {
    const conversations = await getFanvueConversations();
    
    if (!conversations) {
      return NextResponse.json(
        { error: 'Failed to fetch conversations' },
        { status: 500 }
      );
    }

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

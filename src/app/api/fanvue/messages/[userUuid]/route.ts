import { NextResponse } from 'next/server';
import { getFanvueMessages, sendFanvueMessage, markMessagesAsRead } from '@/lib/fanvue-api';

/**
 * GET /api/fanvue/messages/[userUuid]
 * Returns all messages for a specific conversation
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userUuid: string }> }
) {
  try {
    const { userUuid } = await params;
    const messages = await getFanvueMessages(userUuid);
    
    if (!messages) {
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/fanvue/messages/[userUuid]
 * Send a message to a user
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ userUuid: string }> }
) {
  try {
    const { userUuid } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    const result = await sendFanvueMessage(userUuid, content);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/fanvue/messages/[userUuid]
 * Mark messages as read
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userUuid: string }> }
) {
  try {
    const { userUuid } = await params;
    await markMessagesAsRead(userUuid);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

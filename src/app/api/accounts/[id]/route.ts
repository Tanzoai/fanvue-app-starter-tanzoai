import { NextResponse } from 'next/server';
import { removeAccountFromMultiSession } from '@/lib/session';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const accountId = params.id;
    
    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }
    
    // Remove the account from multi-session storage
    await removeAccountFromMultiSession(accountId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
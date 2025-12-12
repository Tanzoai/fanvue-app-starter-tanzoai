import { NextResponse } from 'next/server';
import { getMultiAccounts, removeAccountFromMultiSession } from '@/lib/session';
import { getCurrentUser } from '@/lib/fanvue';

export async function GET() {
  try {
    // Get current user to identify the active account
    const currentUser = await getCurrentUser();
    const activeAccountId = currentUser?.id;
    
    // Get all multi accounts
    const multiAccounts = await getMultiAccounts();
    
    // Transform the data to match the frontend interface
    const accounts = multiAccounts.map(account => ({
      accountId: account.accountId,
      accountName: account.accountName,
      accountHandle: account.accountHandle,
      avatarUrl: account.avatarUrl,
      isConnected: account.accountId === activeAccountId,
      lastActive: account.accountId === activeAccountId ? new Date().toISOString() : undefined,
      color: account.color,
    }));
    
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array on error
  }
}

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
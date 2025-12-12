import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/profile/update-bio
 * Updates the bio on Fanvue profile
 */
export async function POST(request: NextRequest) {
  try {
    const { bio } = await request.json();

    if (!bio) {
      return NextResponse.json(
        { error: 'Bio is required' },
        { status: 400 }
      );
    }

    // TODO: Get access token from session
    // const session = await getSession();
    // const accessToken = session?.accessToken;

    // TODO: Call Fanvue API to update profile bio
    // const response = await fetch('https://api.fanvue.com/v1/profile', {
    //   method: 'PATCH',
    //   headers: {
    //     'Authorization': `Bearer ${accessToken}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ bio }),
    // });

    // if (!response.ok) {
    //   throw new Error('Failed to update bio on Fanvue');
    // }

    // Mock success for now
    console.log('Bio would be updated to:', bio);

    return NextResponse.json({
      success: true,
      bio,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating bio:', error);
    return NextResponse.json(
      { error: 'Failed to update bio' },
      { status: 500 }
    );
  }
}

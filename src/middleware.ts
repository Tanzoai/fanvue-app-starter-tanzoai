import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	// Minimal middleware to satisfy Next.js expectation.
	// Modify this function if you need to handle redirects, headers, or auth.
	return NextResponse.next();
}

export const config = {
	matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};

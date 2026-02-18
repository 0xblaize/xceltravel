import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for the Privy access token in cookies
  const session = request.cookies.get('privy-session'); 
  
  if (!session && request.nextUrl.pathname.startsWith('/api/wallet')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.next();
}

// Add this exact block to the bottom of the file
export const config = {
  matcher: [
    // This runs middleware on everything EXCEPT the webhooks route
    '/((?!api/webhooks).*)',
  ],
}; 
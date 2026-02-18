// app/api/wallet/route.ts
import { NextResponse } from 'next/server';
import { getNativeWalletData } from '@/lib/privy-admin';

export async function GET(request: Request) {
  // 1. Get the User ID from the request (usually from a cookie/header)
  const privyUserId = request.headers.get('x-privy-user-id'); 

  if (!privyUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Call our backend manager
  const data = await getNativeWalletData(privyUserId);

  return NextResponse.json(data);
}
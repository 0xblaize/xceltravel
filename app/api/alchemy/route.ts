import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { method, params } = await req.json();
  
  // Use the SECURE key here (never exposed to client)
  const res = await fetch(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params
    })
  });
  
  const data = await res.json();
  return NextResponse.json(data);
}
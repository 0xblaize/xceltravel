import { PrivyClient } from '@privy-io/server-auth';
// TODO: Import your Firebase Admin database here
import { adminDb as db } from '@/lib/firebase-admin';

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID as string,
  process.env.PRIVY_APP_SECRET as string
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const webhookSecret = process.env.PRIVY_WEBHOOK_SECRET;

    if (!webhookSecret || !webhookSecret.startsWith('whsec_')) {
      return new Response('Configuration error', { status: 500 });
    }

    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response('Missing Headers', { status: 401 });
    }

    const svixHeaders = {
      id: svixId,
      timestamp: svixTimestamp,
      signature: svixSignature
    };

    const event = await privy.verifyWebhook(body, svixHeaders, webhookSecret) as any;

    console.log('✅ Webhook verified! Type:', event.type);

    // --- FIREBASE SAVING LOGIC ---
    if (event.type === 'user.created') {
      const userData = event.data;

      // 1. Extract the specific wallets
      const evmWallet = userData.linked_accounts?.find(
        (acc: any) => acc.type === 'wallet' && acc.chain_type === 'ethereum'
      )?.address || null;

      const solanaWallet = userData.linked_accounts?.find(
        (acc: any) => acc.type === 'wallet' && acc.chain_type === 'solana'
      )?.address || null;

      console.log(`Saving new user ${userData.id}...`);
      console.log(`EVM: ${evmWallet} | SOL: ${solanaWallet}`);

      // 2. Save to Firebase (Uncomment when your Firebase is ready)

      await db.collection('users').doc(userData.id).set({
        privyId: userData.id,
        evmAddress: evmWallet,
        solanaAddress: solanaWallet,
        createdAt: new Date().toISOString(),
      }, { merge: true });


      console.log('✅ User successfully saved to Firebase!');
    }

    return new Response('Success', { status: 200 });

  } catch (error: any) {
    console.error('❌ Verification Error:', error.message);
    return new Response('Unauthorized', { status: 401 });
  }
}
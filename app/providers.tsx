'use client';

import { useMemo, useEffect, useState } from 'react';
import { PrivyProvider, useSubscribeToJwtAuthWithFlag } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { base, mainnet, optimism, arbitrum } from 'viem/chains';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// --- THE INVISIBLE BRIDGE ---
function FirebasePrivySync() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Watch Firebase for logins
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Tell Privy to mint wallets whenever Firebase is logged in
  useSubscribeToJwtAuthWithFlag({
    isAuthenticated: !!firebaseUser,
    isLoading: isLoading,
    getExternalJwt: async () => {
      if (firebaseUser) {
        return await firebaseUser.getIdToken();
      }
      return undefined;
    }
  });

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const solanaConnectors = useMemo(() => toSolanaWalletConnectors(), []);

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        embeddedWallets: {
          ethereum: { createOnLogin: 'users-without-wallets' },
          solana: { createOnLogin: 'users-without-wallets' },
        },
        externalWallets: {
          solana: { connectors: solanaConnectors },
        },
        supportedChains: [base, mainnet, optimism, arbitrum],
        appearance: {
          theme: 'dark',
          accentColor: '#d9a321',
          walletChainType: 'ethereum-and-solana',
        }
      }}
    >
      {/* 3. Drop the bridge inside the Provider */}
      <FirebasePrivySync />
      {children}
    </PrivyProvider>
  );
}
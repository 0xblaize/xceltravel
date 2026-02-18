import { PrivyClient } from '@privy-io/server-auth';
import { Alchemy, Network } from 'alchemy-sdk';
import { Connection, PublicKey } from '@solana/web3.js';

const privy = new PrivyClient(process.env.PRIVY_APP_ID!, process.env.PRIVY_APP_SECRET!);

// Alchemy Settings for BASE (or whatever chain you use)
const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY, 
  network: Network.BASE_MAINNET, // Or ETH_MAINNET
});

const solConnection = new Connection("https://api.mainnet-beta.solana.com");

export async function getNativeWalletData(privyUserId: string) {
  try {
    const user = await privy.getUser(privyUserId);
    
    const evmAccount = user.linkedAccounts.find(a => a.type === 'wallet' && 'walletClientType' in a && a.walletClientType === 'privy') as any;

    const solAccount = user.linkedAccounts.find(a => a.type === 'wallet' && 'walletClientType' in a && a.walletClientType === 'solana') as any;

    if (!evmAccount || !solAccount) return null;

    // 1. Fetch EVM Native (ETH) + All Tokens (USDC, etc.) via Alchemy
    const [evmBalances, solBal] = await Promise.all([
      alchemy.core.getTokenBalances(evmAccount.address),
      solConnection.getBalance(new PublicKey(solAccount.address))
    ]);

    // 2. Alchemy returns a list. We find the specific ones we want or return all
    // To get the native ETH balance specifically:
    const ethBalance = await alchemy.core.getBalance(evmAccount.address, 'latest');

    return {
      evmAddress: evmAccount.address,
      solAddress: solAccount.address,
      balances: {
        eth: ethBalance.toString(), // Returns in Wei, convert in frontend or here
        sol: (solBal / 1e9).toFixed(4),
        tokens: evmBalances.tokenBalances // This contains all your ERC20s!
      }
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
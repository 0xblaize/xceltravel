"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePrivy, useWallets, useFundWallet } from "@privy-io/react-auth";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { 
  Plus, ArrowUpRight, ArrowDownLeft, RefreshCcw, X,
  Bell, Home, Calendar, Users, Wallet as WalletIcon, 
  Search, Loader2, Image as ImageIcon, Copy, CheckCircle2, 
  ChevronDown, ArrowRightLeft, QrCode, ArrowUpCircle, ArrowDownCircle,
  CreditCard, Settings2
} from "lucide-react";

/* --- NAV COMPONENTS --- */
const NavLink = ({ label, onClick, active }: any) => (
  <button onClick={onClick} className={`transition-all text-[10px] font-black uppercase tracking-[0.2em] ${active ? 'text-[#d9a321] border-b-2 border-[#d9a321] pb-1' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'}`}>
    {label}
  </button>
);

const MobileTab = ({ icon, label, active, onClick }: any) => (
  <div onClick={onClick} className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${active ? 'text-[#d9a321]' : 'text-slate-400 dark:text-gray-500'}`}>
    {React.cloneElement(icon, { size: 20, strokeWidth: active ? 3 : 2 })}
    <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
  </div>
);

/* --- UI COMPONENTS --- */
const ActionButton = ({ icon: Icon, label, onClick }: any) => (
  <div onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer group shrink-0">
    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#d9a321]/10 border border-[#d9a321]/20 flex items-center justify-center text-[#d9a321] group-hover:bg-[#d9a321] group-hover:text-black transition-all shadow-sm">
      <Icon size={20} />
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 group-hover:text-[#d9a321] transition-colors">{label}</span>
  </div>
);

const TokenRow = ({ name, symbol, balance, fiatValue, icon, chain, isLoading }: any) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 px-3 rounded-2xl transition-all cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 p-0.5 border border-slate-200 dark:border-white/10 flex-shrink-0">
        <img src={icon} className="w-full h-full rounded-full object-cover" alt={symbol} />
      </div>
      <div className="text-left">
        <p className="font-black text-[13px] uppercase italic text-slate-900 dark:text-white leading-none">{name}</p>
        <p className="text-[9px] text-slate-400 dark:text-gray-500 font-bold uppercase mt-1 tracking-wider">{chain}</p>
      </div>
    </div>
    <div className="text-right flex flex-col items-end">
      {isLoading ? (
        <>
          <div className="w-16 h-4 bg-slate-200 dark:bg-white/10 rounded animate-pulse mb-1"></div>
          <div className="w-10 h-3 bg-slate-200 dark:bg-white/10 rounded animate-pulse"></div>
        </>
      ) : (
        <>
          <p className="font-black text-sm text-slate-900 dark:text-white italic">{balance} {symbol}</p>
          <p className="text-[10px] text-slate-400 dark:text-gray-400 font-bold mt-1 tracking-tighter">{fiatValue}</p>
        </>
      )}
    </div>
  </div>
);

const HistoryRow = ({ type, title, amount, date, status }: any) => {
  const isSend = type === 'send';
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 px-3 rounded-2xl transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSend ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
          {isSend ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
        </div>
        <div className="text-left">
          <p className="font-black text-[13px] uppercase italic text-slate-900 dark:text-white leading-none truncate w-32 md:w-48">{title}</p>
          <p className="text-[9px] text-slate-400 dark:text-gray-500 font-bold uppercase mt-1 tracking-wider">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-black text-sm italic ${isSend ? 'text-slate-900 dark:text-white' : 'text-green-500'}`}>{amount}</p>
        <p className="text-[9px] text-slate-400 dark:text-gray-400 font-bold mt-1 tracking-tighter">{status}</p>
      </div>
    </div>
  );
};

/* --- FULL-SCREEN MODALS --- */
const SendModal = ({ isOpen, onClose }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-[#050a12] w-full h-[90vh] md:h-auto max-w-md rounded-t-[40px] md:rounded-[40px] p-8 border border-slate-200 dark:border-white/10 shadow-2xl relative animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 flex flex-col">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors"><X size={24}/></button>
        <h3 className="text-2xl font-black italic uppercase text-[#d9a321] mb-8">Send Crypto</h3>
        <div className="space-y-6 flex-1">
          <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 rounded-2xl cursor-pointer hover:border-[#d9a321] transition-all">
            <div className="flex items-center gap-3">
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" className="w-8 h-8 rounded-full" alt="ETH" />
              <div className="text-left">
                <span className="font-black text-sm italic uppercase text-slate-900 dark:text-white block">Ethereum (ETH)</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Base Network</span>
              </div>
            </div>
            <ChevronDown size={20} className="text-slate-400" />
          </div>
          <input placeholder="Paste Recipient Address..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 rounded-2xl text-sm font-mono outline-none focus:border-[#d9a321] text-slate-900 dark:text-white" />
          <div className="relative">
             <input placeholder="0.00" type="number" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl text-4xl font-black italic outline-none focus:border-[#d9a321] text-slate-900 dark:text-white" />
             <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">MAX</span>
          </div>
        </div>
        <button className="w-full bg-[#d9a321] text-black py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl hover:bg-[#b5871b] transition-colors mt-8">Preview Send</button>
      </div>
    </div>
  );
};

const ReceiveModal = ({ isOpen, onClose, evmAddress, solAddress }: any) => {
  const [copied, setCopied] = useState(false);
  const [network, setNetwork] = useState<'BASE' | 'ETH' | 'SOL'>('BASE');
  
  if (!isOpen) return null;
  // STRICT ADDRESS CHECK
  const rawAddress = network === 'SOL' ? solAddress : evmAddress;
  const displayAddress = rawAddress || "0x0000000000000000000000000000000000000000";

  const handleCopy = () => {
    if (!rawAddress) return;
    navigator.clipboard.writeText(displayAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-[#050a12] w-full h-[90vh] md:h-auto max-w-md rounded-t-[40px] md:rounded-[40px] p-8 border border-slate-200 dark:border-white/10 shadow-2xl relative animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 flex flex-col">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors"><X size={24}/></button>
        <h3 className="text-2xl font-black italic uppercase text-[#d9a321] mb-6">Receive Assets</h3>
        <div className="flex bg-slate-100 dark:bg-white/5 rounded-xl p-1 mb-8">
          <button onClick={() => setNetwork('BASE')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${network === 'BASE' ? 'bg-[#d9a321] text-black shadow' : 'text-slate-400'}`}>Base</button>
          <button onClick={() => setNetwork('ETH')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${network === 'ETH' ? 'bg-[#d9a321] text-black shadow' : 'text-slate-400'}`}>Ethereum</button>
          <button onClick={() => setNetwork('SOL')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${network === 'SOL' ? 'bg-[#d9a321] text-black shadow' : 'text-slate-400'}`}>Solana</button>
        </div>
        <div className="flex flex-col items-center space-y-8 flex-1 justify-center">
          <div className="p-4 bg-white rounded-[2rem] shadow-sm border border-slate-100 relative">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${displayAddress}`} className={`w-48 h-48 ${!rawAddress && 'opacity-10 blur-sm'}`} alt="QR" />
            {!rawAddress && <p className="text-xs text-red-500 font-bold text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Wallet Generating...</p>}
          </div>
          <div className="w-full text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d9a321] mb-3">Your {network} Address</p>
            <div onClick={handleCopy} className={`bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 rounded-2xl flex justify-between items-center transition-all ${rawAddress ? 'cursor-pointer group hover:border-[#d9a321]' : 'opacity-50 cursor-not-allowed'}`}>
              <span className="text-xs font-mono text-slate-500 dark:text-gray-400 truncate w-64">{displayAddress}</span>
              {copied ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} className="text-slate-400 group-hover:text-[#d9a321]" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SwapModal = ({ isOpen, onClose }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-[#050a12] w-full h-[90vh] md:h-auto max-w-md rounded-t-[40px] md:rounded-[40px] p-8 border border-slate-200 dark:border-white/10 shadow-2xl relative animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 flex flex-col">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors"><X size={24}/></button>
        <h3 className="text-2xl font-black italic uppercase text-[#d9a321] mb-6">Swap Assets</h3>
        <div className="space-y-2 relative flex-1 mt-4">
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-3xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">You Pay</p>
            <div className="flex justify-between items-center">
              <input placeholder="0" type="number" className="bg-transparent text-4xl font-black italic outline-none text-slate-900 dark:text-white w-1/2" />
              <div className="flex items-center gap-2 bg-white dark:bg-[#050a12] px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm cursor-pointer">
                <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" className="w-6 h-6 rounded-full" alt="USDC" />
                <span className="text-sm font-black uppercase">USDC</span>
                <ChevronDown size={16} className="text-slate-400"/>
              </div>
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#d9a321] rounded-2xl flex items-center justify-center border-[6px] border-white dark:border-[#050a12] cursor-pointer hover:rotate-180 transition-all duration-300">
            <ArrowRightLeft size={20} className="text-black rotate-90" />
          </div>
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-3xl mt-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">You Receive</p>
            <div className="flex justify-between items-center">
              <input placeholder="0" disabled className="bg-transparent text-4xl font-black italic outline-none text-slate-500 w-1/2" />
              <div className="flex items-center gap-2 bg-white dark:bg-[#050a12] px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm cursor-pointer">
                <img src="https://cryptologos.cc/logos/solana-sol-logo.png" className="w-6 h-6 rounded-full" alt="SOL" />
                <span className="text-sm font-black uppercase">SOL</span>
                <ChevronDown size={16} className="text-slate-400"/>
              </div>
            </div>
          </div>
        </div>
        <button className="w-full bg-[#d9a321] text-black py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl hover:bg-[#b5871b] transition-colors mt-6">Review Swap</button>
      </div>
    </div>
  );
};

const ManageTokensModal = ({ isOpen, onClose, tokenData, setTokenData }: any) => {
  const [search, setSearch] = useState("");
  if (!isOpen) return null;

  const toggleToken = (id: string) => {
    setTokenData((prev: any[]) => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-[#050a12] w-full h-[90vh] md:h-[600px] max-w-md rounded-t-[40px] md:rounded-[40px] p-8 border border-slate-200 dark:border-white/10 shadow-2xl relative animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 flex flex-col">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors"><X size={24}/></button>
        <h3 className="text-xl font-black italic uppercase text-[#d9a321] mb-6">Manage Tokens</h3>
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search or paste contract address..." 
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-4 pl-12 pr-4 rounded-2xl text-xs font-mono outline-none focus:border-[#d9a321] text-slate-900 dark:text-white" 
          />
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {tokenData.map((token: any) => (
            <div key={token.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all">
              <div className="flex items-center gap-3">
                <img src={token.icon} className="w-8 h-8 rounded-full" alt={token.symbol} />
                <div>
                  <p className="font-black text-xs uppercase italic text-slate-900 dark:text-white">{token.symbol}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">{token.chain}</p>
                </div>
              </div>
              <button onClick={() => toggleToken(token.id)} className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${token.active ? 'bg-[#d9a321]' : 'bg-slate-300 dark:bg-slate-700'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-sm ${token.active ? 'left-[26px]' : 'left-0.5'}`}></div>
              </button>
            </div>
          ))}
          {search.startsWith("0x") && (
             <div className="mt-6 p-6 border border-dashed border-[#d9a321]/50 rounded-3xl text-center bg-[#d9a321]/5 cursor-pointer hover:bg-[#d9a321]/10 transition-all">
                <Plus size={24} className="mx-auto text-[#d9a321] mb-2" />
                <p className="text-xs font-black uppercase italic text-[#d9a321]">Import Custom Token</p>
                <p className="text-[9px] text-slate-500 mt-1 font-mono">{search.substring(0, 16)}...</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* --- MAIN PAGE --- */
export default function WalletPage() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [activeTab, setActiveTab] = useState<'tokens' | 'nfts' | 'activity'>('tokens');
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);

  const [isLoadingBalances, setIsLoadingBalances] = useState(true);
  const [totalVaultBalance, setTotalVaultBalance] = useState("$0.00");
  const [txHistory, setTxHistory] = useState<any[]>([]);
  
  const [tokenData, setTokenData] = useState<any[]>([
    { id: 'ETH_BASE', name: "Ethereum", symbol: "ETH", chain: "Base Network", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png", balance: "0.00", fiat: "$0.00", active: true },
    { id: 'ETH_MAIN', name: "Ethereum", symbol: "ETH", chain: "Ethereum Network", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png", balance: "0.00", fiat: "$0.00", active: true },
    { id: 'SOL', name: "Solana", symbol: "SOL", chain: "Solana Network", icon: "https://cryptologos.cc/logos/solana-sol-logo.png", balance: "0.00", fiat: "$0.00", active: true },
    { id: 'USDT', name: "Tether", symbol: "USDT", chain: "Ethereum Network", icon: "https://cryptologos.cc/logos/tether-usdt-logo.png", balance: "0.00", fiat: "$0.00", active: true },
    { id: 'USDC_BASE', name: "USD Coin", symbol: "USDC", chain: "Base Network", icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png", balance: "0.00", fiat: "$0.00", active: false },
    { id: 'PEPE', name: "Pepe", symbol: "PEPE", chain: "Ethereum Network", icon: "https://cryptologos.cc/logos/pepe-pepe-logo.png", balance: "0.00", fiat: "$0.00", active: false },
  ]);

  const { authenticated, ready, user } = usePrivy();
  const { wallets } = useWallets();
  const { fundWallet } = useFundWallet();

  const evmAddress = wallets.find((w) => w.walletClientType === 'privy')?.address;
  const solAddress = (user?.linkedAccounts?.find(
    (a: any) => a.type === 'wallet' && a.chainType === 'solana'
  ) as any)?.address;

  const handleDeposit = async () => {
    if (!evmAddress) return;
    try {
      await fundWallet({
        address: evmAddress,
        options: { amount: '50', asset: 'native-currency', chain: 'base-mainnet' as any }
      });
    } catch (err) {
      console.error("Deposit error:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoadingBalances(true);

    async function fetchLiveData() {
      try {
        let liveSolBalance = "0.00";

        if (solAddress) {
          const connection = new Connection('https://api.mainnet-beta.solana.com');
          const publicKey = new PublicKey(solAddress);
          const lamports = await connection.getBalance(publicKey);
          liveSolBalance = (lamports / LAMPORTS_PER_SOL).toFixed(4);
        }

        if (isMounted) {
          setTokenData(prev => prev.map(t => 
            t.symbol === 'SOL' ? { ...t, balance: liveSolBalance, fiat: "$0.00" } : t
          ));
          setTotalVaultBalance(`$0.00`);
          
          setTxHistory([
            { type: "receive", title: "Wallet Created", amount: "+0.00", date: "Today", status: "Active" }
          ]);
          setIsLoadingBalances(false);
        }
      } catch (error) {
        if (isMounted) setIsLoadingBalances(false);
      }
    }
    fetchLiveData();
    return () => { isMounted = false; };
  }, [evmAddress, solAddress]);

  // Redirect unauthenticated users (must be above early returns to satisfy Rules of Hooks)
  // TEMPORARILY DISABLED — logging only to debug auth state
  useEffect(() => {
    console.log("Privy State Check:", { ready, authenticated });

    // COMMENTED OUT: the redirect is kicking out authenticated users
    // if (ready && !authenticated) {
    //   router.push('/');
    // }
  }, [ready, authenticated]);

  if (!ready || (authenticated && !wallets.length)) {
    return (
      <div className="min-h-screen bg-[#050a12] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#d9a321]" size={40} />
        <p className="text-[#d9a321] text-[10px] font-black uppercase tracking-[0.3em] italic animate-pulse">Initializing User Wallet...</p>
      </div>
    );
  }

  const activeTokens = tokenData.filter(token => token.active);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050a12] text-slate-900 dark:text-white selection:bg-[#d9a321] pb-24 md:pb-10 transition-colors duration-300">
      
      {/* Modals */}
      <SendModal isOpen={isSendOpen} onClose={() => setIsSendOpen(false)} />
      <ReceiveModal isOpen={isReceiveOpen} onClose={() => setIsReceiveOpen(false)} evmAddress={evmAddress} solAddress={solAddress} />
      <SwapModal isOpen={isSwapOpen} onClose={() => setIsSwapOpen(false)} />
      <ManageTokensModal isOpen={isManageOpen} onClose={() => setIsManageOpen(false)} tokenData={tokenData} setTokenData={setTokenData} />
      
      {/* PC Header */}
      <header className="hidden md:flex items-center justify-between px-10 py-4 bg-white/80 dark:bg-[#050a12]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 sticky top-0 z-50">
                    <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => router.push('/dashboard')}>
                      <div className="w-8 h-8 flex items-center justify-center overflow-hidden"> 
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" /> 
                      </div>
                      <span className="font-bold text-xl text-[#d9a321] italic tracking-tighter uppercase">XcelTravel</span>
                    </div>
                    
                    <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-gray-400">
                      <button onClick={() => router.push('/dashboard')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Dashboard</button>
                      <button onClick={() => router.push('/events')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Events</button>
                      <button onClick={() => router.push('/wallet')} className="text-[#d9a321] border-b-2 border-[#d9a321] pb-1 font-bold">Wallet</button>
                      <button onClick={() => router.push('/social')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Social</button>
                      <button onClick={() => router.push('/profile')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Profile</button>
                    </nav>
            
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" size={14} />
                        <input 
                          type="text" 
                          placeholder="Search..." 
                          className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10  py-1.5 pl-9 pr-4 text-xs text-slate-900 dark:text-white outline-none w-48 focus:border-[#d9a321] transition-all" 
                        />
                      </div>
                      <Bell className="text-slate-400 dark:text-gray-500 cursor-pointer hover:text-[#d9a321]" size={20} />
                      <div className="w-9 h-9 border-2 border-[#f8f6f2] p-0.5 overflow-hidden rounded-full cursor-pointer" onClick={() => router.push('/profile')}>
                        <img src="https://i.pravatar.cc/150?u=xcel" alt="Profile" className="l w-full h-full rounded-full  object-cover" />
                      </div>
                    </div>
                  </header>

      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/10 bg-white dark:bg-[#050a12] sticky top-0 z-50">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#d9a321] text-black font-bold">X</div>
        <span className="font-bold text-[#d9a321] italic tracking-tighter uppercase">XcelTravel</span>
        <Bell className="text-slate-400 dark:text-gray-400" size={20} />
      </header>

      <main className="w-full px-4 md:px-12 py-8 md:py-12 max-w-4xl mx-auto">
        
        <div className="flex flex-col items-center justify-center text-center mb-12">
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Total Vault Balance</p>
           {isLoadingBalances ? (
              <div className="h-16 w-64 bg-slate-200 dark:bg-white/5 rounded-2xl animate-pulse mb-8"></div>
           ) : (
             <h2 className="text-6xl md:text-7xl font-black italic tracking-tighter text-slate-900 dark:text-white leading-none mb-8">
              {totalVaultBalance}
             </h2>
           )}
           
           <div className="flex justify-center items-center gap-6 md:gap-12 w-full max-w-lg">
              <ActionButton icon={ArrowUpRight} label="Send" onClick={() => setIsSendOpen(true)} />
              <ActionButton icon={QrCode} label="Receive" onClick={() => setIsReceiveOpen(true)} />
              <ActionButton icon={CreditCard} label="Buy" onClick={handleDeposit} />
              <ActionButton icon={ArrowRightLeft} label="Swap" onClick={() => setIsSwapOpen(true)} />
           </div>
        </div>

        <section className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[35px] p-6 md:p-8 shadow-sm min-h-[400px]">
           <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/10 px-2 pb-4">
              <div className="flex gap-8">
                <button onClick={() => setActiveTab('tokens')} className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'tokens' ? 'text-[#d9a321]' : 'text-slate-400 hover:text-slate-300'}`}>Tokens</button>
                <button onClick={() => setActiveTab('nfts')} className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'nfts' ? 'text-[#d9a321]' : 'text-slate-400 hover:text-slate-300'}`}>NFTs</button>
                <button onClick={() => setActiveTab('activity')} className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'activity' ? 'text-[#d9a321]' : 'text-slate-400 hover:text-slate-300'}`}>Activity</button>
              </div>
              {activeTab === 'tokens' && (
                <button onClick={() => setIsManageOpen(true)} className="text-slate-400 hover:text-[#d9a321] transition-colors flex items-center gap-1">
                  <Settings2 size={16} />
                </button>
              )}
           </div>
           
           <div className="w-full flex flex-col gap-2">
              {activeTab === 'tokens' && activeTokens.map((token) => (
                <TokenRow key={token.id} name={token.name} symbol={token.symbol} balance={token.balance} fiatValue={token.fiat} chain={token.chain} icon={token.icon} isLoading={isLoadingBalances} />
              ))}

              {activeTab === 'nfts' && (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-[#d9a321]/10 flex items-center justify-center text-[#d9a321] mb-4"><ImageIcon size={24} /></div>
                  <h4 className="text-sm font-black italic uppercase tracking-widest text-slate-900 dark:text-white">No NFTs Found</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Collect digital assets to view them here</p>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="animate-in fade-in">
                  {isLoadingBalances ? (
                    <div className="w-full h-12 bg-slate-200 dark:bg-white/5 rounded-2xl animate-pulse"></div>
                  ) : (
                    txHistory.map((tx, idx) => (
                      <HistoryRow key={idx} type={tx.type} title={tx.title} amount={tx.amount} date={tx.date} status={tx.status} />
                    ))
                  )}
                </div>
              )}
           </div>
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#050a12]/95 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 px-2 py-4 z-50">
        <div className="grid grid-cols-5 items-center justify-items-center">
          <MobileTab icon={<Home size={20} />} label="Home" active={pathname === '/dashboard'} onClick={() => router.push('/dashboard')} />
          <MobileTab icon={<Calendar size={20} />} label="Events" active={pathname === '/events'} onClick={() => router.push('/events')} />
          <MobileTab icon={<WalletIcon size={20} />} label="Wallet" active={pathname === '/wallet'} onClick={() => router.push('/wallet')} />
          <MobileTab icon={<Users size={20} />} label="Social" active={pathname === '/social'} onClick={() => router.push('/social')} />
          <div onClick={() => router.push('/profile')} className="flex flex-col items-center gap-1 cursor-pointer">
            <div className={`w-7 h-7 rounded-full border-2 transition-all ${pathname === '/profile' ? 'border-[#d9a321]' : 'border-slate-200 dark:border-gray-600'}`}>
              <img src={(user?.google as any)?.picture || "https://i.pravatar.cc/150?u=xcel"} alt="Me" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-tighter ${pathname === '/profile' ? 'text-[#d9a321]' : 'text-slate-400 dark:text-gray-500'}`}>Me</span>
          </div>
        </div>
      </nav>

    </div>
  );
}
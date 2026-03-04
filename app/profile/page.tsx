"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  Share2,
  Activity,
  Users,
  Calendar,
  Home,
  Plane,
  Award,
  RefreshCw,
  Search,
  Bell,
  Wallet,
  Twitter,
  Facebook,
  Link as LinkIcon,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) setUserData(docSnap.data());
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading)
    return (
      <div className="min-h-screen bg-white dark:bg-[#050a12] flex items-center justify-center text-[#d9a321] font-bold italic uppercase tracking-tighter">
        Loading XcelT Profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-[#050a12] text-slate-900 dark:text-white selection:bg-[#d9a321] pb-24 md:pb-10 transition-colors duration-300">
      <Navbar />

      <main className="max-w-1100px mx-auto px-6 py-10">
        {/* --- USER HEADER & SHARE --- */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          <div className="relative">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-[#d9a321] overflow-hidden shadow-2xl">
              <img
                src="https://i.pravatar.cc/300?u=xcel"
                className="w-full h-full object-cover"
                alt="Profile avatar"
              />
            </div>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-[#050a12] rounded-full"></div>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-2xl font-black tracking-tighter uppercase italic leading-none mb-2 text-slate-900 dark:text-white">
              {userData?.username || "0xblaize"}
            </h1>
            <p className="text-[#d9a321] font-bold text-lg mb-6 opacity-90">
              Level {userData?.level || 3} - XcelT Explorer
            </p>

            <div className="relative flex items-center gap-4 justify-center md:justify-start">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 border-2 border-[#d9a321] text-[#d9a321] px-6 py-2 rounded-xl text-xs font-bold hover:bg-[#d9a321] hover:text-black transition-all"
              >
                <Share2 size={14} strokeWidth={3} /> Share Profile
              </button>

              {showShareMenu && (
                <div className="flex gap-2 animate-in fade-in slide-in-from-left-4 duration-300">
                  <ShareIcon
                    icon={<Twitter size={14} />}
                    color="hover:bg-[#1DA1F2]"
                  />
                  <ShareIcon
                    icon={<Facebook size={14} />}
                    color="hover:bg-[#4267B2]"
                  />
                  <ShareIcon
                    icon={<LinkIcon size={14} />}
                    color="hover:bg-slate-400 dark:hover:bg-white/20"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- DENSE STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            label="Number of Friends"
            value={userData?.friendsCount || "128"}
          />
          <StatCard
            label="Total Balance"
            value={`$${userData?.totalBalance?.toLocaleString() || "1,250.75"} USD`}
            hasToggle
          />
        </div>

        {/* --- TRAILSCORE PROGRESS --- */}
        <section className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[30px] p-8 mb-8">
          <h3 className="flex items-center gap-2 font-bold text-lg mb-6 uppercase italic tracking-widest text-[#d9a321]">
            <Activity size={20} strokeWidth={3} /> Trailscore Progress
          </h3>
          <div className="w-full bg-slate-200 dark:bg-white/10 h-3.5 rounded-full overflow-hidden mb-4">
            <div
              className="bg-[#d9a321] h-full shadow-[0_0_15px_rgba(217,163,33,0.4)]"
              style={{ width: "51%" }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
            <span>2530 / 5000 XP</span>
            <span className="text-[#d9a321] italic">Saving Box Active</span>
          </div>
        </section>

        {/* --- RECENT ACTIVITY --- */}
        <section className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[30px] p-8 mb-8">
          <h3 className="font-bold text-xl mb-6 tracking-tight uppercase italic text-slate-900 dark:text-white">
            Recent Activity
          </h3>
          <div className="space-y-1">
            <ActivityRow
              icon={<Plane size={16} />}
              text="Booked a flight to Paris, France."
              time="2 hours ago"
            />
            <ActivityRow
              icon={<Award size={16} />}
              text="Earned 'Frequent Flyer' badge."
              time="1 day ago"
            />
            <ActivityRow
              icon={<RefreshCw size={16} />}
              text="Exchanged $500 USD to 0.01 BTC."
              time="3 days ago"
            />
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

/* --- REUSABLE HELPER COMPONENTS --- */

const StatCard = ({ label, value, hasToggle }: any) => (
  <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[30px] hover:border-[#d9a321]/30 transition-all shadow-sm dark:shadow-md">
    <div className="flex justify-between items-start mb-2">
      <p className="text-slate-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">
        {label}
      </p>
      {hasToggle && (
        <div className="bg-slate-200 dark:bg-white/10 p-1 rounded-xl flex gap-1">
          <button className="bg-[#d9a321] text-black text-[10px] px-3 py-1 rounded-lg font-bold shadow-sm">
            FIAT
          </button>
          <button className="text-slate-500 dark:text-white text-[10px] px-3 py-1 font-bold opacity-40">
            CRYPTO
          </button>
        </div>
      )}
    </div>
    <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white">
      {value}
    </h2>
  </div>
);

const ActivityRow = ({ icon, text, time }: any) => (
  <div className="flex items-center gap-4 py-4 border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors px-2 rounded-xl group">
    <div className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-100 dark:border-transparent flex items-center justify-center text-[#d9a321] shadow-sm">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-slate-700 dark:text-gray-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
        {text}
      </p>
      <p className="text-xs text-slate-400 dark:text-gray-500 font-medium italic">
        {time}
      </p>
    </div>
  </div>
);

const ShareIcon = ({ icon, color }: any) => (
  <button
    className={`w-9 h-9 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white transition-all shadow-sm ${color} hover:text-white hover:scale-110 active:scale-90`}
  >
    {icon}
  </button>
);

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import {
  Search,
  Bell,
  Calendar,
  Briefcase,
  Activity,
  Wallet,
  MapPin,
  Home,
  Users,
} from "lucide-react";

/* --- HELPER COMPONENTS --- */

const StatCard = ({ icon, label, value, onClick }: any) => (
  <div
    onClick={onClick}
    className={`bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6  flex flex-col gap-2 shadow-sm dark:shadow-xl transition-all ${
      onClick ? "cursor-pointer hover:border-[#d9a321] active:scale-95" : ""
    }`}
  >
    <div className="w-10 h-10 bg-[#d9a321]/10  flex items-center justify-center text-[#d9a321]">
      {icon}
    </div>
    <div className="text-2xl font-black italic text-slate-900 dark:text-white">
      {value}
    </div>
    <div className="text-[10px] text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest">
      {label}
    </div>
  </div>
);

const BookingCard = ({ title, img, date, location, tag }: any) => (
  <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden group shadow-md dark:shadow-lg transition-all hover:border-[#d9a321]/50">
    <div className="h-48 relative">
      <img
        src={img}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-80"
        alt={title}
      />
      <span className="absolute top-4 left-4 bg-[#d9a321] text-black text-[10px] font-black px-3 py-1  uppercase tracking-widest">
        {tag}
      </span>
    </div>
    <div className="p-6">
      <h4 className="font-black text-lg mb-3 text-slate-900 dark:text-white italic uppercase tracking-tighter">
        {title}
      </h4>
      <div className="space-y-2 text-sm text-slate-500 dark:text-gray-400 mb-5">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-[#d9a321]" /> {date}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-[#d9a321]" /> {location}
        </div>
      </div>
      <button className="w-full border border-slate-200 dark:border-white/10 py-3  text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white hover:bg-[#d9a321] hover:text-black hover:border-[#d9a321] transition-all">
        View Details
      </button>
    </div>
  </div>
);

/* --- MAIN DASHBOARD COMPONENT --- */

export default function Dashboard() {
  const router = useRouter();
  const [balance] = useState(0.75);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050a12] text-slate-900 dark:text-white selection:bg-[#d9a321] pb-24 md:pb-10 transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {/* --- HERO BANNER --- */}
        <section className="relative  overflow-hidden h-64 md:h-80 bg-slate-900 mb-10 shadow-2xl border border-slate-200 dark:border-white/5">
          <img
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069"
            className="w-full h-full object-cover opacity-60 dark:opacity-40"
            alt="Hero"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
            <h1 className="text-2xl md:text-5xl font-black mb-4 tracking-tighter uppercase italic drop-shadow-lg">
              Gateway to Web3 Events
            </h1>
            <p className="text-sm opacity-90 mb-8 max-w-2xl font-light tracking-wide drop-shadow-md">
              Discover, connect, and experience the future of decentralized
              travel with XcelTravel.
            </p>
            <button
              onClick={() => router.push("/events")}
              className="bg-[#d9a321] hover:bg-white hover:text-black text-black font-black px-12 py-4 transition-all active:scale-95 uppercase tracking-widest text-xs shadow-lg"
            >
              Explore Events
            </button>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<Calendar />} label="Events" value="3" />
              <StatCard icon={<Briefcase />} label="Trips" value="2" />
              <StatCard icon={<Activity />} label="Services" value="5" />
              <StatCard
                onClick={() => router.push("/wallet")}
                icon={<Wallet />}
                label="Wallet Balance"
                value={`${balance.toFixed(2)} ETH`}
              />
            </div>

            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">
                Your Bookings
              </h2>
              <button className="text-[#d9a321] text-xs font-black uppercase tracking-widest hover:underline">
                View All
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <BookingCard
                title="DeFi Summit Miami"
                img="https://images.trvl-media.com/lodging/28000000/27530000/27522600/27522522/0bad3378.jpg"
                date="Oct 26-28, 2024"
                location="Miami Beach, FL"
                tag="Accommodation"
              />
              <BookingCard
                title="EthDenver"
                img="https://assets.devfolio.co/content/030b041535514a4db9321a346b6551d0/14f33aa6-6367-415a-bd40-2e12907b8f2e.jpeg"
                date="Feb 29 - Mar 3, 2025"
                location="Denver, Colorado"
                tag="Event"
              />
            </div>
          </div>

          {/* --- RIGHT: SIDEBAR --- */}
          <aside className="lg:w-80">
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 ] p-8 shadow-md dark:shadow-xl sticky top-24">
              <h3 className="font-black text-xl mb-6 text-slate-900 dark:text-white italic uppercase tracking-tighter">
                Your Event Pass
              </h3>
              <div className="space-y-5 text-sm mb-8 border-b border-slate-200 dark:border-white/5 pb-8">
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                    Event
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Token2049
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                    Date
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Nov 2, 2026
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                    Ticket
                  </span>
                  <span className="font-black text-[#d9a321]">VIP ACCESS</span>
                </div>
              </div>

              <div className="bg-slate-200 dark:bg-white/5  p-6 flex flex-col items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-lg border border-slate-100">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=XcelTravel"
                    alt="QR"
                    className="w-32 h-32"
                  />
                </div>
                <p className="text-[10px] text-center text-slate-400 dark:text-gray-500 uppercase font-black tracking-[0.2em]">
                  Entrance Pass
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Bell, Home, Calendar, Wallet, Users } from "lucide-react";

/* --- 1. SHARED UI COMPONENTS --- */

const NavLink = ({ label, onClick, active }: any) => (
  <button
    onClick={onClick}
    className={`transition-all text-sm font-medium uppercase tracking-widest ${
      active
        ? "text-[#d9a321] border-b-2 border-[#d9a321] pb-1 font-bold"
        : "text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
    }`}
  >
    {label}
  </button>
);

const MobileTab = ({ icon, label, active, onClick }: any) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${active ? "text-[#d9a321]" : "text-slate-400 dark:text-gray-500"}`}
  >
    {React.cloneElement(icon, { strokeWidth: active ? 3 : 2 })}
    <span className="text-[9px] font-black uppercase tracking-tighter">
      {label}
    </span>
  </div>
);

const EventCard = ({ title, img, price, host, type }: any) => (
  <div className="min-w-280px md:min-w-0 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[30px] overflow-hidden group hover:border-[#d9a321]/40 transition-all shadow-md dark:shadow-lg">
    <div className="h-44 relative overflow-hidden">
      <img
        src={img}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
        alt={title}
      />
      <span className="absolute top-4 left-4 bg-[#d9a321] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
        {type}
      </span>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-black text-lg text-slate-900 dark:text-white italic uppercase tracking-tighter leading-tight truncate w-full">
          {title}
        </h4>
        <div className="w-2 h-2 rounded-full bg-green-500 mt-1 shrink-0 ml-2"></div>
      </div>
      <p className="text-slate-500 dark:text-gray-500 text-[10px] uppercase font-bold mb-6">
        {host}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xl font-black text-[#d9a321] italic">
          {price}
        </span>
        <button className="bg-[#d9a321] text-black text-[10px] font-black px-4 py-2 rounded-lg hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors uppercase">
          View Details
        </button>
      </div>
    </div>
  </div>
);

/* --- 2. MAIN PAGE COMPONENT --- */

export default function EventsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeFilter, setActiveFilter] = useState("Trip");

  const eventItems = [
    {
      id: 1,
      title: "Enchanted Forest Trek",
      type: "Trip",
      img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      price: "$450",
      host: "John Stone",
    },
    {
      id: 2,
      title: "Luxury Air Travel",
      type: "Trip",
      img: "https://images.unsplash.com/photo-1436491865332-7a61a109c05d",
      price: "$2,500",
      host: "John Stone",
    },
    {
      id: 3,
      title: "Authentic Italian Pasta",
      type: "Food",
      img: "https://images.unsplash.com/photo-1473093226795-af9932fe5856",
      price: "$120",
      host: "John Stone",
    },
    {
      id: 4,
      title: "Arctic Northern Lights",
      type: "Tours",
      img: "https://images.unsplash.com/photo-1531366930477-0f1fb9950e7e",
      price: "$1,100",
      host: "John Stone",
    },
    {
      id: 5,
      title: "Alpine Peaks Expedition",
      type: "Trip",
      img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      price: "$1,800",
      host: "John Stone",
    },
    {
      id: 6,
      title: "Tokyo Sushi Masterclass",
      type: "Food",
      img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
      price: "$180",
      host: "John Stone",
    },
    {
      id: 7,
      title: "Amazon Rainforest Trek",
      type: "Tours",
      img: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5",
      price: "$750",
      host: "John Stone",
    },
  ];

  const trips = eventItems.filter((item) => item.type === "Trip");
  const foods = eventItems.filter((item) => item.type === "Food");
  const tours = eventItems.filter((item) => item.type === "Tours");

  return (
    <div className="min-h-screen bg-white dark:bg-[#050a12] text-slate-900 dark:text-white selection:bg-[#d9a321] pb-24 md:pb-10 transition-colors duration-300">
      {/* --- PC HEADER --- */}
      <header className="hidden md:flex items-center justify-between px-10 py-4 bg-white/80 dark:bg-[#050a12]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 sticky top-0 z-50">
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={() => router.push("/dashboard")}
        >
          <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-bold text-xl text-[#d9a321] italic tracking-tighter uppercase">
            XcelTravel
          </span>
        </div>

        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-gray-400">
          <button
            onClick={() => router.push("/dashboard")}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push("/events")}
            className="text-[#d9a321] border-b-2 border-[#d9a321] pb-1 font-bold"
          >
            Events
          </button>
          <button
            onClick={() => router.push("/wallet")}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Wallet
          </button>
          <button
            onClick={() => router.push("/social")}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Social
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Profile
          </button>
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500"
              size={14}
            />
            <input
              type="text"
              placeholder="Search..."
              className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10  py-1.5 pl-9 pr-4 text-xs text-slate-900 dark:text-white outline-none w-48 focus:border-[#d9a321] transition-all"
            />
          </div>
          <Bell
            className="text-slate-400 dark:text-gray-500 cursor-pointer hover:text-[#d9a321]"
            size={20}
          />
          <div
            className="w-9 h-9 border-2 border-[#f8f6f2] p-0.5 overflow-hidden rounded-full cursor-pointer"
            onClick={() => router.push("/profile")}
          >
            <img
              src="https://i.pravatar.cc/150?u=xcel"
              alt="Profile"
              className="l w-full h-full rounded-full  object-cover"
            />
          </div>
        </div>
      </header>

      {/* --- MOBILE TOP BAR --- */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/10 bg-white dark:bg-[#050a12] sticky top-0 z-50">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
          {" "}
          <img src="/logo.png" alt="Logo" />{" "}
        </div>
        <span className="font-bold text-[#d9a321] italic tracking-tighter uppercase">
          XcelTravel
        </span>
        <Bell className="text-slate-400 dark:text-gray-400" size={20} />
      </header>

      {/* --- PAGE CONTENT --- */}
      <main className="max-w-7xl mx-auto p-4 md:p-10">
        <section className="mb-10 px-2 md:px-0">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2 text-slate-900 dark:text-white">
            Explore
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm italic">
            Discover premium Web3 trips, food, and tours.
          </p>
        </section>

        {/* --- 1. PC ONLY LAYOUT --- */}
        <div className="hidden md:block">
          <div className="flex gap-4 mb-8">
            {["Trip", "Food", "Tours"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === filter
                    ? "bg-[#d9a321] text-black shadow-lg"
                    : "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-500"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-6">
            {eventItems
              .filter((item) => item.type === activeFilter)
              .map((item) => (
                <EventCard key={item.id} {...item} />
              ))}
          </div>
        </div>

        {/* --- 2. MOBILE ONLY LAYOUT --- */}
        <div className="md:hidden space-y-12">
          <section>
            <h2 className="text-xl font-black italic uppercase tracking-tighter mb-4 px-2 border-l-4 border-[#d9a321] pl-4 text-slate-900 dark:text-white">
              Featured Trips
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-4 px-2 scrollbar-hide snap-x">
              {trips.map((item) => (
                <EventCard key={item.id} {...item} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black italic uppercase tracking-tighter mb-4 px-2 border-l-4 border-[#d9a321] pl-4 text-slate-900 dark:text-white">
              Popular Food
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-4 px-2 scrollbar-hide snap-x">
              {foods.map((item) => (
                <EventCard key={item.id} {...item} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black italic uppercase tracking-tighter mb-4 px-2 border-l-4 border-[#d9a321] pl-4 text-slate-900 dark:text-white">
              Adventure Tours
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-4 px-2 scrollbar-hide snap-x">
              {tours.map((item) => (
                <EventCard key={item.id} {...item} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#050a12]/95 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 px-2 py-4 z-50">
        <div className="grid grid-cols-5 items-center justify-items-center">
          <MobileTab
            icon={<Home size={20} />}
            label="Home"
            active={pathname === "/dashboard"}
            onClick={() => router.push("/dashboard")}
          />
          <MobileTab
            icon={<Calendar size={20} />}
            label="Events"
            active={pathname === "/events"}
            onClick={() => router.push("/events")}
          />
          <MobileTab
            icon={<Wallet size={20} />}
            label="Wallet"
            active={pathname === "/wallet"}
            onClick={() => router.push("/wallet")}
          />
          <MobileTab
            icon={<Users size={20} />}
            label="Social"
            active={pathname === "/social"}
            onClick={() => router.push("/social")}
          />
          <div
            onClick={() => router.push("/profile")}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div
              className={`w-7 h-7 rounded-full border-2 transition-all ${pathname === "/profile" ? "border-[#d9a321]" : "border-slate-200 dark:border-gray-600"}`}
            >
              <img
                src="https://i.pravatar.cc/150?u=xcel"
                alt="Me"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span
              className={`text-[9px] font-black uppercase tracking-tighter ${pathname === "/profile" ? "text-[#d9a321]" : "text-slate-400 dark:text-gray-500"}`}
            >
              Me
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
}

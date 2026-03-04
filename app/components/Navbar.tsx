"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Events", href: "/events" },
    { label: "Wallet", href: "/wallet" },
    { label: "Social", href: "/social" },
    { label: "Profile", href: "/profile" },
  ];

  return (
    <>
      {/* DESKTOP NAVBAR */}
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
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <button
                key={link.label}
                onClick={() => router.push(link.href)}
                className={
                  isActive
                    ? "text-[#d9a321] border-b-2 border-[#d9a321] pb-1 font-bold"
                    : "hover:text-slate-900 dark:hover:text-white transition-colors"
                }
              >
                {link.label}
              </button>
            );
          })}
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
              className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs text-slate-900 dark:text-white outline-none w-48 focus:border-[#d9a321] transition-all"
            />
          </div>
          <Bell
            className="text-slate-400 dark:text-gray-500 cursor-pointer hover:text-[#d9a321]"
            size={20}
          />
          <div
            className="w-9 h-9 rounded-full border-2 border-[#d9a321] p-0.5 overflow-hidden cursor-pointer"
            onClick={() => router.push("/profile")}
          >
            <img
              src="https://i.pravatar.cc/150?u=xcel"
              alt="Profile"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/10 bg-white dark:bg-[#050a12] sticky top-0 z-50">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
          <img src="/logo.png" alt="Logo" />
        </div>
        <span className="font-bold text-[#d9a321] italic tracking-tighter uppercase">
          XcelTravel
        </span>
        <Bell className="text-slate-400 dark:text-gray-400" size={20} />
      </header>
    </>
  );
}

"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Wallet, Users, Calendar } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const MobileTab = ({
    icon,
    label,
    active,
    onClick,
  }: {
    icon: React.ReactElement;
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
        active ? "text-[#d9a321]" : "text-slate-400 dark:text-gray-500"
      }`}
    >
      {React.cloneElement(icon as any, { strokeWidth: active ? 3 : 2 })}
      <span className="text-[9px] font-black uppercase tracking-tighter">
        {label}
      </span>
    </div>
  );

  return (
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
          active={pathname === "/social" || pathname?.startsWith("/social/")}
          onClick={() => router.push("/social")}
        />
        <div
          onClick={() => router.push("/profile")}
          className="flex flex-col items-center gap-1 cursor-pointer"
        >
          <div
            className={`w-7 h-7 rounded-full border-2 transition-all overflow-hidden ${
              pathname === "/profile"
                ? "border-[#d9a321]"
                : "border-slate-200 dark:border-gray-600"
            }`}
          >
            <img
              src="https://i.pravatar.cc/150?u=xcel"
              alt="Me"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span
            className={`text-[9px] font-black uppercase tracking-tighter ${
              pathname === "/profile"
                ? "text-[#d9a321]"
                : "text-slate-400 dark:text-gray-500"
            }`}
          >
            Me
          </span>
        </div>
      </div>
    </nav>
  );
}

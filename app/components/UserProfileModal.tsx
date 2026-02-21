"use client";
import { X, MapPin, Shield, CheckCircle2, Wallet, Calendar } from "lucide-react";

export default function UserProfileModal({ isOpen, onClose, user }: any) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-[#050a12] w-full h-[90vh] md:h-auto md:max-h-[85vh] max-w-md rounded-t-[40px] md:rounded-[40px] border border-slate-200 dark:border-white/10 shadow-2xl relative animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 flex flex-col overflow-hidden">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors z-10 bg-black/20 p-2 rounded-full backdrop-blur-md">
          <X size={20} />
        </button>

        {/* Header Background */}
        <div className="h-32 w-full bg-gradient-to-r from-slate-900 to-slate-800 relative">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-8 flex-1 overflow-y-auto -mt-12 relative">
          
          {/* Avatar & Status */}
          <div className="flex justify-between items-end mb-4">
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-[#050a12] shadow-lg" />
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md border-2 border-white dark:border-[#050a12]">
                Online
              </div>
            </div>
          </div>

          {/* Name & Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-black flex items-center gap-2">
              {user.name} 
              <CheckCircle2 size={18} className="text-blue-500" />
            </h2>
            <p className="text-sm font-semibold text-slate-500 flex items-center gap-1 mt-1">
              <MapPin size={14} /> 1.2 km away
            </p>
          </div>

          {/* TRAILSCORE: The Web3 Reputation Badge */}
          <div className="bg-gradient-to-r from-[#d9a321]/20 to-amber-500/10 border border-[#d9a321]/30 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[#d9a321] rounded-full flex items-center justify-center text-black shadow-lg shadow-[#d9a321]/40">
                <Shield size={20} className="fill-black/20" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#d9a321]">TrailScore</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Gold Traveler</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-[#d9a321]">8,450</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Points</p>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">About</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {user.bio}
            </p>
          </div>

          {/* Web3 Identity & Mutuals */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
              <Wallet size={16} className="text-purple-500" />
              Verified Web3 Wallet
              <span className="ml-auto text-xs font-mono text-slate-400">0x...a4B2</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
              <Calendar size={16} className="text-blue-500" />
              Mutual Events
              <span className="ml-auto text-xs font-bold text-slate-400">{user.mutual}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 py-3.5 bg-[#d9a321] hover:brightness-110 text-black font-black rounded-xl transition-all shadow-lg shadow-[#d9a321]/20">
              Send Request
            </button>
            <button className="flex-1 py-3.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white font-black rounded-xl transition-all">
              Message
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
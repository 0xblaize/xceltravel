"use client";
import { useState } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Image as ImageIcon,
  Send,
  Shield,
  MapPin,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function TrailTalkRoom() {
  const [newMessage, setNewMessage] = useState("");

  // Mock Messages Data
  const messages = [
    {
      id: "m1",
      type: "system" as const,
      text: "You have securely joined the Lekki Web3 Founders Lounge. Your presence is verified.",
      time: "10:00 AM",
    },
    {
      id: "m2",
      type: "user" as const,
      senderId: "user1",
      name: "Alice Johnson",
      avatar: "https://i.pravatar.cc/150?u=alice",
      text: "Hey everyone! Is anyone already at the venue?",
      time: "10:05 AM",
      reputation: "Gold",
      isMe: false,
    },
    {
      id: "m3",
      type: "user" as const,
      senderId: "user2",
      name: "David Chen",
      avatar: "https://i.pravatar.cc/150?u=david",
      text: "Yeah, I'm near the front bar. The WiFi is a bit spotty but the vibe is great.",
      time: "10:08 AM",
      reputation: "Silver",
      isMe: false,
    },
    {
      id: "m4",
      type: "user" as const,
      senderId: "me",
      name: "You",
      avatar: "https://i.pravatar.cc/150?u=me",
      text: "Awesome, I'm walking over from phase 1 now. See you in 5!",
      time: "10:12 AM",
      reputation: "Gold",
      isMe: true,
    },
  ];

  const getShieldColor = (rank: string) => {
    if (rank === "Gold") return "text-[#d9a321]";
    if (rank === "Silver") return "text-slate-400";
    return "text-amber-700"; // Bronze
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#050a12] text-slate-900 dark:text-white font-sans">
      {/* 1. ROOM HEADER */}
      <div className="bg-white dark:bg-[#050a12] border-b border-slate-200 dark:border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button className="h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center transition-colors">
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="font-black text-lg flex items-center gap-2">
              Lekki Founders Lounge
              <CheckCircle2 size={16} className="text-blue-500" />
            </h1>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              <span className="flex items-center gap-1 text-green-500">
                <MapPin size={12} /> Verified Nearby
              </span>
              <span className="flex items-center gap-1">
                <Users size={12} /> 142 Active
              </span>
            </div>
          </div>
        </div>

        <button className="h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center transition-colors text-slate-500">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* 2. CHAT MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => {
          // System Message
          if (msg.type === "system") {
            return (
              <div key={msg.id} className="flex justify-center my-6">
                <span className="bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 text-xs font-bold px-4 py-1.5 rounded-full text-center max-w-[80%]">
                  {msg.text}
                </span>
              </div>
            );
          }

          // User Messages (Me vs Them)
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              {!msg.isMe && (
                <img
                  src={msg.avatar}
                  alt={msg.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-white/5 shadow-sm self-end mb-1"
                />
              )}

              {/* Message Bubble */}
              <div
                className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"} max-w-[75%]`}
              >
                {/* Name & Reputation (Only show for others) */}
                {!msg.isMe && (
                  <div className="flex items-center gap-1.5 mb-1 pl-1">
                    <span className="text-xs font-bold text-slate-500">
                      {msg.name}
                    </span>
                    <Shield
                      size={12}
                      className={getShieldColor(msg.reputation ?? "Bronze")}
                    />
                  </div>
                )}

                {/* The Bubble */}
                <div
                  className={`p-4 shadow-sm ${
                    msg.isMe
                      ? "bg-[#d9a321] text-black rounded-2xl rounded-tr-none"
                      : "bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl rounded-tl-none"
                  }`}
                >
                  <p className="text-sm font-medium leading-relaxed">
                    {msg.text}
                  </p>
                </div>

                {/* Timestamp */}
                <span className="text-[10px] font-bold text-slate-400 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. INPUT AREA */}
      <div className="bg-white dark:bg-[#050a12] border-t border-slate-200 dark:border-white/10 p-4 pb-8 md:pb-4">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <button className="h-12 w-12 shrink-0 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 transition-colors">
            <ImageIcon size={20} />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message Lekki Founders Lounge..."
              className="w-full h-12 bg-slate-100 dark:bg-white/5 border-none rounded-full pl-5 pr-12 text-sm focus:ring-2 focus:ring-[#d9a321] outline-none placeholder:text-slate-400"
            />
            {newMessage.trim().length > 0 && (
              <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-[#d9a321] rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform">
                <Send size={14} className="ml-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

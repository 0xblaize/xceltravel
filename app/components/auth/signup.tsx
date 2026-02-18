"use client";
import { Mail, Lock, EyeOff, User } from "lucide-react";
import Link from "next/link";

export default function Signup() {
  return (
    /* Changed: Fixed max-w syntax and reduced size to 400px. Added mx-auto for desktop centering */
    <div className="w-full  bg-white rounded-[40px] shadow-2xl p-8 md:p-10">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-black mb-2 ">Welcome.</h1>
        <p className="text-gray-400 text-lg font-medium">Create an account</p>
      </header>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-700 uppercase tracking-tight">Username</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Input user name" 
              className="w-full p-3.5 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#d9a321] transition-all" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-700 uppercase tracking-tight">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="email" 
              placeholder="example.email@gmail.com" 
              className="w-full p-3.5 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#d9a321] transition-all" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-700 uppercase tracking-tight">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="password" 
              placeholder="Enter at least 8+ characters" 
              className="w-full p-3.5 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#d9a321] transition-all" 
            />
            <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" size={18} />
          </div>
        </div>

        <button className="w-full bg-[#d9a321] hover:bg-[#b88a1c] text-white font-bold py-4 rounded-2xl text-md mt-4 shadow-lg shadow-yellow-100 transition-all active:scale-95">
          Sign up
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500 font-medium">
        Already have an account? <Link href="/login" className="text-[#d9a321] font-bold hover:underline">Log in</Link>
      </p>
    </div>
  );
}
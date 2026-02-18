"use client";
import { Mail, Lock, EyeOff } from "lucide-react";
import Link from "next/link";

export default function Login() {
  return (
    <div className="w-full max-w-480px bg-white rounded-[40px] shadow-2xl p-8 md:p-12">
      <header className="mb-10">
        <h1 className="text-5xl font-bold text-black mb-2">Hello.</h1>
        <p className="text-gray-400 text-xl font-medium">Welcome back</p>
      </header>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 uppercase tracking-tight">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="Enter email" 
              className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#d9a321] transition-all" 
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-tight">Password</label>
            <Link href="#" className="text-sm font-bold text-[#d9a321] hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Enter password" 
              className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#d9a321]" 
            />
            <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" size={20} />
          </div>
        </div>

        <button className="w-full bg-[#d9a321] hover:bg-[#b88a1c] text-white font-bold py-5 rounded-2xl text-lg mt-4 shadow-lg shadow-yellow-100 transition-all active:scale-95">
          Sign In
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-gray-500 font-medium">
          Don't have an account? <Link href="/signup" className="text-[#d9a321] font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
"use client";
import { useState } from "react";
import { Mail, Lock, EyeOff, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isLogin = mode === "login";
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: username });

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          username: username,
          email: email,
          level: 1,
          friendsCount: 128, 
          totalBalance: 1250.75, 
          createdAt: new Date(),
        });
      }
      
      router.push("/dashboard"); 
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: user.displayName,
        email: user.email,
        level: 1,
        friendsCount: 128,
        totalBalance: 1250.75,
        createdAt: new Date(),
      }, { merge: true });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full transition-all">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-black mb-1">
          {isLogin ? "Hello" : "Welcome"}
        </h1>
        <p className="text-gray-400 text-lg font-medium">
          {isLogin ? "Welcome back" : "Create an account"}
        </p>
      </header>

      {error && <p className="text-red-500 text-xs mb-4 font-semibold">{error}</p>}

      <form className="space-y-3.5" onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700 uppercase">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="User name" 
                className="w-full p-3 pl-11 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#d9a321]" 
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold mb-1 text-gray-700 uppercase">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email" 
              className="w-full p-3 pl-11 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#d9a321]" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 text-gray-700 uppercase">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" 
              className="w-full p-3 pl-11 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#d9a321]" 
            />
            <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" size={18} />
          </div>
        </div>

        <button 
          disabled={loading}
          type="submit"
          className="w-full bg-[#d9a321] hover:bg-[#b88a1c] text-white font-bold py-3.5 rounded-xl text-md mt-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <span className="relative px-3 text-[10px] font-bold uppercase text-gray-400 bg-white">OR CONTINUE WITH</span>
        </div>
        
        <div className="flex justify-center gap-4">
          <button onClick={handleGoogleSignIn} type="button" className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors bg-white">
            <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-5 h-5" alt="Google" />
          </button>
          <button type="button" className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 bg-white">
            <img src="https://www.svgrepo.com/show/303114/facebook-3-logo.svg" className="w-5 h-5" alt="Facebook" />
          </button>
          <button type="button" className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 bg-white">
            <img src="https://www.svgrepo.com/show/303110/apple-black-logo.svg" className="w-5 h-5" alt="Apple" />
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500 font-medium">
        {isLogin ? "New here? " : "Already have an account? "}
        <Link href={isLogin ? "/signup" : "/login"} className="text-[#d9a321] font-bold hover:underline">
          {isLogin ? "Sign up" : "Log in"}
        </Link>
      </p>
    </div>
  );
}
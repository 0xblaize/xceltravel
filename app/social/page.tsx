"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserProfileModal from "../components/UserProfileModal";
import {
  geohashForLocation,
  geohashQueryBounds,
  distanceBetween,
} from "geofire-common";
import {
  collection,
  query,
  orderBy,
  startAt,
  endAt,
  getDocs,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  Search,
  Bell,
  MapPin,
  Calendar,
  Heart,
  Check,
  X,
  MessageSquare,
  User,
  Users,
} from "lucide-react";

export default function SocialPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Nearby" | "Events" | "Interests">(
    "Nearby",
  );
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number | null;
    lng: number | null;
    hash: string | null;
  }>({ lat: null, lng: null, hash: null });

  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // ========== GEOLOCATION ==========
  const findMyRealLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const hash = geohashForLocation([lat, lng]);
          setUserLocation({ lat, lng, hash });
        },
        (error) => {
          console.error("User denied location access.", error);
        },
      );
    }
  };

  // ========== GEO-QUERY ==========
  const findNearbyRooms = async (lat: number, lng: number) => {
    const center: [number, number] = [lat, lng];
    const radiusInM = 5000;
    const bounds = geohashQueryBounds(center, radiusInM);
    const promises = [];

    for (const b of bounds) {
      const q = query(
        collection(db, "trail_rooms"),
        orderBy("geohash"),
        startAt(b[0]),
        endAt(b[1]),
      );
      promises.push(getDocs(q));
    }

    const snapshots = await Promise.all(promises);
    const matchingRooms: any[] = [];

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const roomData = doc.data();
        const distanceInKm = distanceBetween([roomData.lat, roomData.lng], center);
        if (distanceInKm * 1000 <= radiusInM) {
          matchingRooms.push({
            id: doc.id,
            ...roomData,
            distance: distanceInKm.toFixed(1) + " km away",
          });
        }
      }
    }
    return matchingRooms;
  };

  // ========== ROOM CREATION ==========
  const createTrailTalkRoom = async (
    roomName: string,
    lat: number,
    lng: number,
    requiredReputation: string,
  ) => {
    try {
      const hash = geohashForLocation([lat, lng]);
      const roomData = {
        name: roomName,
        geohash: hash,
        lat: lat,
        lng: lng,
        activeUsers: 1,
        reputationRequired: requiredReputation,
        isVerified: false,
        createdAt: serverTimestamp(),
        creatorId: "current_user_id",
      };
      await addDoc(collection(db, "trail_rooms"), roomData);
    } catch (error) {
      console.error("Error creating room: ", error);
    }
  };

  // ========== FIREBASE REAL-TIME USERS (CLEANED) ==========
  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedUsers = snapshot.docs.map((doc) => {
          const data = doc.data();
          
        
          const displayName = data.name || (data.wallet_address ? `${data.wallet_address.slice(0, 6)}...` : null);
          
          if (!displayName) return null;

          return {
            id: doc.id,
            name: displayName,
            status: data.status || "offline",
            bio: data.bio || "",
            tags: Array.isArray(data.tags) ? data.tags : [],
            mutual: data.mutual || 0,
            avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`,
          };
        }).filter(user => user !== null);

        setUsersList(fetchedUsers as any[]);
        setIsLoadingUsers(false);
      },
      (error) => {
        console.error("Error fetching users:", error);
        setIsLoadingUsers(false);
      },
    );
    return () => unsubscribe();
  }, []);

  // ========== SIDEBAR LOGIC (REAL DATA ONLY) ==========
  const pendingRequests = usersList.length > 0 ? usersList.slice(0, 3).map((u) => ({
    id: u.id + "_req",
    name: u.name,
    time: "Recently joined",
    avatar: u.avatar,
    status: u.status,
  })) : [];

  const suggestedPeople = usersList.length > 3 ? usersList.slice(3, 7).map((u) => ({
    id: u.id + "_sug",
    name: u.name,
    mutual: (u.mutual || 0) + " mutual connections",
    avatar: u.avatar,
    status: u.status,
  })) : [];

  const getStatusColor = (status: string) => {
    if (status === "online") return "bg-green-500";
    if (status === "away") return "bg-yellow-400";
    return "bg-slate-400";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050a12] text-slate-900 dark:text-white pb-24 md:pb-0 font-sans">
      
      {/* DESKTOP NAVBAR */}
      <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-white dark:bg-[#050a12] border-b border-slate-200 dark:border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-2 text-[#d9a321] font-black text-xl">
          <div className="h-8 w-8 rounded-full border-2 border-[#d9a321] flex items-center justify-center">🌐</div>
          XcelTravel
        </div>

        <div className="flex items-center gap-8 font-semibold text-sm text-slate-500">
          <button className="text-[#d9a321] flex items-center gap-2"><Users size={18} /> Social</button>
          <button className="hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors"><MapPin size={18} /> Events</button>
          <button onClick={() => router.push("/social/room")} className="hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors"><MessageSquare size={18} /> My Rooms</button>
          <button className="hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors"><User size={18} /> Profile</button>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search..." className="bg-slate-100 dark:bg-white/5 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#d9a321] outline-none" />
          </div>
          <button className="text-slate-400 hover:text-[#d9a321]"><Bell size={20} /></button>
          <img src="https://i.pravatar.cc/150?u=me" alt="Me" className="w-9 h-9 rounded-full object-cover border-2 border-slate-200" />
        </div>
      </nav>

      {/* MOBILE TOP HEADER */}
      <div className="md:hidden flex items-center justify-between p-5 bg-white dark:bg-[#050a12] border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2 text-[#d9a321] font-black text-xl">
          <div className="h-8 w-8 rounded-full border-2 border-[#d9a321] flex items-center justify-center">🌐</div>
          XcelTravel
        </div>
        <img src="https://i.pravatar.cc/150?u=me" alt="Me" className="w-10 h-10 rounded-full object-cover border-2 border-slate-200" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row w-full">
        {/* LEFT CONTENT */}
        <div className="flex-1 p-5 md:p-8 border-r border-slate-200 dark:border-white/10">
          
          <div className="md:hidden relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search profiles..." className="w-full bg-slate-200/60 dark:bg-white/5 border-none rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#d9a321] outline-none font-medium" />
          </div>

          <div className="hidden md:block mb-8">
            <h1 className="text-2xl font-bold mb-6">Discover Connections</h1>
            <div className="flex gap-3">
              <button onClick={() => setActiveTab("Nearby")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "Nearby" ? "bg-[#d9a321] text-black shadow-md" : "border border-slate-200 text-slate-600 hover:bg-slate-100"}`}><MapPin size={16} /> Nearby</button>
              <button onClick={() => setActiveTab("Events")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "Events" ? "bg-[#d9a321] text-black shadow-md" : "border border-slate-200 text-slate-600 hover:bg-slate-100"}`}><Calendar size={16} /> Events</button>
              <button onClick={() => setActiveTab("Interests")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "Interests" ? "bg-[#d9a321] text-black shadow-md" : "border border-slate-200 text-slate-600 hover:bg-slate-100"}`}><Heart size={16} /> Interests</button>
            </div>
          </div>

          {/* USER GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoadingUsers ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-[#d9a321] animate-spin mb-4"></div>
                <p className="text-slate-500 font-bold text-sm">Fetching real explorers...</p>
              </div>
            ) : usersList.length === 0 ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
                <Users size={40} className="text-slate-300 mb-4" />
                <p className="text-slate-500 font-bold text-sm text-center px-10">No users found in your area yet. Be the first to invite friends!</p>
              </div>
            ) : (
              usersList.map((user) => (
                <div key={user.id} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col">
                  <div className="flex flex-row md:flex-col items-center gap-4 md:gap-0">
                    <div className="relative">
                      <img src={user.avatar} alt={user.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover" />
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-[#050a12] ${getStatusColor(user.status)}`}></div>
                    </div>
                    <div className="md:mt-4 md:text-center">
                      <h3 className="font-bold text-lg">{user.name}</h3>
                      <p className="md:hidden text-xs font-semibold text-slate-500 capitalize">{user.status}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 md:text-center line-clamp-2 flex-1">{user.bio}</p>

                  <div className="flex flex-wrap gap-2 mt-4 md:justify-center">
                    {user.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-md text-[10px] font-bold">{tag}</span>
                    ))}
                  </div>

                  <div className="hidden md:flex items-center justify-center gap-2 mt-4 text-xs font-bold text-slate-500">
                    <Calendar size={14} /> {user.mutual} Mutual Events
                  </div>

                  <button onClick={() => setSelectedUser(user)} className="mt-5 w-full py-3 bg-[#d9a321] hover:brightness-110 text-black font-bold rounded-xl transition-all text-sm">Connect</button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden lg:block w-80 p-8 shrink-0">
          {pendingRequests.length > 0 && (
            <div className="mb-10">
              <h3 className="font-bold text-lg mb-4">Pending Requests</h3>
              <div className="space-y-5">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={req.avatar} alt="" className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="text-sm font-bold">{req.name}</p>
                        <p className="text-xs text-slate-500">{req.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="h-8 w-8 rounded-full border border-green-200 text-green-500 flex items-center justify-center hover:bg-green-50"><Check size={14} /></button>
                      <button className="h-8 w-8 rounded-full border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50"><X size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {suggestedPeople.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-4">People You May Know</h3>
              <div className="space-y-5">
                {suggestedPeople.map((person) => (
                  <div key={person.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={person.avatar} alt="" className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="text-sm font-bold">{person.name}</p>
                        <p className="text-[10px] text-slate-500">{person.mutual}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 border border-slate-200 hover:border-[#d9a321] hover:text-[#d9a321] rounded-lg text-xs font-bold transition-all">Connect</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM NAVBAR */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#050a12] border-t border-slate-200 dark:border-white/10 flex justify-between px-6 py-4 z-50">
        <button className="flex flex-col items-center gap-1 text-[#d9a321]"><Users size={20} /><span className="text-[10px] font-bold">Social</span></button>
        <button className="flex flex-col items-center gap-1 text-slate-400"><MapPin size={20} /><span className="text-[10px] font-bold">Events</span></button>
        <button className="flex flex-col items-center gap-1 text-slate-400" onClick={() => router.push("/social/room")}><MessageSquare size={20} /><span className="text-[10px] font-bold">My Rooms</span></button>
        <button className="flex flex-col items-center gap-1 text-slate-400"><User size={20} /><span className="text-[10px] font-bold">Profile</span></button>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button
        onClick={() => createTrailTalkRoom("Lekki Web3 Founders Lounge", 6.4474, 3.4723, "Bronze")}
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 bg-[#d9a321] text-black h-14 px-6 rounded-full font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 z-40"
      >
        <div className="text-2xl">+</div> Create Hub
      </button>

      <UserProfileModal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} user={selectedUser} />
    </div>
  );
}
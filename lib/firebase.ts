// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmmj0m86jF70pfwXaoxBi7414cXWX_3po",
  authDomain: "xcel-travel.firebaseapp.com",
  projectId: "xcel-travel",
  storageBucket: "xcel-travel.firebasestorage.app",
  messagingSenderId: "316975239173",
  appId: "1:316975239173:web:b4bf6e9edb7188edf10c6c",
  measurementId: "G-ZG5E07P5W5"
};

// 1. Initialize Firebase (Singleton pattern to prevent duplicate apps)
// This checks if an app already exists before initializing a new one.
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 2. Initialize Auth
const auth = getAuth(app);


// 3. Initialize Analytics safely (Client-side only)
// This prevents the "window is not defined" error.
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
export const db = getFirestore(app);
export { app, analytics, auth };
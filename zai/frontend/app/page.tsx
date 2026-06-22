"use client";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, logout, signInWithGoogle } from "../utils/firebase";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-6">🚀 AI SaaS Platform</h1>
      {!user ? (
        <button
          onClick={signInWithGoogle}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow"
        >
          Sign in with Google
        </button>
      ) : (
        <>
          <p>Welcome, {user.displayName}</p>
          <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}

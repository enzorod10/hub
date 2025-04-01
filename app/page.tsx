'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import GoogleSignIn from "@/components/google-sign-in";

export default function Home() {
  
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Your Hub</h1>
        <p className="text-lg text-gray-600 mt-2">Your one-stop solution to everything.</p>
      </header>
      <main className="text-center">
        <GoogleSignIn />

      </main>
      <footer className="mt-12 text-gray-500 text-sm">
        © {new Date().getFullYear()} Your Hub. All rights reserved.
      </footer>
    </div>
  );
}
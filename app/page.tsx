'use client';

import { useEffect } from "react";
import GoogleSignIn from "@/components/google-sign-in";
import { useSessionContext } from "@/context/SessionContext";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useSessionContext();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [loading, user, router]);

  if (loading) return null; // or a spinner

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
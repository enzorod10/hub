"use client";

import { signInWithGoogle } from '@/app/actions/sign-in-with-google';
import { useSessionContext } from '@/context/SessionContext';

export default function GoogleSignIn() {
  const { updateSession } = useSessionContext();
  const handleLogin = async () => {
    console.log("Redirecting to:");
    const url = await signInWithGoogle(); 
  };

  return (
    <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded">
      Sign in with Google
    </button>
  );
}
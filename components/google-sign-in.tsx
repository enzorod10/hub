"use client";

import { createClient } from "@/utils/supabase/client";

export default function GoogleSignIn() {
  const supabase = createClient();
  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:  `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error loging in with Google:", error);
    }
  };

  return (
    <button onClick={loginWithGoogle} className="px-4 py-2 bg-blue-500 text-white rounded">
      Sign in with Google
    </button>
  );
}
'use client';
import { createClient } from "@/utils/supabase/client";
import { useEffect, createContext, useState, useContext, useMemo, useCallback } from "react"
import { User } from "@/app/types";
import { useRouter } from "next/navigation"; // Add this import

const SessionContext = createContext<{ user: User | null, 
  updateSession: () => void, loading: boolean }>(
  ({ user: null, updateSession: () => {}, 
  loading: false}))
  
const supabase = createClient();

export function SessionWrapper({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    setLoading(true);

    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session?.user) {
        setSession(null);
        setLoading(false);
        return;
      }

      const { data: user, error } = await supabase
        .from('profile')
        .select('*, personalization(*), ai_day_analysis(*)')
        .eq('id', session.user.id)
        .single();

      if (!error && user) {
        setSession(user);
      }

      setLoading(false);
    });

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    console.log(session)
    if (!loading && !session) {
      router.replace('/');
    }
  }, [loading, session, router]);

  const updateSession = useCallback(async () => {
    setLoading(true);

    const { data: user, error } = await supabase
      .from('profile')
      .select('*, personalization(*), ai_day_analysis(*)')
      .eq('id', session?.id)
      .single();

    if (!error && user) {
      setSession(user);
    } else {
      console.error("Error fetching user profile:", error);
    }

    setLoading(false);
  }, [session?.id]);

  const contextValue = useMemo(() => ({
    user: session,
    loading,
    updateSession,
  }), [session, loading, updateSession]);

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}
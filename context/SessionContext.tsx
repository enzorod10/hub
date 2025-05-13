'use client';
import { createClient } from "@/utils/supabase/client";
import { useEffect, createContext, useState, useContext } from "react"
import { User } from "@/app/types";

const SessionContext = createContext<{ user: User | null, 
  updateSession: () => void, loading: boolean }>(
  ({ user: null, updateSession: () => {}, 
  loading: false}))
  
const supabase = createClient();

export function SessionWrapper({ children } : {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        setSession(null);
        setLoading(false);
      } else {
        setTimeout(async () => {
          const { data: user, error } = await supabase
            .from('profile')
            .select('*, personalization(*), ai_day_analysis(*)')
            .eq('id', session.user.id)
            .single();
          if (!error && user) {
            setSession(user);
          }
  
          setLoading(false);
        }, 0);
      }
    });
  
    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, []);

  // Function to update user
  const updateSession = async () => {
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
  };

  return (
    <SessionContext.Provider value={{user: session,
     updateSession,
      loading}}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSessionContext() {
  return useContext(SessionContext);
}
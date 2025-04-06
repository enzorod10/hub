'use client';
import { supabase } from "@/lib/supabaseClient";
import { useEffect, createContext, useState, useContext } from "react"
import { User } from "@/app/types";

const SessionContext = createContext<{ user: unknown | null, 
  updateSession: (updatedSession) => void, loading: boolean}>
  ({ user: null, updateSession: () => {}, 
  loading: false});

export function SessionWrapper({ children } : {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.user) {
          setSession(null)
        } else if (session.user){
          const { data: user, error } = await supabase
            .from('profile')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (!error && user){
            setSession(user)
          }
        }
        setLoading(false)
      })

    return () => {
      subscription.data.subscription.unsubscribe()
    }
  }, [])

  // Function to update user
  const updateSession = (newSession) => {
    setSession(newSession);
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
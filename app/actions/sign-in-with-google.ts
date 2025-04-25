'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const signInWithGoogle = async () => {
    const supabase = await createClient();
    const provider = 'google';
    
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `http://localhost:3000/auth/callback`
        },
    })
    if (data.url) {
        redirect(data.url) // use the redirect API for your server framework
    }
}
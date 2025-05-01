import { createClient } from '@/utils/supabase/client';
import { Event } from '@/app/types';

const supabase = createClient();

export async function getEventByDate(userId: string, date: Date): Promise<Event | null> {
  const { data, error } = await supabase
    .from('event')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching event:', error);
    return null;
  }

  return data;
}

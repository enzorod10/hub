import { createClient } from '@/utils/supabase/client';
import { Event } from '@/app/types';

const supabase = createClient();

export async function getEventByDate(userId: string, date: Date): Promise<Event | null> {
  const formattedDate = date.toISOString().split('T')[0]; // '2025-04-20'

  console.log('before supabase')

  const { data, error } = await supabase
    .from('event')
    .select('*')
    .eq('user_id', userId)
    .eq('date', formattedDate)
    .single();

  console.log('after supabase')

  if (error && error.code !== 'PGRST116') {
    console.log('Error getting event by date:', error);
    console.error('Error fetching event:', error);
    return null;
  }

  console.log({data})

  return data;
}

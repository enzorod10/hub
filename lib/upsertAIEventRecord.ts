'use client';
// import { format } from 'date-fns';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

type Role = 'system' | 'user' | 'assistant';

interface Message {
  role: Role;
  content: string;
}

interface AIEventRecordParams {
  user_id: string;
  event_id: string;
  messages: Message[];
  display_messages: Message[];
}

export async function upsertAIEventRecord({
  user_id,
  event_id,
  messages,
  display_messages,
}: AIEventRecordParams) {
  // const formattedDate = format(target_date, 'yyyy-MM-dd');

  // Step 1: Check for existing record
  const { data: existing, error: fetchError } = await supabase
    .from('ai_event_record')
    .select('id')
    .eq('user_id', user_id)
    .eq('event_id', event_id)
    // .eq('target_date', formattedDate)
    .maybeSingle();

  if (fetchError) {
    console.error('Error checking AI record:', fetchError);
    throw fetchError;
  }

  if (existing) {
    // Step 2a: Update existing
    const { data, error } = await supabase
      .from('ai_event_record')
      .update({
        messages,
        display_messages,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Step 2b: Create new
    const { data, error } = await supabase
      .from('ai_event_record')
      .insert({
        event_id,
        user_id,
        // target_date: formattedDate,
        messages,
        display_messages,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
import { startOfDay, endOfDay } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/supabaseServer';

export async function POST(request: NextRequest) {
    const supabase = await createClient();

    try {
        const { title, date, description } = await request.json();
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user_id = user.id;

        const startOfDayDate = startOfDay(new Date(date));
        const endOfDayDate = endOfDay(new Date(date));

        const { data: existingEvent, error: fetchError } = await supabase
            .from('event')
            .select('*')
            .eq('user_id', user_id)
            .gte('date', startOfDayDate.toISOString())
            .lt('date', endOfDayDate.toISOString())
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            return NextResponse.json({ error: 'Failed to check existing event' }, { status: 500 });
        }

        let event;
        if (existingEvent) {
            const { data, error: updateError } = await supabase
                .from('event')
                .update({ title, description })
                .eq('id', existingEvent.id)
                .select()
                .single();

            if (updateError) {
                return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
            }

            event = data;
        } else {
            const { data, error: createError } = await supabase
                .from('event')
                .insert([{ title, date, description, user_id }])
                .select()
                .single();

            if (createError) {
                return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
            }

            event = data;
        }

        return NextResponse.json({ status: 201, event, message: 'success' });
    } catch (error) {
        return NextResponse.json({ status: 500, message: 'error', error: 'Failed to create/update event' });
    }
}

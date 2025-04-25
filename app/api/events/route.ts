import { NextRequest, NextResponse } from 'next/server';
import { startOfDay, endOfDay } from 'date-fns';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
    const supabase = await createClient();

    const year = Number(request.nextUrl.searchParams.get('year'));
    const month = Number(request.nextUrl.searchParams.get('month'));
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user_id = user.id;

    if (!year || !month || !user_id) {
        return NextResponse.json({ error: 'Year, month, and user_id are required' }, { status: 400 });
    }

    try {
        const startDate = new Date(year, month - 1, 1).toISOString();
        const endDate = new Date(year, month, 1).toISOString();

        const { data: events, error } = await supabase
            .from('event')
            .select('*')
            .eq('user_id', user_id)
            .gte('date', startDate)
            .lt('date', endDate);

        if (error) {
            console.error('Fetch error:', error);
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }

        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

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

        const startOfDayDate = startOfDay(new Date(date)).toISOString();
        const endOfDayDate = endOfDay(new Date(date)).toISOString();

        const { data: existingEvent, error: fetchError } = await supabase
            .from('event')
            .select('*')
            .eq('user_id', user_id)
            .gte('date', startOfDayDate)
            .lt('date', endOfDayDate)
            .single();

        let event;

        if (existingEvent) {
            const { data, error: updateError } = await supabase
                .from('event')
                .update({ title, description })
                .eq('id', existingEvent.id)
                .select()
                .single();

            if (updateError) {
                console.error('Update error:', updateError);
                return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
            }

            event = data;
        } else {
            const { data, error: createError } = await supabase
                .from('event')
                .insert([{ title, date, description, user_id: user_id }])
                .select()
                .single();

            if (createError) {
                console.error('Create error:', createError);
                return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
            }

            event = data;
        }

        return NextResponse.json({ status: 201, event, message: 'success' });
    } catch (error) {
        console.error('Error creating/updating event:', error);
        return NextResponse.json({ status: 500, message: 'error', error: 'Failed to create/update event' });
    }
}

export async function DELETE(request: NextRequest) {
    const supabase = await createClient();

    try {
        const { date } = await request.json();
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user_id = user.id;

        const startOfDayDate = startOfDay(new Date(date)).toISOString();
        const endOfDayDate = endOfDay(new Date(date)).toISOString();

        const { error: deleteError } = await supabase
            .from('event')
            .delete()
            .eq('user_id', user_id)
            .gte('date', startOfDayDate)
            .lt('date', endOfDayDate);

        if (deleteError) {
            console.error('Delete error:', deleteError);
            return NextResponse.json({ status: 500, message: 'error', error: 'Failed to delete event' });
        }

        return NextResponse.json({ status: 201, message: 'success' });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json({ status: 500, message: 'error', error: 'Failed to delete event' });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
    const year = Number(request.nextUrl.searchParams.get('year'));
    const month = Number(request.nextUrl.searchParams.get('month'));
    const streamerId = Number(request.nextUrl.searchParams.get('streamerId'));

    if (!year || !month || !streamerId) {
        return NextResponse.json({ error: 'Year, month, and streamerId are required' });
    }

    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .eq('streamerId', streamerId)
            .gte('date', startDate.toISOString())
            .lt('date', endDate.toISOString());

        if (error) {
            console.error("Error fetching events:", error.message);
            return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
        }

        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const { title, date, description, streamerId } = await request.json();

        // Get the start and end of the day for the given date
        const startOfDayDate = startOfDay(new Date(date));
        const endOfDayDate = endOfDay(new Date(date));

        // Check if an event already exists for the given date and streamerId
        const { data: existingEvent, error: fetchError } = await supabase
            .from('events')
            .select('*')
            .eq('streamerId', streamerId)
            .gte('date', startOfDayDate.toISOString())
            .lt('date', endOfDayDate.toISOString())
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "No rows found" error
            console.error("Error checking existing event:", fetchError.message);
            return NextResponse.json({ error: 'Failed to check existing event' }, { status: 500 });
        }

        let event;
        if (existingEvent) {
            // Update the existing event
            const { data, error: updateError } = await supabase
                .from('events')
                .update({ title, description })
                .eq('id', existingEvent.id)
                .select()
                .single();

            if (updateError) {
                console.error("Error updating event:", updateError.message);
                return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
            }

            event = data;
        } else {
            // Create a new event
            const { data, error: createError } = await supabase
                .from('events')
                .insert([{ title, date, description, streamerId }])
                .select()
                .single();

            if (createError) {
                console.error("Error creating event:", createError.message);
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
    try {
        // Parse request body
        const { date, streamerId } = await request.json();

        // Get the start and end of the day for the given date
        const startOfDayDate = startOfDay(new Date(date));
        const endOfDayDate = endOfDay(new Date(date));

        const { error } = await supabase
            .from('events')
            .delete()
            .eq('streamerId', streamerId)
            .gte('date', startOfDayDate.toISOString())
            .lt('date', endOfDayDate.toISOString());

        if (error) {
            console.error("Error deleting event:", error.message);
            return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
        }

        return NextResponse.json({ status: 201, message: 'success' });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json({ status: 500, message: 'error', error: 'Failed to delete event' });
    }
}
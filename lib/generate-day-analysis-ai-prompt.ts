'use client';
import { User, Event } from '@/app/types';
import { createClient } from '@/utils/supabase/client';
import { isWithinInterval, subDays, addDays, startOfDay, endOfDay, formatISO } from 'date-fns';

const grabEvents = async (userId: string): Promise<Event[] | null> => {
    const supabase = createClient();
    const today = new Date();

    const rangeStart = startOfDay(subDays(today, 3));
    const rangeEnd = endOfDay(addDays(today, 3));

    // Fetch events within ±3 days range
    const { data: events, error } = await supabase
      .from('event')
      .select('*')
      .eq('user_id', userId)
      .gte('date', formatISO(rangeStart, { representation: 'date' }))
      .lte('date', formatISO(rangeEnd, { representation: 'date' }))
      .order('date', { ascending: true });

    if (error) {
      console.error('[fetch_events_error]', error);
      return null;
    }

    return events;
}

export const generateDayAnalysisPrompt = async ({ user }: { user: User }) => {
  const today = new Date();
  const formattedToday = today.toLocaleDateString('en-CA');

  const events = await grabEvents(user.id)

  // Filter events for the last 3 days, today, and the next 3 days
  const prevDaysSummaries = events?.filter(event =>
    isWithinInterval(event.date, {
      start: startOfDay(subDays(today, 3)),
      end: endOfDay(subDays(today, 1)),
    }) && event.summary
  )
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .map(event => `- ${event.date}: ${event.summary}`)
  .join('\n');

  const todaySummary = events?.filter(event =>
    isWithinInterval(event.date, {
      start: startOfDay(today),
      end: endOfDay(today),
    }) && event.summary
  )
  .map(event => `- ${event.date}: ${event.summary}`)
  .join('\n');

  const nextDaysSummaries = events?.filter(event =>
    isWithinInterval(event.date, {
      start: startOfDay(addDays(today, 1)),
      end: endOfDay(addDays(today, 3)),
    }) && event.summary
  )
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .map(event => `- ${event.date}: ${event.summary}`)
  .join('\n');

  function formatTime12hr(time: string) {
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }

  const employedBlock = user.personalization!.is_employed
  ? `They work from ${formatTime12hr(user.personalization!.work_start)} to ${formatTime12hr(user.personalization!.work_end)}, with a commute of ${user.personalization!.commute_to_work} minutes to work and ${user.personalization!.commute_from_work} minutes from work.`
  : `They are not currently employed.`;

  // Format goals with all fields for the AI prompt
  const goalsList = user.personalization!.goals?.length
    ? user.personalization!.goals.map((g: any, idx: number) => {
        if (typeof g === 'string') {
          return `${idx + 1}. Goal: ${g}`;
        }
        return `${idx + 1}. Goal: ${g.goal}\n   - Timeframe: ${g.timeframe || 'N/A'}\n   - Motivation: ${g.motivation || 'N/A'}\n   - Importance: ${g.importance !== undefined ? g.importance : 'N/A'}\n   - Timeframe Set: ${g.timeframe_set ? new Date(g.timeframe_set).toLocaleDateString('en-CA') : 'N/A'}`;
      }).join('\n')
    : 'none';

  const prompt = `
    You are an AI assistant helping a user start their day with thoughtful, structured insights. Your output will be shown on their personal dashboard.

    Today's date is ${formattedToday} (yyyy-MM-dd)

    Here is some context on the user:
    - Name: ${user.name}
    - Wake Time: ${formatTime12hr(user.personalization!.wake_time)}
    - Sleep Hours: ${user.personalization!.sleep_hours}
    - Focus Duration: ${user.personalization!.focus_duration} minutes (max time for deep work blocks)
    - Task Switching Comfort (1–10): ${user.personalization!.task_switching_comfort}
    - Energy Levels (1–10): Morning: ${user.personalization!.energy_curve?.morning}, Afternoon: ${user.personalization!.energy_curve?.afternoon}, Evening: ${user.personalization!.energy_curve?.evening}
    - Buffer Time Preference: ${user.personalization!.flexible_buffer_time} minutes between activities
    - Break Preferences: Type: ${user.personalization!.break_preferences?.type}, Style: ${user.personalization!.break_preferences?.style}
    - Decision Fatigue Threshold (1–10): ${user.personalization!.decision_fatigue_threshold}
    - Location Flexibility: ${user.personalization!.location_flexibility}
    - Priorities (1–10): Health: ${user.personalization!.priorities.health}, Career: ${user.personalization!.priorities.career}, Social: ${user.personalization!.priorities.social}, Creativity: ${user.personalization!.priorities.creativity}, Rest: ${user.personalization!.priorities.rest}, Learning: ${user.personalization!.priorities.learning}, Family: ${user.personalization!.priorities.family}
    - Personality (1–10): Introvert: ${user.personalization!.personality.introvert}, Structured: ${user.personalization!.personality.structured}, Solo Recharge: ${user.personalization!.personality.solo_recharge}
    - Direction Clarity (1–10): ${user.personalization!.direction_clarity}
    - Preferred Tone: ${user.personalization!.tone}
    - ${employedBlock}
    - Their current goals are:\n${goalsList}

    The last 3 days:
    ${prevDaysSummaries || 'No recorded summary in the last 3 days.'}

    Today's schedule:
    ${todaySummary || 'No recorded summary for today.'}

    The next 3 days:
    ${nextDaysSummaries || 'No recorded summary in the next 3 days.'}

    Based on this context, provide insights that:
    - Consider their energy patterns throughout the day
    - Respect their focus duration and task switching preferences
    - Acknowledge their decision fatigue threshold when suggesting complexity
    - Align with their top priorities and goals
    - Match their preferred communication tone
    - Reference patterns from the past 3 days and upcoming schedule
    - Consider their work situation and constraints

    Return ONLY valid **raw** JSON with no code blocks, backticks, or commentary.
    Do NOT wrap the JSON in triple backticks or format it as a code block.

    {
      "overview": "<a 2-3 sentence general message for the dashboard. Do not include a greeting or address the user directly. Start with meaningful content.>",
      "today_focus": "<highlight of today's top priority/task based on their energy levels and goals>",
      "suggestions": "<personalized suggestion(s) considering their work style and preferences>",
      "encouragement": "<motivational message tailored to their direction clarity and current goals>"
    }`
    .trim();

  console.log({ dayAnalysis: prompt });

  return prompt;
};
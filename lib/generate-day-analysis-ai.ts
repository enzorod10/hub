'use client';
import { User, Event } from '@/app/types';
import { format, isWithinInterval, subDays, addDays, startOfDay, endOfDay } from 'date-fns';

interface GenerateDayAnalysisProps {
  user: User;
  events: Event[];
}

export const generateDayAnalysis = ({ user, events }: GenerateDayAnalysisProps) => {
  const today = new Date();

  // Filter events for the last 3 days, today, and the next 3 days
  const yesterdaySummary = events
    .filter(event =>
      isWithinInterval(event.date, {
        start: startOfDay(subDays(today, 3)),
        end: endOfDay(subDays(today, 1)),
      })
    )
    .map(event => `- ${format(event.date, 'MMM d')}: ${event.summary}`)
    .join('\n');

  const todaySummary = events
    .filter(event =>
      isWithinInterval(event.date, {
        start: startOfDay(today),
        end: endOfDay(today),
      })
    )
    .map(event => `- ${format(event.date, 'HH:mm')}: ${event.summary}`)
    .join('\n');

  const tomorrowTeaser = events
    .filter(event =>
      isWithinInterval(event.date, {
        start: startOfDay(addDays(today, 1)),
        end: endOfDay(addDays(today, 3)),
      })
    )
    .map(event => `- ${format(event.date, 'MMM d')}: ${event.summary}`)
    .join('\n');

  const prompt = `
  You are an AI assistant helping a user start their day with a thoughtful, supportive message. The message will be shown at the top of their dashboard.

    Here is the user context:
    - Name: ${user.name}
    - Personality tone: ${user.personalization.tone}, Traits: {{personality_summary}}
    - Goals: {{top_goals}}
    - Priorities today: {{top_priorities}}
    - Long-term clarity: {{long_term_clarity}}/10
    - Employed: {{is_employed}}, work hours: {{work_start}}–{{work_end}}, commute: {{commute_total_minutes}} min

    Yesterday’s schedule:
    ${yesterdaySummary || 'No events in the last 3 days.'}

    Today’s schedule:
    ${todaySummary || 'No events scheduled for today.'}

    Tomorrow’s major tasks:
    ${tomorrowTeaser || 'No events in the next 3 days.'}

    Write a short, 3–5 sentence message that:
    - Matches their tone
    - Encourages or motivates based on schedule/goals
    - Reflects their mindset or productivity pattern
    - Optionally includes a quote or gentle advice`
    .trim();

  console.log('Generated Day Analysis:', prompt);

  return prompt;
};
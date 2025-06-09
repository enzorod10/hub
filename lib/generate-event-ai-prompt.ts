'use client';
import { User, Event } from '@/app/types';

export const generateSchedulePrompt = (
  user: User,
  targetDate: Date,
  existingEvent: Event | null
) => {
  const userName = user.name || 'your user';
  const formattedTarget = targetDate.toLocaleDateString('en-CA');
  const personalization = user.personalization;

  const targetDayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  console.log(targetDayOfWeek)
  const isWorkDay = personalization?.work_days?.[targetDayOfWeek] ?? false;
  const requiresCommute = personalization?.commute_days?.[targetDayOfWeek] ?? false;

  const employedBlock = personalization?.is_employed
  ? isWorkDay 
    ? `They work from ${personalization?.work_start} to ${personalization?.work_end}${
        requiresCommute 
          ? `, with a commute of ${personalization?.commute_to_work} minutes to work and ${personalization?.commute_from_work} minutes from work to home.`
          : ' (working from home today, no commute).'
      }`
    : `They are employed but not working today.`
  : `They are not currently employed.`;
  // Format goals with all fields for the AI prompt
  const goalsList = personalization?.goals?.length
    ? personalization.goals.map((g: any, idx: number) => {
        if (typeof g === 'string') {
          return `${idx + 1}. Goal: ${g}`;
        }
        return `${idx + 1}. Goal: ${g.goal}\n   - Timeframe: ${g.timeframe || 'N/A'}\n   - Motivation: ${g.motivation || 'N/A'}\n   - Importance: ${g.importance !== undefined ? g.importance : 'N/A'}\n   - Timeframe Set: ${g.timeframe_set ? new Date(g.timeframe_set).toLocaleDateString('en-CA') : 'N/A'}`;
      }).join('\n')
    : 'none';

  const prompt = `
    You are a helpful AI personal assistant for ${userName}.

    The planning date is ${formattedTarget}

    ${existingEvent
      ? `There is an existing schedule for the given day. Update or modify it based on the user's request. Preserve unchanged parts unless the user says otherwise. Here's the current schedule:\n\n${JSON.stringify(existingEvent.schedule)}`
      : `There is currently nothing scheduled for the given day. Please create a full day plan from scratch.`}

      Here is some background about ${userName} to tailor the schedule:
      - Wake Time: ${personalization?.wake_time}
      - Sleep Hours: ${personalization?.sleep_hours}
      - Focus Duration: ${personalization?.focus_duration} minutes (max time for deep work blocks)
      - Task Switching Comfort (1–10): ${personalization?.task_switching_comfort}
      - Energy Levels (1–10): Morning: ${personalization?.energy_curve?.morning}, Afternoon: ${personalization?.energy_curve?.afternoon}, Evening: ${personalization?.energy_curve?.evening}
      - **Energy-based scheduling is critical**: Schedule demanding tasks during peak energy times, light tasks during low energy times.
      - Buffer Time Preference: ${personalization?.flexible_buffer_time} minutes between activities
      - Break Preferences: Type: ${personalization?.break_preferences?.type}, Style: ${personalization?.break_preferences?.style}
      - Decision Fatigue Threshold (1–10): ${personalization?.decision_fatigue_threshold}
      - Location Flexibility: ${personalization?.location_flexibility}
      - Priorities (1–10): Health: ${personalization?.priorities.health}, Career: ${personalization?.priorities.career}, Social: ${personalization?.priorities.social}, Creativity: ${personalization?.priorities.creativity}, Rest: ${personalization?.priorities.rest}, Learning: ${personalization?.priorities.learning}, Family: ${personalization?.priorities.family}
      - Personality (1–10): Introvert: ${personalization?.personality.introvert}, Structured: ${personalization?.personality.structured}, Solo Recharge: ${personalization?.personality.solo_recharge}
      - Direction Clarity (1–10): ${personalization?.direction_clarity}
      - Preferred Tone: ${personalization?.tone}
      ${employedBlock}
      - Their current goals are:\n${goalsList}

      Task:
      - First, generate a short, creative, and fun title for ${userName}'s day.
      - Then, create or update the schedule:
        - Schedule demanding tasks during peak energy times, lighter tasks during low energy times.
        - Create time blocks of 30 minutes minimum (no micro-scheduling)
        - Use general activity descriptions
        - Respect focus duration limits and break preferences
        - Allow natural flow between activities
        - Include appropriate buffer time between activities based on their preference
        - Plan breaks that match their type and style preferences
        - Consider their task switching comfort when planning variety vs consistency
        - Keep decision complexity appropriate for their fatigue threshold
        - Unless explicitly told otherwise, the only activity during work hours is "Work hours". Nothing else. 
        - Make the tone feel ${personalization?.tone}
      - Include the planning date in the format YYYY-MM-DD.
      - Finally, write a 1–2 sentence natural language summary of what the day looks like. Focus on tone, balance of work and rest, and any unique or standout elements.

        Return ONLY valid **raw** JSON with no code blocks, backticks, or commentary.
        Do NOT wrap the JSON in triple backticks or format it as a code block.

      {
        "title": "string",
        "date": "YYYY-MM-DD",
        "schedule": [
          { "time": "8:00 AM", "activity": "Morning jog" },
          { "time": "10:00 AM", "activity": "Work on coding project" },
          ...
        ],
        "summary": "1–2 sentence friendly message summarizing the day"
      }`
    .trim();

    console.log('Generated Schedule Prompt:', prompt);

  return prompt;
};
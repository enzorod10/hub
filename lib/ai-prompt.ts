'use client';
import { User, Event } from '@/app/types';

export const generateSchedulePrompt = (
  user: User,
  targetDate: Date,
  existingEvent: Event | null
) => {
  const userName = user.name || 'your user';
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  const formattedTarget = targetDate.toISOString().split('T')[0];
  const personalization = user.personalization;

  const planningInstruction = today.toDateString() === targetDate.toDateString()
    ? `Today is ${formattedToday}.`
    : `Today is ${formattedToday}.\nThe planning date is ${formattedTarget}.`;

  const employedBlock = personalization.is_employed
    ? `They work from ${personalization.work_start} to ${personalization.work_end}, with a commute of ${personalization.commute_to_work} minutes each way.`
    : `They are not currently employed.`;

  const prompt = `
  You are a helpful AI personal assistant for ${userName}.

  ${planningInstruction}

  ${existingEvent
    ? `There is an existing schedule for the given day. Update or modify it based on the user's request. Preserve unchanged parts unless the user says otherwise. Here's the current schedule:\n\n${existingEvent.description}`
    : `There is currently nothing scheduled for the given day. Please create a full day plan from scratch.`}

  Here is some background about ${userName} to tailor the schedule:
  - Wake Time: ${personalization.wake_time}
  - Sleep Hours: ${personalization.sleep_hours}
  - Most Productive Time: ${personalization.productivity}
  - Priorities (1–10): Health: ${personalization.priorities.health}, Career: ${personalization.priorities.career}, Social: ${personalization.priorities.social}, Creativity: ${personalization.priorities.creativity}, Rest: ${personalization.priorities.rest}
  - Personality (1–10): Introvert: ${personalization.personality.introvert}, Structured: ${personalization.personality.structured}, Solo Recharge: ${personalization.personality.solo_recharge}
  - Long-Term Clarity (1–10): ${personalization.long_term_clarity}
  - Preferred Tone: ${personalization.tone}
  - ${employedBlock}

  Task:
  - First, generate a short, creative, and fun title for ${userName}'s day.
  - Then, create or update the schedule:
    - Align with their energy rhythms and productivity window
    - Reflect their top priorities
    - Respect their work hours (if any)
    - Integrate self-care and recharge time that fits their personality
    - Make the tone feel ${personalization.tone}
  - Include the planning date in the format YYYY-MM-DD.
  - Finally, write a short, friendly message to ${userName}.

  Formatting Instructions:
  - Start with ##TITLE## followed by the title.
  - For the schedule:
    - Start each activity with ##DELIM## followed by the start time.
    - Then another ##DELIM## followed by the activity description.
  - After the schedule, write ##DATE## followed by the planning date.
  - Then, write ##MESSAGE## followed by your short friendly message.

  Only provide the raw title, schedule, date, and message using the delimiters above. No extra commentary.
    `.trim();

  console.log('Generated Schedule Prompt:', prompt);

  return prompt;
};
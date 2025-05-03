'use client';
import { User, Event } from '@/app/types';

export const generateSchedulePrompt = (user: User, targetDate: Date, existingEvent: Event | null) => {
  const userName = user.name || 'your user';
  const today = new Date();
  
  const formattedToday = today.toISOString().split('T')[0]

  const formattedTarget = targetDate.toISOString().split('T')[0]

  const planningInstruction = today.toDateString() === targetDate.toDateString()
  ? `Today is ${formattedToday}.`
  : `Today is ${formattedToday}.\nThe planning date is ${formattedTarget}.`;

  const userInterests = user.interests.map((interest) => interest.name);
  const userObligations = user.obligations.map((o) => o.name)
  const userGoals = user.goals.map((g) => g.name);
  
  const prompt = `
    You are a helpful personal assistant for ${userName}.

    ${planningInstruction}

    ${existingEvent
    ? `There is an existing schedule for the given day. Update or modify it based on the user's request. Preserve unchanged parts unless the user says otherwise. Here's the current schedule:\n\n${existingEvent.description}`
    : `There is currently nothing scheduled for the given day. Please create a full day plan from scratch.`}

    ${userName}'s interests include: ${userInterests.length > 0 ? userInterests.join(', ') : 'none'}.
    Their obligations for that day may include: ${userObligations.length > 0 ? userObligations.join(', ') : 'none'}.
    Their current goals are: ${userGoals.length > 0 ? userGoals.join(', ') : 'none'}.

    Task:
    - First, generate a short, creative, and fun title for ${userName}'s day.
    - Then, create or update the schedule:
      - Integrate their **interests**
      - Respect or include any **obligations**
      - Support their **goals**
    - Include the planning date in the format YYYY-MM-DD.
    - Finally, write a short, friendly message to ${userName}.

    Formatting Instructions:
    - Start with ##TITLE## followed by the title.
    - For the schedule:
      - Start each activity with ##DELIM## followed by the start time.
      - Then another ##DELIM## followed by the activity description.
    - After the schedule, write ##DATE## followed by the planning date.
    - Then, write ##MESSAGE## followed by your short friendly message.

    Example output:

    ##TITLE## Focus and Fun  
    ##DELIM## 8:00 AM ##DELIM## Morning jog  
    ##DELIM## 10:00 AM ##DELIM## Work on coding project  
    ##DELIM## 1:00 PM ##DELIM## Lunch break  
    ##DATE## 2025-04-28  
    ##MESSAGE## Here's your plan! Let me know if you'd like to adjust anything.

    Only provide the raw title, schedule, date, and message using the delimiters above. No extra commentary.
  `.trim();

  console.log('Generated Schedule Prompt:', prompt);

  return prompt;
}
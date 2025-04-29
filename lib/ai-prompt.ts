import { User } from '@/app/types';

export const generateSchedulePrompt = (user: User) => {
  const today = new Date();
  
  const formattedToday = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // const formattedTarget = targetDate.toLocaleDateString('en-US', {
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  // });

  // const planningInstruction = today.toDateString() === targetDate.toDateString()
  // ? `Today is ${formattedToday}.`
  // : `Today is ${formattedToday}.\nThe date to plan for is ${formattedTarget}.`;

return `
You are a helpful personal assistant for ${user.name}.

Today is ${formattedToday}.

${user.name}'s interests include: ${user.interests.join(', ')}.

Task:
- First, generate a short, creative and fun title for ${user.name}'s chosen day. (Example: "Adventure and Creativity Day" or "Relaxed Productive Flow").
- Then, create a realistic daily schedule based on their interests.
- Then, specify the exact planning date in the format YYYY-MM-DD (for example: 2025-04-28).
- Finally, write a short, friendly message from you to ${user.name}.

Use the special delimiters to separate the title, schedule, date, and message.

Formatting Instructions:
- Start with ##TITLE## followed by the title.
- For the schedule:
  - Start each activity with ##DELIM## followed by the start time.
  - Then another ##DELIM## followed by the activity description.
- After the schedule, write ##DATE## followed by the planning date in YYYY-MM-DD format.
- After that, write ##MESSAGE## followed by your short friendly message.
- Only use these delimiters exactly as shown.

Example output:

##TITLE## Focus and Fun  
##DELIM## 8:00 AM ##DELIM## Morning jog  
##DELIM## 10:00 AM ##DELIM## Work on coding project  
##DELIM## 1:00 PM ##DELIM## Lunch break  
##DATE## 2025-04-28  
##MESSAGE## I've made a plan for you! Let me know if you'd like any tweaks.

Only provide the raw title, schedule, date, and message as described above. No extra commentary.
`.trim();
}
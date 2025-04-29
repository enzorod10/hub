'use client';
import { createContext, useState, useContext, Dispatch, SetStateAction } from "react"
import { User, Context } from "@/app/types";
import { generateSchedulePrompt } from "@/lib/ai-prompt";
import { useEventContext } from "./EventContext";

type handleSchedule = (props: { user: User, userMessage: string }) => Promise<void>;

const AiContext = createContext<{ handleSchedule: handleSchedule, context: Context, toggleAi: boolean, setToggleAi: Dispatch<SetStateAction<boolean>> }>(
  { handleSchedule: async () => {}, context: { type: 'schedule', activated: false, messages: [], displayMessages: [], subContext: undefined }, toggleAi: false, setToggleAi: () => {} }
);

export function AiWrapper({ children } : {
  children: React.ReactNode;
}) {
  const [context, setContext] = useState<Context>({ type: 'schedule', activated: false, messages: [], displayMessages: [], subContext: undefined });
  const { addEvent } = useEventContext();

  const [toggleAi, setToggleAi] = useState(false);

  const handleSchedule = async ({ user, userMessage }: { user: User, userMessage: string }) => {
    let messages = [...context.messages, {role: 'user', content: userMessage }];
    
    if (!context.activated){
      messages = [
        { role: "system", content: generateSchedulePrompt(user) },
        { role: "user", content: userMessage },
      ];
    }

    setContext(prev => ({ ...prev, activated: true, displayMessages: [...prev.displayMessages, { role: 'user', content: userMessage }] }));

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
  
    const data = await res.json();
    const raw = data.reply;
  
    const titleMatch = raw.match(/##TITLE##\s*(.+)/);
    const dateMatch = raw.match(/##DATE##\s*(\d{4}-\d{2}-\d{2})/);
    const messageMatch = raw.match(/##MESSAGE##\s*(.+)/s);
    
    const parsedTitle = titleMatch ? titleMatch[1].trim() : 'Untitled';
    const parsedDate = dateMatch ? new Date(dateMatch[1]) : new Date(); // fallback to now
    const displayMessage = messageMatch ? messageMatch[1].trim() : '';
    
    // Now, extract only the schedule part
    const scheduleStart = raw.indexOf('##TITLE##');
    const dateStart = raw.indexOf('##DATE##');
    const description = (scheduleStart !== -1 && dateStart !== -1)
      ? raw.slice(scheduleStart, dateStart).replace(/##TITLE##.*(\r?\n)+/, '').trim()
      : '';
    
    setContext(prev => ({
      ...prev,
      messages: [...prev.messages, { role: 'assistant', content: raw }],
      displayMessages: [...prev.displayMessages, { role: 'assistant', content: displayMessage }]
    }));
    
    addEvent({
      title: parsedTitle,
      user_id: user.id,
      date: parsedDate,
      description: description,
    }, parsedDate.toISOString(), 'created');
  };

  console.log({context})

  return (
    <AiContext.Provider value={{ handleSchedule, toggleAi, context, setToggleAi }}>
      {children}
    </AiContext.Provider>
  )
}

export function useAiContext() {
  return useContext(AiContext);
}
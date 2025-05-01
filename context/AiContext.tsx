'use client';
import { createContext, useState, useContext, Dispatch, SetStateAction, useEffect } from "react"
import { User, Context } from "@/app/types";
import { generateSchedulePrompt } from "@/lib/ai-prompt";
import { useEventContext } from "./EventContext";
import { getEventByDate } from "@/lib/getEventByDate";
import { format } from 'date-fns';
import { upsertAIEventRecord } from "@/lib/upsertAIEventRecord";

type handleSchedule = (props: { user: User, userMessage: string }) => Promise<void>;

const AiContext = createContext<{ handleSchedule: handleSchedule, context: Context, toggleAi: boolean, setToggleAi: Dispatch<SetStateAction<boolean>> }>(
  { handleSchedule: async () => {}, context: { type: 'schedule', messages: [], display_messages: [] }, toggleAi: false, setToggleAi: () => {} }
);

export function AiWrapper({ children } : {
  children: React.ReactNode;
}) {
  const { addEvent, dateClicked, events } = useEventContext();
  const [context, setContext] = useState<Context>({ type: 'schedule', messages: [], display_messages: [], subContext: new Date() });

  console.log({events})
  console.log({context})

  useEffect(() => {
    if (dateClicked) {
      const formattedClicked = format(dateClicked, 'yyyy-MM-dd');
      const matchingEvents = events.filter(event => {
        const eventDateStr = format(new Date(event.date), 'yyyy-MM-dd');
        return eventDateStr === formattedClicked;
      });
      const aiRecord = matchingEvents[0]?.ai_event_record;
      setContext(prev => ({ ...prev, subContext: dateClicked, messages: aiRecord?.messages ?? [], displayMessages: aiRecord?.display_messages ?? []}));
    }
  }, [dateClicked, events])

  const [toggleAi, setToggleAi] = useState(false);

  const handleSchedule = async ({ user, userMessage }: { user: User, userMessage: string }) => {
    let messages: { role: 'user' | 'assistant' | 'system', content: string }[] = [];

    if (!context.subContext){
      return console.error('no date context')
    }

    const existingEvent = await getEventByDate(user.id, context.subContext as Date)
    
    if (context.messages.length === 0) {
      messages = [
        { role: "system", content: generateSchedulePrompt(user, context.subContext as Date, existingEvent) },
        { role: "user", content: userMessage },
      ];
    } else {
      messages = [
        ...context.messages,
        { role: "user", content: userMessage },
      ];
    }

    setContext(prev => ({ ...prev, messages, displayMessages: [...prev.display_messages, { role: 'user', content: userMessage }] }));

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
  
    const data = await res.json();
    const raw = data.reply;

    console.log({aiReply: raw})
  
    const titleMatch = raw.match(/##TITLE##\s*(.+)/);
    const dateMatch = raw.match(/##DATE##\s*(\d{4}-\d{2}-\d{2})/);
    const messageMatch = raw.match(/##MESSAGE##\s*(.+)/s);
    
    const parsedTitle = titleMatch ? titleMatch[1].trim() : 'Untitled';
    const parsedDate = new Date(dateMatch[1])
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
      displayMessages: [...prev.display_messages, { role: 'assistant', content: displayMessage }]
    }));

    const event = await addEvent({
      title: parsedTitle,
      user_id: user.id,
      date: parsedDate,
      description,
    }, parsedDate.toISOString(), existingEvent ? 'updated' : 'created');

    if (event){
      await upsertAIEventRecord({
        user_id: user.id,
        event_id: event.id,
        // target_date: parsedDate,
        messages,
        display_messages: [
          ...context.display_messages,
          { role: 'assistant', content: displayMessage },
        ],
      });
    }
    
  };

  return (
    <AiContext.Provider value={{ handleSchedule, toggleAi, context, setToggleAi }}>
      {children}
    </AiContext.Provider>
  )
}

export function useAiContext() {
  return useContext(AiContext);
}
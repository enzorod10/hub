'use client';
import { createContext, useState, useContext, Dispatch, SetStateAction, useEffect } from "react"
import { User, Context } from "@/app/types";
import { generateSchedulePrompt } from "@/lib/generate-event-ai";
import { useEventContext } from "./EventContext";
import { getEventByDate } from "@/lib/getEventByDate";
import { format, parse } from 'date-fns';
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

  useEffect(() => {
    if (dateClicked) {
      const formattedClicked = format(dateClicked, 'yyyy-MM-dd');
      const matchingEvent = events.find(event => {
        return event.date === formattedClicked;
      });

      const aiRecord = matchingEvent?.ai_event_record;
      setContext(prev => ({ ...prev, subContext: dateClicked, messages: aiRecord?.messages ?? [], display_messages: aiRecord?.display_messages ?? []}));
    }
  }, [dateClicked, events])

  const [toggleAi, setToggleAi] = useState(false);

  const handleSchedule = async ({ user, userMessage }: { user: User, userMessage: string }) => {
    let messages: { role: 'user' | 'assistant' | 'system', content: string }[] = [];

    if (!context.subContext){
      console.log('NO DATE CONTEXT')
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

    setContext(prev => ({ ...prev, messages, display_messages: [...prev.display_messages, { role: 'user', content: userMessage }] }));

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    const data = await res.json();

    let cleaned = data.reply.trim();

    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```(?:json)?/, '').replace(/```$/, '').trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error('Failed to parse JSON from GPT:', err);
      return;
    }
  
    const { title, date, schedule, summary } = parsed;
    console.log({ title,date,schedule, summary})

    const newDisplayMessages: { role: 'user' | 'assistant' | 'system', content: string }[] = [
      ...(context.display_messages ?? []),
      { role: 'user', content: userMessage },
      { role: 'assistant', content: summary },
    ];

    const newMessages: { role: 'user' | 'assistant' | 'system', content: string }[] = [
      ...(context.messages ?? []),
      { role: 'user', content: userMessage },
      { role: 'assistant', content: JSON.stringify(parsed, null, 2) },
    ];
    
    setContext(prev => ({
      ...prev,
      messages: newMessages,
      display_messages: newDisplayMessages
    }));

    const event = await addEvent({
      title,
      user_id: user.id,
      date: parse(date, 'yyyy-MM-dd', new Date()),
      schedule: schedule,
      summary,
      ai_event_record: {
        messages: newMessages,
        display_messages: newDisplayMessages,
      }
    }, format(parse(date, 'yyyy-MM-dd', new Date()), 'PPPP'), existingEvent ? 'updated' : 'created');

    if (event) {
      await upsertAIEventRecord({
        user_id: user.id,
        event_id: event.id,
        messages: newMessages,
        display_messages: newDisplayMessages
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
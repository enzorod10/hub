'use client';
import { Rnd } from "react-rnd";

import { Chatroom } from "./chatroom";
import { useAiContext } from "@/context/AiContext";
import { useSessionContext } from "@/context/SessionContext";
import { format } from 'date-fns';

export default function PortableAI() {
  const { toggleAi, context } = useAiContext();
  const { user, updateSession } = useSessionContext();

  if (toggleAi){
    return (
      <Rnd
      className="bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-2"
      default={{
        x: 0,
        y: 0,
        width: 320,
        height: 200,
      }}
      minWidth={250}
      minHeight={150}
      bounds="parent"
    >
        <div className="flex flex-col h-full w-full">
          <div className="flex justify-between items-center pb-2">
            <div className="font-semibold leading-none">
              {context.type[0].toLocaleUpperCase() + context.type.slice(1)}
            </div>
            <div className="font-semibold leading-none text-xs">
              {context.subContext && format((context.subContext), 'MMM d, yyyy')}
            </div>
          </div>
          <Chatroom user={user!}/>
        </div>
      </Rnd>
  )}
}

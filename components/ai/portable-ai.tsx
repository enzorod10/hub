'use client';
import { Rnd } from "react-rnd";

import { Chatroom } from "./chatroom";
import { useAiContext } from "@/context/AiContext";
import { useSessionContext } from "@/context/SessionContext";
import { format } from 'date-fns';
import { Separator } from "../ui/separator";
import { Minus, Square, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function PortableAI() {
  const { toggleAi, context, setToggleAi, loading, error } = useAiContext();
  const { user } = useSessionContext();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 320, height: 200 });

  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => {
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;
        return {
          x: Math.max(0, Math.min(prev.x, maxX)),
          y: Math.max(0, Math.min(prev.y, maxY)),
        };
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [size]);

  if (toggleAi){
    return (
      <Rnd
        position={position}
        size={size}
        onDragStop={(e, d) => {
          const newPos = { ...position, x: d.x, y: d.y };
          setPosition(newPos);
        }}
        onResizeStop={(e, dir, ref, delta, pos) => {
          const newSize = { width: ref.offsetWidth, height: ref.offsetHeight };
          setSize(newSize);
          setPosition(pos);
        }}
        
        minWidth={250}
        minHeight={150}
        bounds="parent"
        dragHandleClassName="chat-drag-handle"
        className="bg-blue-50 border border-blue-200 rounded-lg shadow-lg"
      >
        <div className="flex flex-col h-full w-full">
          <div className="flex justify-between items-center dark:text-secondary">
            <div className="flex items-center h-4 gap-1 flex-1 pl-2 h-full chat-drag-handle select-none">
              <div className="font-semibold leading-none">
                {context.type[0].toLocaleUpperCase() + context.type.slice(1)}
              </div>
              <Separator orientation="vertical" className="h-3/5"/>
              {context.subContext && <div className="font-semibold italic leading-none text-xs min-w-fit">
                {format((context.subContext), 'MMM d, yyyy')}
              </div>}
            </div>
            <div className="flex items-center ">
              {/* <Minus size={18} className="hover:bg-slate-200 p-2 box-content"/>
              <Square size={18} className="hover:bg-slate-200 p-2 box-content"/> */}
              <X onClick={() => setToggleAi(false)} size={18} className="hover:bg-slate-200 p-2 box-content rounded-tr-md"/>
            </div>
          </div>
          {loading && (
            <div className="flex-1 flex items-center justify-center text-blue-500 font-semibold">Loading AI response...</div>
          )}
          {error && (
            <div className="flex-1 flex items-center justify-center text-red-500 font-semibold">{error}</div>
          )}
          {!loading && !error && <Chatroom user={user!}/>} 
        </div>
      </Rnd>
  )}
}
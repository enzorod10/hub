'use client';
import { Rnd } from "react-rnd";

import { Chatroom } from "./chatroom";
import { useState } from "react";
import { Settings } from "./settings/settings";
import { useAiContext } from "@/context/AiContext";
import { useSessionContext } from "@/context/SessionContext";

export default function PortableAI() {
  const { setToggleAi, toggleAi, context } = useAiContext();
  const [selectedTab, setSelectedTab] = useState('chat');
  const { user, updateSession } = useSessionContext();

  const tabs = [
    { name: 'Chat', value: 'chat' },
    { name: 'Settings', value: 'settings' },
    { name: 'History', value: 'history' }
  ];

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
      minWidth={100}
      minHeight={100}
      bounds="parent"
    >
        <div className="flex flex-col h-full w-full">
          <div className="flex justify-between mb-2">
            <div className="flex text-xs font-medium ">
              {tabs.map((tab) => (
                  <button
                      key={tab.value}
                      className={`px-2 py-1  ${selectedTab === tab.value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                      onClick={() => setSelectedTab(tab.value)}
                  >
                      {tab.name}
                  </button>
              ))}
            </div>
            <div className="flex flex-col items-center text-slate-900 leading-none">
              <div className="font-semibold text-xs ">
                CONTEXT
              </div>
              <div>
                {context.type[0].toLocaleUpperCase() + context.type.slice(1)}
              </div>
              
            </div>
          </div>

          {selectedTab === 'chat' && <Chatroom user={user!}/>}
          {selectedTab === 'settings' && <Settings user={user!} updateSession={updateSession}/>}
          {selectedTab === 'history' && <div className="p-4">History content goes here</div>}
        </div>
      </Rnd>
  )}
}

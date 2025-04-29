'use client';
import { Rnd } from "react-rnd";

import { Chatroom } from "./chatroom";
import { useState } from "react";
import { Settings } from "./settings";
import { useAiContext } from "@/context/AiContext";
import { useSessionContext } from "@/context/SessionContext";

export default function PortableAI() {
  const { toggleAi } = useAiContext();
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
          <div className="flex text-xs font-medium">
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
          {selectedTab === 'chat' && <Chatroom user={user!}/>}
          {selectedTab === 'settings' && <Settings user={user!}/>}
          {selectedTab === 'history' && <div className="p-4">History content goes here</div>}
        </div>
      </Rnd>
  )}
}

'use client';

import { Chatroom } from "./chatroom";
import { useState } from "react";
import { Settings } from "./settings";

export default function PortableAI() {
  const [selectedTab, setSelectedTab] = useState('chat');

  const tabs = [
    { name: 'Chat', value: 'chat' },
    { name: 'Settings', value: 'settings' },
    { name: 'History', value: 'history' }
  ];
  
  return (
    <div className="flex max-w-xl mx-auto p-4 border border-red-500">
      <div className="flex flex-col">
        {tabs.map((tab) => (
            <button
                key={tab.value}
                className={`px-4 py-2 rounded ${selectedTab === tab.value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSelectedTab(tab.value)}
            >
                {tab.name}
            </button>
        ))}
    </div>
      {selectedTab === 'chat' && <Chatroom />}
      {selectedTab === 'settings' && <Settings />}
      {selectedTab === 'history' && <div className="p-4">History content goes here</div>}
    </div>
  );
}

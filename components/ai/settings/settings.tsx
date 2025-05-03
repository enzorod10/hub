'use client';

import { User } from "@/app/types";
import { useState } from 'react';
import { Interests } from "./interests";
import { Obligations } from "./obligations";
import { Goals } from "./goals";

export const Settings = ({ user, updateSession }: { user: User | null, updateSession: () => void }) => {
  const [tabs, setTabs] = useState([{name: 'Interests', tableName: 'interests', activate: true}, 
    {name: 'Obligations', tableName: 'obligations', activate: false}, 
    {name: 'Goals', tableName: 'goals', activate: false}]);

  const selectedTab = tabs.find(tab => tab.activate) || tabs[0];

  return (
    <div className="w-full text-black">
      <div>
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`px-2 py-1 mr-2 rounded ${tab.activate ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => !tab.activate && setTabs(prev => prev.map(t => ({...t, activate: t.name === tab.name ? true : false })))}
          >
            {tab.name}
          </button>
        ))}
      </div>
        {selectedTab.name === 'Interests' && 
          <Interests user={user} updateSession={updateSession}/>
        }
        {selectedTab.name === 'Obligations' &&
          <Obligations user={user} updateSession={updateSession}/>
        }
        {selectedTab.name === 'Goals' &&
          <Goals user={user} updateSession={updateSession}/>
        }
    </div>
  );
};
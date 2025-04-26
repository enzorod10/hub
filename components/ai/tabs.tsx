'use client';
import React from "react"

const tabs = [
    { name: 'Chat', value: 'chat' },
    { name: 'Files', value: 'files' },
    { name: 'Settings', value: 'settings' },
    { name: 'History', value: 'history' }
]

function Tabs(){
    const [selectedTab, setSelectedTab] = React.useState('chat');

    return (
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
    )
}

export default Tabs;
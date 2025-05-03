'use client';

// import ChatPage from "./components/ai-chat";
export default function Welcome() {
    return (
        <div className="flex flex-col justify-around w-2/3">
            <div className="text-2xl">
                Hi Enzo!
            </div>
            <div>
                This will be AI generated. Today, you have 4 different tasks. Here they are: Ordering something online, eating pizza, and setting out for lunch.
            </div>
            <div className="text-sm italic">
                &quot;Some inspirational quote here&quot; -Zhao Xing
            </div>
            
        </div>
    );
}
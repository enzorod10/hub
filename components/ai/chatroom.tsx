'use client';

import { useState } from "react";
import { User } from "@/app/types";
import { useAiContext } from "@/context/AiContext";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const Chatroom = ({ user }: { user: User }) => {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const { context, handleSchedule } = useAiContext();
    
    const handleSend = () => {
        if (!input.trim()) return;

        setLoading(true);
        handleSchedule({ user, userMessage: input })
            .then(() => {
                setInput("");
            })
            .catch((error) => {
                console.error("Error sending message:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }
      
    return(
        <div className="flex flex-col h-full w-full overflow-hidden">
            <div className="border flex-1 rounded p-2 bg-gray-50 mb-2 overflow-auto">
            {context.display_messages
                .filter((m) => m.role !== "system")
                .map((msg, i) => (
                <div key={i} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    <div
                    className={`inline-block px-3 py-2 text-secondary rounded ${
                        msg.role === "user" ? "bg-blue-200" : "bg-green-100"
                    }`}
                    >
                    {msg.content}
                    </div>
                </div>
                ))}
            </div>

            <div className="flex gap-2 ">
                <Input

                    className="text-black focus-visible:ring-0"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={loading}
                />
                <Button
                    variant="outline"
                    onClick={handleSend}
                    disabled={loading}
                >
                    Send
                </Button>
                
            </div>
        </div>
    );
}
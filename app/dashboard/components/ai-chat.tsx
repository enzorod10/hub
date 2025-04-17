'use client';

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">AI Chatroom</h1>
      <div className="border rounded p-2 h-96 overflow-y-auto bg-gray-50 mb-2">
        {messages
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

      <div className="flex gap-2">
        <input
          className="border rounded w-full p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}

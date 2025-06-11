'use client';

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const moods = [
	{ emoji: "😊", label: "Good" },
	{ emoji: "😐", label: "Okay" },
	{ emoji: "😔", label: "Down" },
	{ emoji: "😡", label: "Angry" },
	{ emoji: "😰", label: "Anxious" },
];

export default function Buddy() {
	const [messages, setMessages] = useState([
		{ sender: "ai", text: "Hi, I'm your Buddy. How are you feeling today?" },
	]);
	const [input, setInput] = useState("");
	const [mood, setMood] = useState("");
	const chatRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		chatRef.current?.scrollTo({
			top: chatRef.current.scrollHeight,
			behavior: "smooth",
		});
	}, [messages]);

	const sendMessage = async () => {
		if (!input.trim()) return;
		setMessages((msgs) => [...msgs, { sender: "user", text: input }]);
		setInput("");
		// Placeholder AI response
		setTimeout(() => {
			setMessages((msgs) => [
				...msgs,
				{ sender: "ai", text: "I'm here to listen. Tell me more." },
			]);
		}, 800);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-blue-50 to-white">
			<div
				className="w-full max-w-md bg-white rounded-xl shadow-lg p-4 flex flex-col"
				style={{ minHeight: 500 }}
			>
				<div className="flex items-center gap-2 mb-2">
					<Label className="text-sm text-gray-500">
						How are you feeling?
					</Label>
					<div className="flex gap-1">
						{moods.map((m) => (
							<button
								key={m.label}
								className={`text-2xl px-1 rounded-full ${
									mood === m.emoji ? "ring-2 ring-blue-400" : ""
								}`}
								onClick={() => setMood(m.emoji)}
								aria-label={m.label}
								type="button"
							>
								{m.emoji}
							</button>
						))}
					</div>
				</div>
				<div
					ref={chatRef}
					className="flex-1 overflow-y-auto space-y-2 py-2 mb-2 bg-blue-50 rounded-md"
				>
					{messages.map((msg, i) => (
						<div
							key={i}
							className={`flex ${
								msg.sender === "user" ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`rounded-lg px-3 py-2 max-w-[80%] text-sm shadow-sm ${
									msg.sender === "user"
										? "bg-blue-200 text-right"
										: "bg-white border"
								}`}
							>
								{msg.text}
							</div>
						</div>
					))}
				</div>
				<form
					className="flex gap-2 mt-2"
					onSubmit={(e) => {
						e.preventDefault();
						sendMessage();
					}}
				>
					<Input
						className="flex-1"
						placeholder="Type your thoughts..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						autoFocus
					/>
					<Button type="submit" disabled={!input.trim()}>
						Send
					</Button>
				</form>
			</div>
		</div>
	);
}
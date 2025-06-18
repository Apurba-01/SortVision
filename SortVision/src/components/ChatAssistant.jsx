//ChatAssistant.jsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AssistantEngine } from "@/assistant/assistantEngine";
import { useAlgorithmState } from "@/context/AlgorithmState";
import { useAudio } from "@/hooks/useAudio";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { X, MessageCircle, Bot } from "lucide-react";

export default function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const { getContextObject, addToHistory } = useAlgorithmState();
    const { playTypingSound, isAudioEnabled } = useAudio();

    const messagesEndRef = useRef(null);
    const assistantRef = useRef(null);

    // 🧠 Set up assistant on mount
    useEffect(() => {
        console.log("✅ ChatAssistant mounted");
        assistantRef.current = new AssistantEngine(() => getContextObject()); // ✅ Correct
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle chat open/close
    const toggleChat = () => {
        setIsOpen(prev => !prev);
        if (!isOpen) {
            // Trigger a user interaction to enable audio
            const event = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        setMessages((prev) => [...prev, { role: "user", content: input }]);
        const userInput = input;
        setInput("");

        const context = getContextObject();
        console.log("🧠 Context passed to assistant (ChatAssistant):", context);

        const result = await assistantRef.current.process(input, context);

        if (result.type === "response") {
            let displayed = "";
            const full = result.content;
            let i = 0;
            let lastTypingSound = 0;
            let typingInterval;

            setMessages((prev) => [...prev, { role: "model", content: "" }]);

            typingInterval = setInterval(() => {
                const now = Date.now();
                
                // Only play sound if we're actually adding a new character and enough time has passed
                if (i < full.length && now - lastTypingSound >= 200 && isAudioEnabled) { // Check isAudioEnabled
                    console.log('ChatAssistant: Playing typing sound');
                    playTypingSound();
                    lastTypingSound = now;
                }

                if (i < full.length) {
                    displayed += full[i];
                    i++;

                    setMessages((prev) => {
                        const last = prev[prev.length - 1];
                        if (last.role === "model") {
                            return [
                                ...prev.slice(0, -1),
                                { ...last, content: displayed },
                            ];
                        }
                        return prev;
                    });
                }

                if (i >= full.length) {
                    clearInterval(typingInterval);
                    addToHistory({ question: userInput, answer: full });
                }
            }, 30);

            // Cleanup function to clear interval if component unmounts or new message starts
            return () => {
                if (typingInterval) {
                    clearInterval(typingInterval);
                }
            };
        } else {
            setMessages((prev) => [
                ...prev,
                { role: "error", content: result.content },
            ]);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <div className="fixed bottom-6 left-6 z-50 group">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-red-400/30 animate-ping [animation-duration:2s] scale-110" />
                    <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping [animation-duration:3s] scale-125" />
                    <Button
                        onClick={toggleChat}
                        className="relative h-16 w-16 rounded-full shadow-2xl transition-all duration-500 bg-gradient-to-br from-red-400 via-red-500 to-red-600 hover:from-red-300 hover:via-red-400 hover:to-red-500 border-2 border-red-300/60 hover:border-red-200/80 overflow-hidden group-hover:scale-110 group-hover:rotate-3 active:scale-95"
                        aria-label="Toggle Chat"
                    >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-300/40 via-transparent to-red-300/30 animate-pulse" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent transition-opacity duration-300 opacity-100" />
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                            <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
                            <div className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-red-200 rounded-full animate-ping" style={{ animationDelay: "1s" }} />
                            <div className="absolute top-1/2 left-2 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{ animationDelay: "1.5s" }} />
                        </div>
                        <span className="text-slate-900 text-xl z-10 transition-all duration-500">
                            {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
                        </span>
                    </Button>
                </div>
            </div>

            {/* Chat Card */}
            {isOpen && (
                <div className="fixed bottom-24 left-4 w-[360px] max-w-[90vw] z-50">
                    <Card className="bg-slate-900 border-slate-700 shadow-2xl shadow-red-500/20 rounded-2xl">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-3 right-3 z-10 p-1 rounded-full hover:bg-slate-800 transition-colors border border-slate-600 hover:border-red-500/50"
                            aria-label="Close Chat"
                        >
                            <X className="h-4 w-4 text-slate-400 hover:text-red-400 transition-colors" />
                        </button>

                        <CardHeader className="text-center pr-10">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <Bot className="h-7 w-7 text-emerald-400 animate-pulse" />
                                <CardTitle className="text-2xl font-bold font-mono text-white">
                                    <span className="text-emerald-400">Sort</span>
                                    <span className="text-purple-400">Bot</span>
                                </CardTitle>
                            </div>
                            <CardDescription className="text-slate-400 font-mono">
                                <span className="text-amber-400">//</span> Ask me anything about sorting algorithms.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="px-4 pb-4 pt-0">
                            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto text-sm bg-slate-800 p-2 rounded border border-slate-700 text-slate-100">
                                {messages.length === 0 && (
                                    <p className="text-slate-400 italic">
                                        // Start typing to begin...
                                    </p>
                                )}
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2 rounded whitespace-pre-wrap ${msg.role === "user"
                                            ? "bg-blue-600/20 text-left"
                                            : msg.role === "error"
                                                ? "bg-red-500/20 text-left"
                                                : "bg-emerald-500/20 text-left"
                                            }`}
                                    >
                                        <strong className="mr-1 text-foreground font-medium">
                                            {msg.role === "user"
                                                ? "You"
                                                : msg.role === "error"
                                                    ? "Error"
                                                    : "AI"}:
                                        </strong>
                                        {msg.content}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="flex gap-2 mt-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Type your question..."
                                    className="flex-1 px-3 py-2 border border-slate-700 rounded-md bg-slate-800 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                <Button
                                    onClick={handleSend}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4"
                                >
                                    Send
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}

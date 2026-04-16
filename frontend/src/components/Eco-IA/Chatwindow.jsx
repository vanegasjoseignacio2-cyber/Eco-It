import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatMessage from "./Chatmessage";
import TypingIndicator from "./TypingIndicator";
import { Bot } from "lucide-react";

export default function ChatWindow({ messages, isTyping }) {
    const chatContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    return (
        <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
            style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(16,185,129,0.25) transparent",
                background: "linear-gradient(180deg, rgba(240,253,250,0.3) 0%, rgba(255,255,255,0.1) 100%)",
            }}
        >
            {/* Fondo con grid tenue */}
            <div
                className="fixed pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage: "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                    inset: 0,
                }}
            />

            <AnimatePresence initial={false}>
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
            </AnimatePresence>

            <AnimatePresence>
                {isTyping && <TypingIndicator />}
            </AnimatePresence>
        </div>
    );
}
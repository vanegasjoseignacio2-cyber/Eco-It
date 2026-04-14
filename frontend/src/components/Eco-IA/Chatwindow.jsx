import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "./Chatmessage";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow({ messages, isTyping }) {
    const chatContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    return (
        <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
        >
            <AnimatePresence>
                {messages.map(msg => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
            </AnimatePresence>

            {isTyping && <TypingIndicator />}
        </div>
    );
}

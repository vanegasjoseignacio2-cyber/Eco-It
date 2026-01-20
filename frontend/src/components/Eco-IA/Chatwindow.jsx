import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "./Chatmessage";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow({ messages, isTyping }) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
                {messages.map(msg => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
            </AnimatePresence>

            {isTyping && <TypingIndicator />}
        </div>
    );
}

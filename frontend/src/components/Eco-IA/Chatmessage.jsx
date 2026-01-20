import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function ChatMessage({ message }) {
    const isUser = message.type === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
        >
            <div className={`flex gap-3 max-w-[80%] ${isUser && "flex-row-reverse"}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser
                        ? "bg-gradient-to-t from-green-500 to-teal-500 text-white"
                        : "bg-gradient-to-b from-green-500 via-emerald-500 to-teal-500 text-white"
                    }`}>
                    {isUser ? "U" : <Bot size={16} />}
                </div>

                {/* Message bubble */}
                <div className={`p-4 rounded-2xl text-sm whitespace-pre-line ${isUser
                        ? "bg-gradient-to-br gradient-to-b from-green-500 to-emerald-600 text-white rounded-br-md"
                        : "bg-secondary rounded-bl-md"
                    }`}>
                    {message.image && (
                        <img
                            src={message.image}
                            alt="Uploaded"
                            className="w-48 h-48 object-cover rounded-lg mb-2"
                        />
                    )}
                    {message.content}
                </div>
            </div>
        </motion.div>
    );
}
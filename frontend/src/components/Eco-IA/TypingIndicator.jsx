    import { motion } from "framer-motion";
    import { Bot } from "lucide-react";

    export default function TypingIndicator() {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
            >
                <div className="flex  gap-3">
                    <div className="
            w-8 h-8
            rounded-full
            bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500
            flex items-center justify-center
            ">
                        <Bot className="w-4 h-4 text-white" />
                    </div>

                    <div className="
            p-3 sm:p-4
            rounded-2xl rounded-bl-md
            bg-secondary
            ">
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

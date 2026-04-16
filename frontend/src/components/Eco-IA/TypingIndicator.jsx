import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";

export default function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-start"
        >
            <div className="flex gap-2.5">
                {/* Avatar pulsante */}
                <motion.div
                    animate={{ boxShadow: ["0 0 0px rgba(16,185,129,0.2)", "0 0 14px rgba(16,185,129,0.55)", "0 0 0px rgba(16,185,129,0.2)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md"
                >
                    <Bot className="w-4 h-4 text-white" />
                </motion.div>

                {/* Burbuja */}
                <div className="relative flex items-center gap-3 px-4 py-3 bg-white/85 backdrop-blur-sm border border-emerald-100 rounded-2xl rounded-bl-md shadow-sm">
                    {/* Línea superior shimmer */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent rounded-t-2xl" />

                    {/* Puntos animados */}
                    <div className="flex gap-1.5 items-center">
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                                className="w-2 h-2 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500"
                            />
                        ))}
                    </div>

                    {/* Label */}
                    <motion.div
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex items-center gap-1"
                    >
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-500">Generando respuesta</span>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
import { Bot, Wifi } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatHeader() {
    return (
        <div className="relative flex-shrink-0 px-4 py-3 sm:px-6 sm:py-4 border-b border-emerald-100 bg-white/70 backdrop-blur-md rounded-t-3xl overflow-hidden">
            {/* Barra decorativa superior */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400" />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar animado */}
                    <motion.div
                        animate={{ boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 16px rgba(16,185,129,0.5)", "0 0 0px rgba(16,185,129,0)"] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500 flex items-center justify-center shadow-lg"
                    >
                        <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        {/* Indicador online */}
                        <motion.div
                            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                        />
                    </motion.div>

                    <div>
                        <motion.h3
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-black text-sm sm:text-base text-emerald-900 leading-none mb-0.5"
                        >
                            Eco-IA Chat
                        </motion.h3>
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-1.5"
                        >
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-xs text-emerald-600 font-medium">En línea · Siempre listo</span>
                        </motion.div>
                    </div>
                </div>

            </div>
        </div>
    );
}
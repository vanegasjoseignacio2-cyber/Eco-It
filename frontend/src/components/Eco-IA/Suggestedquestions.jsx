import { motion } from "framer-motion";
import { Lightbulb, ChevronRight } from "lucide-react";
import { suggestedQuestions } from "../../Data/botResponses";

export default function SuggestedQuestions({ onSelect, isTyping }) {
    return (
        <div
            className="p-3 sm:p-4 rounded-3xl"
            style={{
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(16,185,129,0.06)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
            }}
        >
            <div className="flex items-center gap-2.5 mb-5 px-1">
                <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
                >
                    <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em]" style={{ color: "#064e3b" }}>Eco Sugerencias</h3>
            </div>

            <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                    <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, ease: "easeOut" }}
                        whileHover={isTyping ? {} : { scale: 1.02, backgroundColor: "white", boxShadow: "0 10px 20px rgba(0,0,0,0.03)" }}
                        whileTap={isTyping ? {} : { scale: 0.98 }}
                        onClick={() => !isTyping && onSelect(question)}
                        disabled={isTyping}
                        className={`group w-full text-left px-4 py-3.5 rounded-2xl text-[11px] sm:text-xs font-semibold transition-all flex items-center justify-between gap-3 ${isTyping ? 'opacity-40 cursor-not-allowed' : ''}`}
                        style={{
                            background: "rgba(16,185,129,0.03)",
                            border: "1px solid rgba(16,185,129,0.05)",
                            color: "#065f46",
                        }}
                    >
                        <span className="flex-1 leading-relaxed opacity-80 group-hover:opacity-100">{question}</span>
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                            <ChevronRight
                                className="w-3 h-3 text-emerald-600"
                            />
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
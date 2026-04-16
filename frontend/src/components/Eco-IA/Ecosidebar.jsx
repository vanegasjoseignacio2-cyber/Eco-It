import { motion, AnimatePresence } from "framer-motion";
import { Bot, Plus, MessageSquare, Trash2 } from "lucide-react";
import SuggestedQuestions from "./Suggestedquestions";

export default function EcoSidebar({ chats = [], activeChatId, onSelectChat, onNewChat, onDeleteChat, onDeleteAllChats }) {

    return (
        <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 h-full"
        >
            {/* Panel bot principal */}
            <div
                className="relative overflow-hidden p-5 rounded-2xl"
                style={{
                    background: "linear-gradient(135deg, #d1fae5 0%, #ccfbf1 50%, #dcfce7 100%)",
                    boxShadow: "0 8px 30px rgba(16,185,129,0.2)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)"
                }}
            >
                {/* Hexgrid overlay tenue */}
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                    }}
                />

                <div className="relative flex items-center gap-3 mb-3">
                    <motion.div
                        animate={{ boxShadow: ["0 0 0px rgba(255,255,255,0.2)", "0 0 15px rgba(255,255,255,0.4)", "0 0 0px rgba(255,255,255,0.2)"] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                        style={{
                            background: "rgba(255,255,255)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.4)",
                        }}
                    >
                        <Bot className="w-5 h-5 text-green-700" />
                    </motion.div>
                    <div>
                        <h3
                            className="font-light text-green-700 leading-none mb-1"
                            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", letterSpacing: "0.08em", fontSize: "1.2rem" }}
                        >
                            ECO—IA
                        </h3>
                    </div>
                </div>

                <p className="relative text-[11px] text-emerald-900 font-bold mb-5 leading-relaxed">
                    Sube imágenes de tus residuos o consulta sobre gestión sostenible.
                </p>

                <motion.button
                    whileHover={{ scale: 1.02, y: -1, backgroundColor: "rgba(255,255,255,0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onNewChat}
                    className="relative w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs transition-all tracking-widest uppercase shadow-lg"
                    style={{
                        background: "rgba(255,255,255,0.25)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.4)",
                        color: "#064e3b",
                    }}
                >
                    <Plus size={14} />
                    Comenzar de nuevo
                </motion.button>
            </div>

            {/* Historial de chats */}
            {chats && chats.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex-1 min-h-0 overflow-hidden flex flex-col rounded-3xl"
                    style={{
                        background: "rgba(255, 255, 255, 0.45)",
                        backdropFilter: "blur(32px) saturate(180%)",
                        WebkitBackdropFilter: "blur(32px) saturate(180%)",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                        boxShadow: "0 10px 40px -10px rgba(16, 185, 129, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.3)"
                    }}
                >
                    <div className="px-5 pt-5 pb-3 border-b border-emerald-900/5">
                        <div className="flex items-center gap-2">
                            <h4 className="font-black text-[12px] uppercase tracking-widest text-emerald-800/70">
                                Historial
                            </h4>
                            <span className="ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/50 text-emerald-700">
                                {chats.length}
                            </span>
                            
                            {/* Borrar todos los chats */}
                            <motion.button
                                whileHover={{ scale: 1.1, color: "#ef4444" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onDeleteAllChats}
                                className="ml-auto p-1.5 rounded-lg text-emerald-700/40 hover:bg-red-50/50 transition-all font-bold"
                                title="Borrar todo el historial"
                            >
                                <Trash2 size={14} />
                            </motion.button>
                        </div>
                    </div>

                    <div className="space-y-2 p-3 overflow-y-auto flex-1 custom-scrollbar">
                        <AnimatePresence>
                            {chats.map((chat, i) => (
                                <motion.div
                                    key={chat._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ delay: i * 0.04 }}
                                    onClick={() => onSelectChat(chat._id)}
                                    className="group relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 ease-out"
                                    style={
                                        activeChatId === chat._id
                                            ? {
                                                background: "rgba(255, 255, 255, 1)",
                                                border: "1px solid rgba(16, 185, 129, 0.6)",
                                                boxShadow: "0 15px 35px -10px rgba(16, 185, 129, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 1)",
                                                transform: "scale(1.02) translateX(6px)"
                                            }
                                            : {
                                                background: "rgba(255, 255, 255, 0.4)",
                                                border: "1px solid rgba(16, 185, 129, 0.15)",
                                                backdropFilter: "blur(12px)",
                                            }
                                    }
                                    whileHover={{
                                        scale: activeChatId === chat._id ? 1.02 : 1.015,
                                        translateX: activeChatId === chat._id ? 6 : 3,
                                        backgroundColor: activeChatId === chat._id ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                                        borderColor: "rgba(16, 185, 129, 0.4)",
                                        boxShadow: "0 12px 25px -8px rgba(16, 185, 129, 0.15)"
                                    }}
                                >
                                    {/* Indicador de selección lateral */}
                                    <AnimatePresence>
                                        {activeChatId === chat._id && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "65%" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="absolute left-[-3px] w-[5px] rounded-full"
                                                style={{
                                                    background: "#059669",
                                                    boxShadow: "0 0 15px rgba(16, 185, 129, 0.6)"
                                                }}
                                            />
                                        )}
                                    </AnimatePresence>
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-md"
                                        style={{
                                            background: activeChatId === chat._id
                                                ? "linear-gradient(135deg, #059669, #047857)"
                                                : "rgba(255, 255, 255, 0.9)",
                                            border: activeChatId === chat._id ? "none" : "1px solid rgba(16, 185, 129, 0.1)"
                                        }}
                                    >
                                        <MessageSquare
                                            size={16}
                                            className={
                                                activeChatId === chat._id
                                                    ? "text-white"
                                                    : "text-emerald-700"
                                            }
                                        />
                                    </div>

                                    <span className={`text-[12px] flex-1 truncate font-bold transition-colors ${
                                        activeChatId === chat._id ? "text-emerald-950" : "text-emerald-900 group-hover:text-emerald-950"
                                    }`}>
                                        {chat.title}
                                    </span>

                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{
                                            scale: 1.15,
                                            backgroundColor: "#fee2e2",
                                            color: "#ef4444"
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteChat(chat._id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all text-emerald-800/30 bg-white/50 border border-transparent hover:border-red-100 shadow-sm flex items-center justify-center"
                                        title="Eliminar chat"
                                    >
                                        <Trash2 size={13} />
                                    </motion.button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </motion.aside>
    );
}
import { motion } from "framer-motion";
import { Bot, Leaf, Plus, MessageSquare, Trash2 } from "lucide-react";
import SuggestedQuestions from "./Suggestedquestions";
import { fadeSideLeft } from "../animations/motionVariants";

export default function EcoSidebar({ onQuestion, chats = [], activeChatId, onSelectChat, onNewChat, onDeleteChat }) {
    return (
        <motion.aside {...fadeSideLeft} className="space-y-6 flex flex-col h-full">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100 border-2 border-emerald-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 flex items-center justify-center">
                        <Bot className="text-white" />
                    </div>
                    <div className="">
                        <h3 className="font-bold">Eco-IA</h3>
                        <p className="text-sm text-muted-foreground">En línea</p>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    Pregunta o sube imágenes de residuos
                </p>
                
                <button 
                  onClick={onNewChat}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl transition-colors font-medium shadow-sm"
                >
                    <Plus size={18} />
                    Nuevo Chat
                </button>
            </div>

            {chats && chats.length > 0 ? (
                <div className="flex-1 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-emerald-200 p-4 h-64 overflow-y-auto">
                    <h4 className="font-bold text-sm text-emerald-800 mb-3 flex items-center gap-2">
                        <MessageSquare size={16} /> Recientes
                    </h4>
                    <div className="space-y-2">
                        {chats.map(chat => (
                            <div 
                              key={chat._id} 
                              className={`group flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${activeChatId === chat._id ? 'bg-emerald-200 text-emerald-900 border border-emerald-400' : 'hover:bg-emerald-100 border border-transparent'}`}
                              onClick={() => onSelectChat(chat._id)}
                            >
                                <span className="text-sm truncate pr-2 w-full font-medium" title={chat.title}>
                                    {chat.title}
                                </span>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); onDeleteChat(chat._id); }}
                                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-1"
                                  title="Eliminar chat"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <SuggestedQuestions onSelect={onQuestion} />
            )}

            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100 border-2 border-emerald-300">
                <h3 className="font-bold flex items-center gap-2 text-green-600">
                    <Leaf /> Dato Ecológico
                </h3>
                <p className="text-sm mt-2">
                    Reciclar una tonelada de papel salva 17 árboles 🌱
                </p>
            </div>
        </motion.aside>
    );
}

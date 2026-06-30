import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Bot, User, MapPin, Youtube } from "lucide-react";

const MAP_MARKER = "[VER_MAPA]";
const PILL_CLASS = "inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full text-xs font-bold text-white align-middle";

function renderBotContent(content) {
    const markerRegex = /\[VER_MAPA\]|\[VER_VIDEO:\s*([^\]]+)\]/g;
    if (!markerRegex.test(content)) {
        return <span style={{ whiteSpace: "pre-line" }}>{content}</span>;
    }
    markerRegex.lastIndex = 0;

    const nodes = [];
    let lastIndex = 0;
    let match;
    let key = 0;
    while ((match = markerRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            nodes.push(<span key={key++}>{content.slice(lastIndex, match.index)}</span>);
        }
        if (match[0] === MAP_MARKER) {
            nodes.push(
                <Link key={key++} to="/maps" className={PILL_CLASS} style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
                    <MapPin size={12} /> Ver en el mapa
                </Link>
            );
        } else {
            const query = match[1].trim();
            const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
            nodes.push(
                <a key={key++} href={url} target="_blank" rel="noopener noreferrer" className={PILL_CLASS} style={{ background: "linear-gradient(135deg, #dc2626, #ef4444)" }}>
                    <Youtube size={12} /> Ver tutoriales
                </a>
            );
        }
        lastIndex = markerRegex.lastIndex;
    }
    if (lastIndex < content.length) {
        nodes.push(<span key={key++}>{content.slice(lastIndex)}</span>);
    }
    return <span style={{ whiteSpace: "pre-line" }}>{nodes}</span>;
}

export function MessageSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
        >
            <div className="flex gap-3 max-w-[85%]">
                <motion.div
                    animate={{
                        boxShadow: [
                            "0 0 0px rgba(16,185,129,0.2)",
                            "0 0 16px rgba(16,185,129,0.6)",
                            "0 0 0px rgba(16,185,129,0.2)",
                        ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
                    style={{ background: "linear-gradient(135deg, #059669, #10b981, #14b8a6)" }}
                >
                    <Bot size={16} className="text-white" />
                </motion.div>

                <div
                    className="p-4 rounded-2xl rounded-bl-md space-y-2.5 min-w-[200px]"
                    style={{
                        background: "rgba(255,255,255,0.9)",
                        border: "1px solid rgba(16,185,129,0.15)",
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 4px 20px rgba(16,185,129,0.08)",
                    }}
                >
                    {[100, 80, 60].map((w, i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.18 }}
                            className="h-2.5 rounded-full"
                            style={{
                                width: `${w}%`,
                                background: "linear-gradient(90deg, rgba(16,185,129,0.15), rgba(20,184,166,0.2), rgba(16,185,129,0.15))",
                                backgroundSize: "200% 100%",
                            }}
                        />
                    ))}
                    <motion.div
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.7, repeat: Infinity }}
                        className="w-0.5 h-4 rounded-sm inline-block"
                        style={{ background: "rgba(16,185,129,0.8)", boxShadow: "0 0 8px rgba(16,185,129,0.5)" }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default function ChatMessage({ message }) {
    const isUser = message.type === "user";
    const isEmpty = !message.content && message.type === "bot";

    if (isEmpty) return <MessageSkeleton />;

    return (
        <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
        >
            <div className={`flex gap-3 max-w-[87%] sm:max-w-[78%] ${isUser ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <motion.div
                    whileHover={{ scale: 1.1, rotate: isUser ? -5 : 5 }}
                    className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
                    style={{
                        background: isUser
                            ? "linear-gradient(135deg, #14b8a6, #059669)"
                            : "linear-gradient(135deg, #059669, #10b981, #14b8a6)",
                        boxShadow: isUser
                            ? "0 4px 12px rgba(20,184,166,0.35)"
                            : "0 4px 12px rgba(16,185,129,0.35)",
                    }}
                >
                    {isUser
                        ? <User size={15} className="text-white" />
                        : <Bot size={15} className="text-white" />
                    }
                </motion.div>

                {/* Bubble */}
                <div
                    className="relative p-4 rounded-2xl text-sm leading-relaxed"
                    style={
                        isUser
                            ? {
                                background: "linear-gradient(135deg, #059669, #10b981, #14b8a6)",
                                color: "white",
                                borderRadius: "18px 18px 6px 18px",
                                boxShadow: "0 8px 25px rgba(16,185,129,0.35), 0 2px 8px rgba(0,0,0,0.08)",
                            }
                            : {
                                background: "rgba(255,255,255,0.92)",
                                color: "#064e3b",
                                borderRadius: "18px 18px 18px 6px",
                                border: "1px solid rgba(16,185,129,0.18)",
                                backdropFilter: "blur(12px)",
                                boxShadow: "0 4px 20px rgba(16,185,129,0.08), 0 1px 4px rgba(0,0,0,0.05)",
                            }
                    }
                >
                    {/* Shimmer superior en bot */}
                    {!isUser && (
                        <div
                            className="absolute top-0 left-6 right-6 h-px"
                            style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)" }}
                        />
                    )}

                    {message.image && (
                        <motion.img
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={message.image}
                            alt="Uploaded"
                            className="w-48 h-48 object-cover rounded-xl mb-3 shadow-md"
                            style={{ border: "2px solid rgba(255,255,255,0.3)" }}
                        />
                    )}

                    {isUser
                        ? <span style={{ whiteSpace: "pre-line" }}>{message.content}</span>
                        : renderBotContent(message.content)}

                    {/* Glow decorativo usuario */}
                    {isUser && (
                        <div
                            className="absolute inset-0 rounded-2xl pointer-events-none"
                            style={{
                                background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
                                borderRadius: "inherit",
                            }}
                        />
                    )}
                </div>
            </div>
        </motion.div>
    );
}
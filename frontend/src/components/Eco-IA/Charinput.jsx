import { ImagePlus, Send, X, Mic, AlertCircle, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useMemo, useEffect } from "react";
import { useOfensiveValidator } from "../Contact/ContactForm";

export default function ChatInput({
    inputValue,
    setInputValue,
    onSend,
    onStop,
    onImageClick,
    selectedImage,
    onImageRemove,
    isTyping,
    disabled
}) {
    const fileInputRef = useRef(null);
    const inputRef = useRef(null);
    const [focused, setFocused] = useState(false);
    const { validar } = useOfensiveValidator();

    // Auto-focus al terminar de escribir o al montar
    useEffect(() => {
        if (!isTyping && !disabled) {
            inputRef.current?.focus();
        }
    }, [isTyping, disabled]);

    // Validación en tiempo real
    const validation = useMemo(() => {
        if (!inputValue.trim()) return { valido: true };
        return validar(inputValue);
    }, [inputValue, validar]);

    const isOfensive = !validation.valido;
    const canSend = !disabled && !isTyping && (inputValue.trim() || selectedImage) && !isOfensive;
    const canStop = isTyping && onStop;

    // Función para filtrar emojis y caracteres no latinos
    const filterInput = (text) => {
        // 1. Bloquear emojis y pictogramas extendidos
        let cleaned = text.replace(/[\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
        
        // 2. Bloquear caracteres fuera del rango latino extendido, números y puntuación común
        // Permite: A-Z, a-z, 0-9, caracteres españoles (áéíóúñ...), puntuación básica y símbolos comunes
        // Excluye: Ruso, Chino, Árabe, etc.
        cleaned = cleaned.replace(/[^\x20-\x7E\xA0-\xFF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF\n\r]/gu, '');
        
        return cleaned;
    };

    const handleChange = (e) => {
        const val = e.target.value;
        const filtered = filterInput(val);
        setInputValue(filtered);
    };

    return (
        <div
            className="flex-shrink-0"
            style={{
                background: "linear-gradient(180deg, rgba(240,253,250,0.6) 0%, rgba(255,255,255,0.85) 100%)",
                backdropFilter: "blur(16px)",
                borderTop: "1px solid rgba(16,185,129,0.12)",
            }}
        >
            {/* Preview imagen */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-4 pt-3"
                    >
                        <div className="relative inline-block group">
                            <div
                                className="p-1 rounded-2xl"
                                style={{
                                    background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(20,184,166,0.2))",
                                    border: "1px solid rgba(16,185,129,0.25)",
                                }}
                            >
                                <img
                                    src={selectedImage}
                                    alt="Preview"
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shadow-md"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onImageRemove}
                                className="absolute -top-2 -right-2 w-6 h-6 text-white rounded-full flex items-center justify-center shadow-lg"
                                style={{ background: "linear-gradient(135deg, #f87171, #ef4444)" }}
                            >
                                <X className="w-3.5 h-3.5" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Área de input */}
            <div className="p-3 sm:p-4">
                <motion.div
                    animate={focused ? {
                        boxShadow: isOfensive 
                            ? "0 0 0 2px rgba(239,68,68,0.3), 0 8px 30px rgba(239,68,68,0.12)"
                            : "0 0 0 2px rgba(16,185,129,0.3), 0 8px 30px rgba(16,185,129,0.12)",
                    } : {
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-2 sm:gap-2.5 items-end p-1.5 rounded-2xl"
                    style={{
                        background: "rgba(255,255,255,0.9)",
                        border: isOfensive 
                            ? "1px solid rgba(239,68,68,0.35)" 
                            : focused ? "1px solid rgba(16,185,129,0.35)" : "1px solid rgba(16,185,129,0.15)",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                >
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={onImageClick} className="hidden" />

                    {/* Botón imagen */}
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-shrink-0 p-2.5 rounded-xl transition-all"
                        style={{
                            background: "rgba(16,185,129,0.08)",
                            border: "1px solid rgba(16,185,129,0.15)",
                            color: "#059669",
                        }}
                        title="Adjuntar imagen"
                    >
                        <ImagePlus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>

                    {/* Input texto */}
                    <div className="flex-1 flex flex-col">
                        <input
                            ref={inputRef}
                            value={inputValue}
                            onChange={handleChange}
                            onKeyDown={e => e.key === "Enter" && !e.shiftKey && canSend && onSend()}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            placeholder={isTyping ? "Eco-IA está respondiendo..." : "Pregunta sobre reciclaje o sube una imagen..."}
                            disabled={isTyping}
                            className="w-full px-3 py-2.5 bg-transparent outline-none text-sm disabled:cursor-not-allowed"
                            style={{
                                color: isOfensive ? "#b91c1c" : "#064e3b",
                                caretColor: isOfensive ? "#ef4444" : "#10b981",
                                minHeight: "44px",
                            }}
                        />
                    </div>

                    {/* Botón enviar / detener */}
                    <motion.button
                        type="button"
                        whileHover={(canSend || canStop) ? { scale: 1.08 } : {}}
                        whileTap={(canSend || canStop) ? { scale: 0.92 } : {}}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isTyping) onStop();
                            else if (canSend) onSend();
                        }}
                        disabled={!canSend && !canStop}
                        className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl transition-all cursor-pointer relative z-10 touch-manipulation min-w-[44px] min-h-[44px]"
                        style={
                            isTyping
                                ? {
                                    background: "linear-gradient(135deg, #ef4444, #f87171)",
                                    color: "white",
                                    boxShadow: "0 4px 15px rgba(239,68,68,0.4)",
                                    border: "none",
                                }
                                : canSend
                                    ? {
                                        background: "linear-gradient(135deg, #059669, #10b981, #14b8a6)",
                                        color: "white",
                                        boxShadow: "0 4px 15px rgba(16,185,129,0.4)",
                                        border: "none",
                                    }
                                    : {
                                        background: isOfensive ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)",
                                        color: isOfensive ? "rgba(239,68,68,0.35)" : "rgba(16,185,129,0.35)",
                                        border: isOfensive ? "1px solid rgba(239,68,68,0.1)" : "1px solid rgba(16,185,129,0.1)",
                                        cursor: "not-allowed",
                                    }
                        }
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isTyping ? "stop" : (canSend ? "active" : "inactive")}
                                initial={{ scale: 0.7, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.7, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="flex items-center justify-center pointer-events-none"
                            >
                                {isTyping ? (
                                    <Square className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                                ) : (
                                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.button>
                </motion.div>

                {/* Error message / Hint text */}
                <AnimatePresence mode="wait">
                    {isOfensive ? (
                        <motion.p
                            key="offensive-error"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="text-center text-[10px] sm:text-xs mt-2 font-medium flex items-center justify-center gap-1.5"
                            style={{ color: "#ef4444" }}
                        >
                            <AlertCircle size={12} />
                            Tu mensaje contiene lenguaje no permitido
                        </motion.p>
                    ) : (
                        <motion.p
                            key="hint-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center text-xs mt-2"
                            style={{ color: "rgba(16,185,129,0.45)" }}
                        >
                            {isTyping ? "Eco-IA está generando una respuesta..." : "Presiona Enter para enviar"}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
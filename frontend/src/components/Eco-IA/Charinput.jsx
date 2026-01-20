import { Image, Send, X } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";


export default function ChatInput({
    inputValue,
    setInputValue,
    onSend,
    onImageClick,
    selectedImage,
    onImageRemove,
    disabled
}) {
    const fileInputRef = useRef(null);

    return (
        <div className="border-t border-border">
            {/* Preview de imagen */}
            {selectedImage && (
                <div className="px-4 pt-2">
                    <div className="relative inline-block">
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                        <button
                            onClick={onImageRemove}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Input area */}
            <div className="p-4 flex gap-3">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={onImageClick}
                    className="hidden"
                />

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                >
                    <Image className="w-5 h-5" />
                </motion.button>

                <input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && onSend()}
                    placeholder="Escribe tu pregunta sobre reciclaje..."
                    className="flex-1 px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={onSend}
                    disabled={disabled}
                    className="p-3 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <Send className="w-5 h-5" />
                </motion.button>
            </div>
        </div>
    );
}
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Info, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    const variants = {
        initial: { opacity: 0, y: -20, x: 20 },
        animate: { opacity: 1, y: 0, x: 0 },
        exit: { opacity: 0, y: -20, x: 20 },
    };

    const getIcon = () => {
        switch (type) {
            case "success": return <Check className="w-5 h-5 text-green-500" />;
            case "error": return <X className="w-5 h-5 text-red-500" />;
            case "info": return <Info className="w-5 h-5 text-blue-500" />;
            case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            default: return <Check className="w-5 h-5 text-green-500" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case "success": return "bg-green-50 border-green-200";
            case "error": return "bg-red-50 border-red-200";
            case "info": return "bg-blue-50 border-blue-200";
            case "warning": return "bg-yellow-50 border-yellow-200";
            default: return "bg-green-50 border-green-200";
        }
    };

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    className="fixed top-24 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border bg-white"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                    <div className={`p-2 rounded-full ${getBgColor()}`}>
                        {getIcon()}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 text-sm">Notificación</h4>
                        <p className="text-gray-600 text-sm">{message}</p>
                    </div>
                    <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

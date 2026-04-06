import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Info, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

/**
 * Toast
 * Props:
 *  - message   : string
 *  - type      : 'success' | 'error' | 'info' | 'warning'
 *  - duration  : ms; 0 = no se cierra automáticamente
 *  - onClose   : () => void
 *  - action    : { label: string, onClick: () => void } | null
 */
export default function Toast({ message, type = "success", onClose, duration = 3000, action = null }) {
    useEffect(() => {
        if (!message) return;
        // duration=0 significa que el usuario debe cerrarlo manualmente
        if (duration === 0) return;
        const timer = setTimeout(() => onClose(), duration);
        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    const variants = {
        initial: { opacity: 0, y: -20, x: 20 },
        animate: { opacity: 1, y: 0, x: 0 },
        exit:    { opacity: 0, y: -20, x: 20 },
    };

    const getIcon = () => {
        switch (type) {
            case "success": return <Check       className="w-5 h-5 text-green-500"  />;
            case "error":   return <X           className="w-5 h-5 text-red-500"    />;
            case "info":    return <Info        className="w-5 h-5 text-blue-500"   />;
            case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            default:        return <Check       className="w-5 h-5 text-green-500"  />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case "success": return "bg-green-50 border-green-200";
            case "error":   return "bg-red-50 border-red-200";
            case "info":    return "bg-blue-50 border-blue-200";
            case "warning": return "bg-yellow-50 border-yellow-200";
            default:        return "bg-green-50 border-green-200";
        }
    };

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    className="fixed top-24 right-4 z-[10000] flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl border bg-white max-w-sm w-full sm:w-auto"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                    {/* Ícono */}
                    <div className={`p-2 rounded-full flex-shrink-0 ${getBgColor()}`}>
                        {getIcon()}
                    </div>

                    {/* Texto + acción */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm">Notificación</h4>
                        <p className="text-gray-600 text-sm leading-snug">{message}</p>

                        {/* Botón de acción opcional (ej: "Volver y aceptar") */}
                        {action && (
                            <button
                                onClick={() => {
                                    action.onClick();
                                    onClose();
                                }}
                                className="mt-2 text-sm font-semibold text-green-600 hover:text-green-700 underline underline-offset-2 transition-colors"
                            >
                                {action.label}
                            </button>
                        )}
                    </div>

                    {/* Cerrar */}
                    <button
                        onClick={onClose}
                        className="ml-1 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
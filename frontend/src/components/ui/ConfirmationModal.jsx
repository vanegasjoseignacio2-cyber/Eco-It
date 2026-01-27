import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "¿Estás seguro?",
    message = "Esta acción no se puede deshacer.",
    confirmText = "Eliminar",
    cancelText = "Cancelar",
    type = "danger" // danger | warning | info
}) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-full ${type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {message}
                        </p>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`px-5 py-2.5 rounded-xl font-medium text-white shadow-lg shadow-red-200 transition-all transform hover:scale-105 ${type === 'danger'
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                        : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                    }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>

                    {/* Close button absolute */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

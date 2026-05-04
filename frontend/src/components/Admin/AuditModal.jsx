import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Trash, ShieldAlert, Eye, Key, Info, User, UserPlus, Ban, CheckCircle, Image as ImageIcon, Settings, ClipboardList } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const TYPE_CONFIG = {
    register:    { label: "Registro",    cls: "bg-lime-100 text-lime-700",     icon: UserPlus },
    delete:      { label: "Eliminación", cls: "bg-red-100 text-red-600",       icon: Trash2 },
    ban:         { label: "Ban",         cls: "bg-orange-100 text-orange-700", icon: Ban },
    unban:       { label: "Desban",      cls: "bg-sky-100 text-sky-700",       icon: CheckCircle },
    slide:       { label: "Slide",       cls: "bg-green-100 text-green-700",   icon: ImageIcon },
    role_change: { label: "Rol",         cls: "bg-purple-100 text-purple-700", icon: Key },
    system:      { label: "Sistema",     cls: "bg-gray-100 text-gray-600",     icon: Settings },
};

// Clave de localStorage por usuario para que cada admin tenga su propia lista
const getStorageKey = (userId) => `audit_hidden_${userId}`;

export default function AuditModal({ logs, hiddenIds, onClose, onRefresh, onHideChange }) {
    const { usuario, token } = useAuth();
    const isSuperAdmin = usuario?.rol === "superadmin";
    const storageKey = getStorageKey(usuario?._id || usuario?.id || "unknown");

    // Usamos hiddenIds del padre; si no llega (compatibilidad), caemos a Set vacío
    const hidden = hiddenIds || new Set();

    const [confirming, setConfirming] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Persistir y notificar al padre
    const applyHidden = (newHidden) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify([...newHidden]));
        } catch (e) {
            console.error("Error guardando estado de auditoría:", e);
        }
        onHideChange?.(newHidden);
    };

    const visibleLogs = logs.filter((l) => !hidden.has(String(l._id)));

    const hideOne = (id) => {
        const newHidden = new Set([...hidden, String(id)]);
        applyHidden(newHidden);
    };

    const hideAll = () => {
        const newHidden = new Set(logs.map((l) => String(l._id)));
        applyHidden(newHidden);
    };

    // Solo superadmin — borrado real en BD
    const deleteOneFromDB = async (id) => {
        setDeleting(true);
        try {
            await fetch(`http://localhost:3000/api/admin/audit/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            hideOne(id);
            onRefresh?.();
        } catch (e) {
            console.error(e);
        } finally {
            setDeleting(false);
            setConfirming(null);
        }
    };

    const deleteAllFromDB = async () => {
        setDeleting(true);
        try {
            await fetch(`http://localhost:3000/api/admin/audit/all`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            hideAll();
            onRefresh?.();
        } catch (e) {
            console.error(e);
        } finally {
            setDeleting(false);
            setConfirming(null);
        }
    };

    // Cerrar con Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <AnimatePresence>
            {/* Backdrop con blur */}
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-6"
                style={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(0,0,0,0.40)" }}
                onClick={onClose}
            >
                {/* Panel */}
                <motion.div
                    key="panel"
                    initial={{ opacity: 0, scale: 0.93, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: 20 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="relative bg-white rounded-3xl shadow-2xl border border-green-100 w-full max-w-3xl"
                    style={{ maxHeight: "85vh", display: "flex", flexDirection: "column" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-5 border-b border-green-50 bg-gradient-to-r from-green-50 to-emerald-50/60 rounded-t-3xl shrink-0">
                        <div>
                            <h2 className="text-xl font-bold text-green-900 flex items-center gap-2.5">
                                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow">
                                    <Eye className="w-4 h-4 text-white" />
                                </span>
                                Auditoría de la Semana
                            </h2>
                            <p className="text-xs text-green-400 mt-1 ml-10">
                                {visibleLogs.length} evento{visibleLogs.length !== 1 ? "s" : ""} visibles · los registros se borran automáticamente a los 7 días
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-green-400 hover:text-green-700 hover:bg-green-100 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Barra de acciones */}
                    <div className="flex items-center gap-3 px-8 py-3 border-b border-green-50 shrink-0 bg-white">
                        <button
                            onClick={hideAll}
                            disabled={visibleLogs.length === 0}
                            className="flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-800 px-3 py-2 rounded-xl hover:bg-green-50 border border-transparent hover:border-green-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Trash className="w-3.5 h-3.5" />
                            Ocultar todo de mi vista
                        </button>

                        {isSuperAdmin && (
                            <>
                                <div className="h-4 w-px bg-green-100" />
                                {confirming === "all" ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-red-500 font-semibold">¿Eliminar todos de la BD?</span>
                                        <button
                                            onClick={deleteAllFromDB}
                                            disabled={deleting}
                                            className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-all disabled:opacity-60"
                                        >
                                            Confirmar
                                        </button>
                                        <button
                                            onClick={() => setConfirming(null)}
                                            className="text-xs text-gray-400 hover:text-gray-600 font-medium"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirming("all")}
                                        disabled={logs.length === 0}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <ShieldAlert className="w-3.5 h-3.5" />
                                        Eliminar todo de BD
                                    </button>
                                )}
                            </>
                        )}

                        <div className="ml-auto text-xs text-green-300 font-medium flex items-center gap-1.5">
                            {isSuperAdmin ? (
                                <><Key className="w-3.5 h-3.5" /> Superadmin</>
                            ) : (
                                <><User className="w-3.5 h-3.5" /> Admin</>
                            )}
                        </div>
                    </div>

                    {/* Lista scrollable */}
                    <div className="overflow-y-auto flex-1">
                        <AnimatePresence initial={false}>
                            {visibleLogs.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-20 gap-3"
                                >
                                    <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                                        <Eye className="w-7 h-7 text-green-200" />
                                    </div>
                                    <p className="text-sm text-green-300 font-medium">Sin eventos visibles</p>
                                    <p className="text-xs text-green-200">Has ocultado todos los registros de tu vista</p>
                                </motion.div>
                            ) : (
                                visibleLogs.map((log) => {
                                    const cfg = TYPE_CONFIG[log.type] || { label: log.type, cls: "bg-gray-100 text-gray-500", icon: ClipboardList };
                                    const IconComp = cfg.icon;
                                    const date = new Date(log.createdAt);
                                    const timeStr =
                                        date.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
                                        + " · "
                                        + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                                    return (
                                        <motion.div
                                            key={log._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                            transition={{ duration: 0.18 }}
                                            className="flex items-center gap-4 px-8 py-4 border-b border-green-50 group hover:bg-green-50/40 transition-colors last:border-0"
                                        >
                                            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full shrink-0 ${cfg.cls}`}>
                                                <IconComp className="w-3.5 h-3.5" />
                                                {cfg.label}
                                            </span>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-green-900">{log.user}</p>
                                                <p className="text-xs text-green-500 truncate mt-0.5">{log.details}</p>
                                            </div>

                                            <span className="text-xs text-green-300 shrink-0 tabular-nums">{timeStr}</span>

                                            {/* Botones — aparecen en hover */}
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                {/* Ocultar solo de MI vista */}
                                                <button
                                                    onClick={() => hideOne(log._id)}
                                                    title="Ocultar de mi vista"
                                                    className="w-8 h-8 rounded-xl flex items-center justify-center text-green-400 hover:bg-green-100 hover:text-green-700 transition-all"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>

                                                {/* Eliminar de BD — solo superadmin */}
                                                {isSuperAdmin && (
                                                    confirming === `one:${log._id}` ? (
                                                        <div className="flex items-center gap-1 ml-1">
                                                            <button
                                                                onClick={() => deleteOneFromDB(log._id)}
                                                                disabled={deleting}
                                                                className="text-[11px] font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg transition-all disabled:opacity-60"
                                                            >
                                                                Sí
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirming(null)}
                                                                className="text-[11px] text-gray-400 hover:text-gray-600 px-1 font-medium"
                                                            >
                                                                No
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setConfirming(`one:${log._id}`)}
                                                            title="Eliminar de la BD permanentemente"
                                                            className="w-8 h-8 rounded-xl flex items-center justify-center text-red-300 hover:bg-red-50 hover:text-red-500 transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-4 border-t border-green-50 bg-gradient-to-r from-green-50/60 to-emerald-50/40 rounded-b-3xl shrink-0">
                        <div className="text-xs text-green-300 text-center flex items-center justify-center gap-1.5">
                            {isSuperAdmin ? (
                                <>
                                    <Key className="w-3.5 h-3.5 shrink-0" />
                                    <span>Como superadmin puedes eliminar registros permanentemente de la base de datos.</span>
                                </>
                            ) : (
                                <>
                                    <Info className="w-3.5 h-3.5 shrink-0" />
                                    <span>Los registros que ocultas solo desaparecen de tu vista. Solo el superadmin puede borrarlos definitivamente.</span>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

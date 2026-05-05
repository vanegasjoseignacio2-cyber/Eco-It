import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, AlertTriangle, Trash2 } from "lucide-react";
import AdminSidebar from "../Admin/adminSlidebar";
import AdminHero from "../Admin/adminHero";
import AdminUsers from "../Admin/adminUsers";
import AdminEstadisticas from "../Admin/adminestadistics";
import AdminEcojuego from "../Admin/Adminecojuego";
import AdminMap from "../Admin/AdminMap";
import AdminImages from "../Admin/AdminImages";
import AdminHelp from "../Admin/AdminHelp";
import AdminSessionTracker from "../Admin/AdminSessionTracker";
import { useToast } from "../../context/ToastContext";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import { fetchAPI } from "../../services/api";

export default function AdminLayout() {
    const [activeSection, setActiveSection] = useState("dashboard");
    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const { showToast } = useToast();
    const { socket } = useSocket();
    const { estaAutenticado, usuario } = useAuth();

    // Lógica de borrado lógico (ocultar) para Admins normales
    const [hiddenNotifIds, setHiddenNotifIds] = useState(() => {
        try {
            const saved = localStorage.getItem(`notif_hidden_${usuario?._id || usuario?.id || 'unknown'}`);
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch { return new Set(); }
    });

    const notificationsVisibles = notifications.filter(n => !hiddenNotifIds.has(String(n._id || n.id)));
    const unreadCount = notificationsVisibles.filter(n => !n.read).length;

    useEffect(() => {
        localStorage.setItem(`notif_hidden_${usuario?._id || usuario?.id || 'unknown'}`, JSON.stringify([...hiddenNotifIds]));
    }, [hiddenNotifIds, usuario]);

    useEffect(() => {
        // Mostrar aviso de seguridad al entrar al panel
        showToast(
            "Seguridad Activa: Sesión protegida (cierre al salir del navegador), inactividad de 5 min detectada y navegación restringida al panel.",
            "info",
            12000
        );
    }, [showToast]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await fetchAPI('/admin/notifications');
                if (data.success) {
                    setNotifications(data.notifications);
                }
            } catch (error) {
                console.error("Error al cargar notificaciones:", error);
            }
        };
        if (estaAutenticado) fetchNotifications();
    }, [estaAutenticado]);

    useEffect(() => {
        if (!socket) return;
        const handleAlertaStr = (data) => {
            // Mostrar Toast temporal
            showToast(
                `⚠️ ALERTA OBSCENA: El usuario ${data.email || data.nombre} acaba de subir una imagen explícita a la IA. El contenido fue bloqueado.`,
                "error",
                10000
            );

            // Almacenar en el Centro de Notificaciones
            setNotifications(prev => [{
                id: data.id || Date.now() + Math.random(),
                type: "alerta_obscena",
                email: data.email,
                nombre: data.nombre,
                fecha: data.fecha,
                read: false
            }, ...prev]);
        };

        const handleUsuarioBaneado = (data) => {
            // Mostrar Toast temporal
            showToast(
                `🔨 USUARIO BANEADO: ${data.nombre} (${data.email}) fue baneado por ${data.adminName}.`,
                "warning",
                10000
            );

            // Almacenar en el Centro de Notificaciones
            setNotifications(prev => [{
                id: data.id || Date.now() + Math.random(),
                type: "usuario_baneado",
                email: data.email,
                nombre: data.nombre,
                adminName: data.adminName,
                dias: data.dias,
                fecha: data.fecha,
                read: false
            }, ...prev]);
        };
        
        socket.on("admin:alerta_obscena", handleAlertaStr);
        socket.on("admin:usuario_baneado", handleUsuarioBaneado);
        return () => {
            socket.off("admin:alerta_obscena", handleAlertaStr);
            socket.off("admin:usuario_baneado", handleUsuarioBaneado);
        };
    }, [socket, showToast]);

    const SECTIONS = {
        dashboard: <AdminHero />,
        users: <AdminUsers />,
        estadisticas: <AdminEstadisticas />,
        ecojuego: <AdminEcojuego />,
        maps: <AdminMap/>,
        images: <AdminImages/>,
        help: <AdminHelp/>
    };

    const markAllAsRead = async () => {
        try {
            await fetchAPI('/admin/notifications/mark-read', {
                method: "PATCH"
            });
            setNotifications(prev => prev.map(n => ({...n, read: true})));
        } catch (error) {
            console.error("Error al marcar como leídas:", error);
        }
    };

    const handleDeleteNotification = async (id) => {
        // Borrado lógico para todos (ocultar de la vista)
        setHiddenNotifIds(prev => new Set([...prev, String(id)]));
    
        // Borrado físico solo si es Superadmin
        if (usuario?.rol === 'superadmin') {
            try {
                await fetchAPI(`/admin/notifications/${id}`, {
                    method: "DELETE"
                });
            } catch (error) {
                console.error("Error al eliminar notificación física:", error);
            }
        }
    };

    const handleClearAll = async () => {
        // Borrado lógico para todos (ocultar de la vista)
        const allIds = notificationsVisibles.map(n => String(n._id || n.id));
        setHiddenNotifIds(prev => new Set([...prev, ...allIds]));

        // Borrado físico solo si es Superadmin
        if (usuario?.rol === 'superadmin') {
            try {
                await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/admin/notifications/all`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications([]);
            } catch (error) {
                console.error("Error al vaciar notificaciones físicamente:", error);
            }
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-green-50 relative">
            <AdminSessionTracker />
            <AdminSidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />
            <main className="flex-1 overflow-y-auto relative">
                {/* Floating Notification Bell */}
                <div className="absolute top-[52px] right-8 z-[40]">
                    <button 
                        onClick={() => setIsNotifOpen(true)}
                        className="relative p-3 bg-white rounded-full shadow-md hover:shadow-xl transition-all duration-300 border border-green-100 group"
                    >
                        <Bell className="w-5 h-5 text-green-600 group-hover:text-green-700 transition-colors" />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-black rounded-full animate-pulse border-2 border-white shadow-sm">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                {SECTIONS[activeSection] || <AdminHero />}
            </main>

            {/* Slide-over Notification Center */}
            <AnimatePresence>
                {isNotifOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setIsNotifOpen(false)}
                            className="fixed inset-0 bg-emerald-950/20 backdrop-blur-sm z-[50]"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[60] flex flex-col border-l border-green-100"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-green-50 bg-gradient-to-br from-green-50 to-white min-h-[84px]">
                                <h2 className="text-lg font-bold text-green-950 flex items-center gap-2">
                                    <div className="p-1.5 bg-green-100 text-green-600 rounded-lg">
                                        <Bell className="w-4 h-4" />
                                    </div>
                                    Notificaciones
                                </h2>
                                <button 
                                    onClick={() => setIsNotifOpen(false)} 
                                    className="p-2 bg-white hover:bg-green-50 border border-transparent hover:border-green-100 rounded-full transition-all"
                                >
                                    <X className="w-4 h-4 text-green-600" />
                                </button>
                            </div>
                            
                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                                {notificationsVisibles.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center px-4 min-h-[84px]">
                                        <div className="w-16 h-16 bg-green-50 text-green-200 rounded-full flex items-center justify-center mb-4">
                                            <Bell className="w-8 h-8" />
                                        </div>
                                        <p className="text-sm font-semibold text-green-900">Todo está tranquilo</p>
                                        <p className="text-xs text-green-600 mt-1">No tienes notificaciones pendientes.</p>
                                    </div>
                                ) : (
                                    notificationsVisibles.map(notif => (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={notif._id || notif.id} 
                                            className={`p-4 rounded-2xl border shadow-sm transition-all group/item ${
                                                notif.read ? 'bg-white border-green-100' : 
                                                (notif.type === 'alerta_obscena' ? 'bg-red-50 border-red-200 shadow-red-100' : 'bg-amber-50 border-amber-200 shadow-amber-100')
                                            } relative`}
                                        >
                                            {/* Botón eliminar individual */}
                                            <button
                                                onClick={() => handleDeleteNotification(notif._id || notif.id)}
                                                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white shadow-sm opacity-0 group-hover/item:opacity-100 transition-all z-10"
                                                title="Eliminar notificación"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>

                                            {!notif.read && (
                                                <span className="absolute top-4 right-4 flex h-2 w-2">
                                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${notif.type === 'alerta_obscena' ? 'bg-red-400' : 'bg-amber-400'}`}></span>
                                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${notif.type === 'alerta_obscena' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                                                </span>
                                            )}
                                            
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-xl shadow-inner ${notif.type === 'alerta_obscena' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                                    <AlertTriangle className="w-5 h-5" />
                                                </div>
                                                <div className="pr-4">
                                                    <p className={`font-bold text-sm ${notif.type === 'alerta_obscena' ? 'text-red-900' : 'text-amber-900'}`}>
                                                        {notif.type === 'alerta_obscena' ? 'Bloqueo de Seguridad IA' : 'Usuario Baneado'}
                                                    </p>
                                                    <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                                                        {notif.type === 'alerta_obscena' ? (
                                                            <>El usuario <span className="font-bold text-slate-900">{notif.email || notif.nombre}</span> intentó analizar contenido obsceno. El evento fue interceptado.</>
                                                        ) : (
                                                            <>El administrador <span className="font-bold text-slate-900">{notif.adminName}</span> ha baneado a <span className="font-bold text-slate-900">{notif.nombre || notif.email}</span> por <span className="font-bold">{notif.dias} días</span>.</>
                                                        )}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 mt-3 font-semibold uppercase tracking-wider">
                                                        {new Date(notif.fecha).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {notificationsVisibles.length > 0 && (
                                <div className="p-4 border-t border-green-50 bg-white space-y-2">
                                    {unreadCount > 0 && (
                                        <button 
                                            onClick={markAllAsRead}
                                            className="w-full py-2.5 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-all shadow-sm"
                                        >
                                            Marcar todas como leídas
                                        </button>
                                    )}
                                    <button 
                                        onClick={handleClearAll}
                                        className="w-full py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Vaciar notificaciones
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    LayoutDashboard,
    Users,
    Gamepad2,
    BarChart3,
    Leaf,
    ChevronRight,
    LogOut,
    Map,
    ImagePlus,
} from "lucide-react";

const navItems = [
    { id: "dashboard",   label: "Dashboard",    icon: LayoutDashboard, badge: null },
    { id: "users",       label: "Usuarios",     icon: Users,           badge: null },
    { id: "estadisticas",label: "Estadísticas", icon: BarChart3,       badge: null },
    { id: "ecojuego",    label: "Eco-Juego",    icon: Gamepad2,        badge: null },
    { id: "maps",        label: "Mapas",        icon: Map,             badge: null },
    { id: "images",        label: "Imágenes",   icon: ImagePlus,       badge: null },
];

export default function AdminSidebar({ activeSection, setActiveSection }) {
    const [collapsed, setCollapsed] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.aside
            animate={{ width: collapsed ? 72 : 240 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative h-screen bg-gradient-to-l from-teal-800 via-emerald-700 to-green-900 flex flex-col shadow-2xl z-20 overflow-hidden"
        >
            {/* Fondo decorativo */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute -top-16 -left-16 w-48 h-48 bg-emerald-400/50 rounded-full blur-3xl"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 5, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-20 -right-10 w-40 h-40 bg-emerald-400 rounded-full blur-3xl"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 7, repeat: Infinity }}
                />
            </div>

            {/* Logo / Header */}
            <div className="relative flex items-center justify-between px-4 py-5 border-b border-white/10">
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-700 flex items-center justify-center shadow-lg">
                                <Leaf className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-semibold text-lg tracking-tight">
                                Eco-It <span className="text-emerald-400 text-lg font-medium ml-1">Admin</span>
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {collapsed && (
                    <div className="mx-auto w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-700 flex items-center justify-center shadow-lg">
                        <Leaf className="w-4 h-4 text-white" />
                    </div>
                )}

                {/* Botón colapsar */}
                {!collapsed && (
                    <motion.button
                        onClick={() => setCollapsed(true)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-white/70 rotate-180" />
                    </motion.button>
                )}
            </div>

            {/* Expand button when collapsed */}
            {collapsed && (
                <button
                    onClick={() => setCollapsed(false)}
                    className="mt-3 mx-auto w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                    <ChevronRight className="w-4 h-4 text-white/70" />
                </button>
            )}

            {/* Nav Items */}
            <nav className="relative flex-1 px-2 py-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            whileHover={{ x: collapsed ? 0 : 4 }}
                            whileTap={{ scale: 0.97 }}
                            className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group border
                                ${isActive
                                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-lime-400/30 shadow-lg"
                                    : "hover:bg-white/10 border-transparent hover:border-lime-400/20"
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-0 top-1/4 -translate-y-1/4 w-1 h-6 bg-lime-500 rounded-r-full"
                                />
                            )}

                            <div className={`flex-shrink-0 ${isActive ? "text-lime-400" : "text-white/60 group-hover:text-white"}`}>
                                <Icon className="w-5 h-5" />
                            </div>

                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.div
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center justify-between flex-1 overflow-hidden"
                                    >
                                        <span className={`text-sm font-medium whitespace-nowrap ${isActive ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                                            {item.label}
                                        </span>
                                        {item.badge && (
                                            <span className="text-xs bg-lime-400 text-green-900 font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                {item.badge}
                                            </span>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </nav>

            {/* Bottom — Cerrar Sesión */}
            <div className="relative px-2 pb-4 border-t border-white/30 pt-3">
                <motion.button
    onClick={handleLogout}
    whileHover={{ x: collapsed ? 0 : 4, scale: 1.02 }}
    whileTap={{ scale: 0.96 }}
    className="
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
        border-2 border-white hover:border-red-600/90
        bg-white/10
        hover:bg-red-600/90
        backdrop-blur-md
        transition-all duration-300
        shadow-sm hover:shadow-red-500/40
        group relative overflow-hidden
    "
>
    {/* Glow animado */}
    <span className="
        absolute inset-0 opacity-0 group-hover:opacity-100
        bg-gradient-to-r from-transparent via-white/20 to-transparent
        translate-x-[-100%] group-hover:translate-x-[100%]
        transition-all duration-700
    " />

    <LogOut className="w-4 h-4 text-white group-hover:text-white transition-colors flex-shrink-0" />

    <AnimatePresence>
        {!collapsed && (
            <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                className="
                    text-sm font-medium
                    text-white group-hover:text-white
                    whitespace-nowrap overflow-hidden
                "
            >
                Cerrar Sesión
            </motion.span>
        )}
    </AnimatePresence>
</motion.button>
            </div>
        </motion.aside>
    );
}
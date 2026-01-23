import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/authContext";
import {
    Leaf,
    Menu,
    X,
    Home,
    Map,
    Phone,
    LogIn,
    UserPlus,
    Gamepad2,
    Bot,
    User,
    Settings,
    LogOut,
    ChevronDown
} from "lucide-react";

const navItems = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Mapas", href: "/maps", icon: Map },
    { name: "Eco-IA", href: "/ai", icon: Bot },
    { name: "Juego", href: "/game", icon: Gamepad2 },
    { name: "Contacto", href: "/contact", icon: Phone },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { usuario, estaAutenticado, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/login');
    };

    // Función para obtener las iniciales del usuario
    const getInitials = (nombre, apellido) => {
        return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-green-100 shadow-md"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">

                    {/* LOGO */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg"
                        >
                            <Leaf className="w-6 h-6 text-white" />
                        </motion.div>
                        <span className="text-2xl font-bold text-black tracking-wide">
                            ECO-IT
                        </span>
                    </Link>

                    {/* LINKS DESKTOP */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link key={item.name} to={item.href}>
                                <motion.div
                                    whileHover={{
                                        y: -3,
                                        scale: 1.05,
                                        boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 250,
                                        damping: 18,
                                    }}
                                    className="px-4 py-2 rounded-full text-green-700 hover:text-white hover:bg-gradient-to-br from-green-500 to-emerald-500 transition-colors duration-300 flex items-center gap-2"
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span className="font-medium">{item.name}</span>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* BOTONES DESKTOP / PERFIL */}
                    <div className="hidden md:flex items-center gap-3">
                        {estaAutenticado ? (
                            // MENÚ DE USUARIO
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all"
                                >
                                    {/* Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-semibold text-sm">
                                        {usuario?.avatar ? (
                                            <img 
                                                src={usuario.avatar} 
                                                alt={usuario.nombre}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            getInitials(usuario?.nombre, usuario?.apellido)
                                        )}
                                    </div>
                                    <span className="font-medium text-sm">
                                        {usuario?.nombre}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </motion.button>

                                {/* DROPDOWN MENU */}
                                <AnimatePresence>
                                    {showUserMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-green-100 overflow-hidden"
                                        >
                                            {/* User Info */}
                                            <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                                                <p className="text-sm font-semibold text-green-900">
                                                    {usuario?.nombre} {usuario?.apellido}
                                                </p>
                                                <p className="text-xs text-green-600 truncate">
                                                    {usuario?.email}
                                                </p>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2">
                                                <Link
                                                    to="/perfil"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-2 text-green-700 hover:bg-green-50 transition-colors"
                                                >
                                                    <User className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Mi Perfil</span>
                                                </Link>
                                                <Link
                                                    to="/configuracion"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-2 text-green-700 hover:bg-green-50 transition-colors"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Configuración</span>
                                                </Link>
                                            </div>

                                            {/* Logout */}
                                            <div className="border-t border-green-100">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Cerrar Sesión</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            // BOTONES DE LOGIN/REGISTRO
                            <>
                                <Link to="/login">
                                    <motion.div
                                        whileHover={{ y: -3, scale: 1.05, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)" }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 250, damping: 18 }}
                                        className="p-[2px] rounded-full bg-gradient-to-r from-green-500 to-emerald-600 inline-block"
                                    >
                                        <button className="px-5 py-2 rounded-full bg-white text-green-600 font-semibold hover:bg-transparent hover:text-white transition-all duration-500 flex items-center gap-2">
                                            <LogIn className="w-4 h-4" />
                                            Ingresar
                                        </button>
                                    </motion.div>
                                </Link>

                                <Link to="/register">
                                    <motion.button
                                        whileHover={{ y: -3, scale: 1.05, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)" }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 250, damping: 18 }}
                                        className="px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg transition-all flex items-center gap-2"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Registro
                                    </motion.button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* BOTÓN MÓVIL */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-green-50 transition-colors text-green-700"
                        aria-controls="mobile-menu"
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* MENÚ MÓVIL */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur border-t border-green-100 overflow-hidden shadow-lg"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {/* User Info Mobile */}
                            {estaAutenticado && (
                                <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                                            {usuario?.avatar ? (
                                                <img 
                                                    src={usuario.avatar} 
                                                    alt={usuario.nombre}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                getInitials(usuario?.nombre, usuario?.apellido)
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-green-900">
                                                {usuario?.nombre} {usuario?.apellido}
                                            </p>
                                            <p className="text-xs text-green-600">
                                                {usuario?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Nav Items */}
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        to={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-all text-green-800"
                                    >
                                        <item.icon className="w-5 h-5 text-green-500" />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                </motion.div>
                            ))}

                            <div className="my-3 border-t border-green-100" />

                            {/* Auth Buttons Mobile */}
                            {estaAutenticado ? (
                                <div className="space-y-2">
                                    <Link to="/perfil" onClick={() => setIsOpen(false)}>
                                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-all text-green-800">
                                            <User className="w-5 h-5 text-green-500" />
                                            <span className="font-medium">Mi Perfil</span>
                                        </button>
                                    </Link>
                                    <Link to="/configuracion" onClick={() => setIsOpen(false)}>
                                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-all text-green-800">
                                            <Settings className="w-5 h-5 text-green-500" />
                                            <span className="font-medium">Configuración</span>
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all text-red-600"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium">Cerrar Sesión</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="w-full px-4 py-2.5 rounded-xl border-2 border-green-500 text-green-600 font-semibold hover:bg-green-50 transition-all"
                                        >
                                            Ingresar
                                        </motion.button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)}>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md"
                                        >
                                            Registro
                                        </motion.button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
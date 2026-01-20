import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "../animations/Animatedsection";
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
    Bot
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
                                        y: -3, //sube en el eje y
                                        scale: 1.05,
                                        boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 250,
                                        damping: 18,
                                    }}
                                    className="
                                        px-4 py-2 rounded-full
                                        text-green-700
                                        hover:text-white
                                        hover:bg-gradient-to-br from-green-500 to-emerald-500
                                        transition-colors duration-300 flex items-center gap-2">
                                    <item.icon className="w-4 h-4" />
                                    <span className="font-medium">{item.name}</span>
                                </motion.div>

                            </Link>

                        ))}
                    </div>

                    {/* BOTONES DESKTOP */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login">
                            <motion.div
                                whileHover={{ y: -3, scale: 1.05, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)", }}
                                whileTap={{ scale: 0.95 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 250,
                                    damping: 18,
                                }}
                                className="p-[2px] rounded-full bg-gradient-to-r from-green-500 to-emerald-600 inline-block"
                            >
                                <button
                                    className="
                                            px-5 py-2 rounded-full
                                            bg-white text-green-600 font-semibold
                                            hover:bg-transparent hover:text-white
                                            transition-all duration-500 flex items-center gap-2"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Ingresar
                                </button>
                            </motion.div>
                        </Link>


                        <Link to="/register">
                            <motion.button
                                whileHover={{ y: -3, scale: 1.05, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)", }}
                                whileTap={{ scale: 0.95 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 250,
                                    damping: 18,
                                }}
                                className="px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg transition-all flex items-center gap-2"
                            >
                                <UserPlus className="w-4 h-4" />
                                Registro
                            </motion.button>
                        </Link>
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

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.12 }}
                                        className="w-full px-4 py-2.5 rounded-xl border-2 border-green-500 text-green-600 font-semibold hover:bg-green-50 transition-all"
                                    >
                                        Ingresar
                                    </motion.button>
                                </Link>
                                <Link to="/register" onClick={() => setIsOpen(false)}>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.15 }}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md"
                                    >
                                        Registro
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

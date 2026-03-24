import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import { useAuth } from "../../context/AuthContext";
import {
    Mail, Phone, Calendar, Edit, LogOut,
    Leaf, TreePine, Award, Recycle, Sprout,
    Trees, ArrowUpRight, Shield, Zap
} from "lucide-react";

// ── Partícula de fondo ────────────────────────────────────────────────────────
function Particle({ style }) {
    return (
        <motion.div
            className="absolute rounded-full pointer-events-none"
            style={style}
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }}
        />
    );
}

// ── Contador animado ──────────────────────────────────────────────────────────
function AnimatedCounter({ value, delay = 0 }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        const timeout = setTimeout(() => {
            const num = parseInt(value);
            if (isNaN(num)) return setDisplay(value);
            let start = 0;
            const step = Math.ceil(num / 40);
            const interval = setInterval(() => {
                start += step;
                if (start >= num) { setDisplay(num); clearInterval(interval); }
                else setDisplay(start);
            }, 30);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timeout);
    }, [value, delay]);
    return <span>{display}</span>;
}

export default function ProfileEcoIt() {
    const { usuario, logout } = useAuth();
    const [userData, setUserData] = useState({
        nombre: "", email: "", edad: "", telefono: "", avatar: "U"
    });
    const [loading, setLoading] = useState(true);
    const [hoveredStat, setHoveredStat] = useState(null);

    useEffect(() => {
        if (usuario) {
            setUserData({
                nombre:   usuario.nombre   || "Usuario",
                email:    usuario.email    || "",
                edad:     usuario.edad     || "--",
                telefono: usuario.telefono || "--",
                avatar:   usuario.nombre   ? usuario.nombre[0].toUpperCase() : "U",
            });
            setLoading(false);
        }
    }, [usuario]);

    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    const stats = [
        { icon: Recycle, label: "Reciclajes", value: "127", color: "#16a34a", bg: "rgba(220,252,231,0.8)" },
        { icon: Award,   label: "Logros",     value: "12",  color: "#059669", bg: "rgba(209,250,229,0.8)" },
        { icon: TreePine,label: "Puntos",     value: "450", color: "#047857", bg: "rgba(187,247,208,0.8)" },
    ];

    const infoFields = [
        { icon: Mail,     label: "Correo electrónico", value: userData.email    },
        { icon: Phone,    label: "Teléfono",            value: userData.telefono },
        { icon: Calendar, label: "Edad",                value: userData.edad     },
    ];

    const particles = Array.from({ length: 12 }, (_, i) => ({
        width:  6 + (i % 4) * 4,
        height: 6 + (i % 4) * 4,
        top:    `${5 + (i * 8) % 90}%`,
        left:   `${3 + (i * 9) % 95}%`,
        background: i % 3 === 0
            ? "rgba(74,222,128,0.18)"
            : i % 3 === 1
            ? "rgba(52,211,153,0.12)"
            : "rgba(16,185,129,0.1)",
    }));

    return (
        <>
            {/* Fuente Sora */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
                .profile-root { font-family: 'Sora', sans-serif; }
                .glow-ring {
                    box-shadow: 0 0 0 3px rgba(74,222,128,0.45),
                                0 0 20px rgba(74,222,128,0.2),
                                0 0 60px rgba(52,211,153,0.1);
                }
                .card-glass {
                    background: rgba(255,255,255,0.78);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(74,222,128,0.3);
                    box-shadow: 0 4px 24px rgba(16,185,129,0.08);
                }
                .stat-glow:hover {
                    box-shadow: 0 8px 32px rgba(74,222,128,0.2);
                }
                .info-row:hover .info-icon-wrap {
                    box-shadow: 0 0 16px rgba(74,222,128,0.3);
                }
            `}</style>

            <div className="profile-root min-h-screen flex flex-col"
                 style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 40%, #ecfdf5 70%, #f0fdf4 100%)" }}>

                <Navbar />

                {/* ── Partículas de fondo ── */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    {particles.map((p, i) => <Particle key={i} style={p} />)}

                    {/* Grid sutil */}
                    <div className="absolute inset-0 opacity-[0.03]"
                         style={{
                             backgroundImage: "linear-gradient(rgba(74,222,128,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.8) 1px, transparent 1px)",
                             backgroundSize: "80px 80px"
                         }} />

                    {/* Orbes */}
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)" }}
                    />
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.12, 0.06] }}
                        transition={{ duration: 11, repeat: Infinity, delay: 3 }}
                        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)" }}
                    />
                </div>

                <main className="flex-1 mt-16 relative z-10 py-12 px-4">
                    <div className="max-w-5xl mx-auto">

                        {/* ── HEADER ── */}
                        <motion.div
                            initial={{ opacity: 0, y: -24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="mb-10 flex items-center justify-between"
                        >
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-3"
                                    style={{ background: "rgba(220,252,231,0.8)", border: "1px solid rgba(74,222,128,0.4)", color: "#16a34a" }}
                                >
                                    <Shield className="w-3.5 h-3.5" />
                                    ESPACIO ECO-IT
                                </motion.div>
                                <h1 className="text-4xl md:text-5xl font-bold"
                                    style={{ color: "#14532d", letterSpacing: "-1.5px" }}>
                                    Mi <span style={{ color: "#16a34a" }}>Perfil</span>
                                </h1>
                            </div>

                            {/* Badge nivel */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, type: "spring" }}
                                className="hidden sm:flex flex-col items-end"
                            >
                                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl"
                                     style={{ background: "rgba(220,252,231,0.8)", border: "1px solid rgba(74,222,128,0.35)" }}>
                                    <Zap className="w-4 h-4" style={{ color: "#16a34a" }} />
                                    <span className="text-sm font-semibold" style={{ color: "#15803d" }}>Eco-Guerrero</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                                          style={{ background: "rgba(74,222,128,0.25)", color: "#15803d" }}>
                                        Nv. 1
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* ── LAYOUT PRINCIPAL ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                            {/* ── COLUMNA IZQUIERDA: Avatar + identidad ── */}
                            <motion.div
                                initial={{ opacity: 0, x: -32 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="lg:col-span-2 flex flex-col gap-5"
                            >
                                {/* Card avatar */}
                                <div className="card-glass rounded-3xl p-8 text-center relative overflow-hidden">
                                    {/* Decoración diagonal */}
                                    <div className="absolute top-0 right-0 w-40 h-40 opacity-5"
                                         style={{ background: "radial-gradient(circle, #4ade80 0%, transparent 70%)" }} />

                                    {/* Avatar con anillo animado */}
                                    <div className="relative inline-block mb-5">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 rounded-full"
                                            style={{
                                                background: "conic-gradient(from 0deg, #4ade80, #059669, #065f46, #4ade80)",
                                                padding: "3px",
                                                margin: "-3px",
                                            }}
                                        />
                                        <motion.div
                                            initial={{ scale: 0, rotate: -20 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", delay: 0.5, stiffness: 180 }}
                                            className="relative w-28 h-28 rounded-full flex items-center justify-center text-4xl font-black glow-ring"
                                            style={{
                                                background: "linear-gradient(145deg, #bbf7d0, #86efac, #4ade80)",
                                                color: "#14532d",
                                                zIndex: 1,
                                            }}
                                        >
                                            {userData.avatar}
                                        </motion.div>
                                    </div>

                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="text-2xl font-bold mb-1"
                                        style={{ color: "#14532d" }}
                                    >
                                        {userData.nombre}
                                    </motion.h2>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                        className="text-sm mb-6 font-medium"
                                        style={{ color: "#16a34a" }}
                                    >
                                        {userData.email}
                                    </motion.p>

                                    {/* Impacto ambiental */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="rounded-2xl p-4 mb-6"
                                        style={{ background: "rgba(220,252,231,0.7)", border: "1px solid rgba(74,222,128,0.3)" }}
                                    >
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <Trees className="w-4 h-4" style={{ color: "#16a34a" }} />
                                            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#15803d" }}>
                                                Impacto Ambiental
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold" style={{ color: "#14532d" }}>
                                            ≈ 5 árboles sembrados
                                        </p>
                                    </motion.div>

                                    {/* Botones */}
                                    <div className="space-y-3">
                                        <Link to="/editarperfil" className="block">
                                            <motion.div
                                                whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(74,222,128,0.35)" }}
                                                whileTap={{ scale: 0.97 }}
                                                className="w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                                                style={{
                                                    background: "linear-gradient(135deg, #16a34a, #059669)",
                                                    color: "#f0fdf4",
                                                }}
                                            >
                                                <Edit className="w-4 h-4" />
                                                Editar perfil
                                                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                                            </motion.div>
                                        </Link>

                                        <motion.button
                                            whileHover={{ scale: 1.02,
                                                backgroundColor: "rgba(239,68,68,0.18)",
                                                color: "#ef4444" 
                                             }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={handleLogout}
                                            className="w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                                            style={{
                                                background: "rgba(239,68,68,0.1)",
                                                border: "1px solid rgba(239,68,68,0.3)",
                                                color: "#f87171" 
                                            }}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Cerrar sesión
                                        </motion.button>
                                    </div>
                                </div>

                    
                            </motion.div>

                            {/* ── COLUMNA DERECHA: Info + stats ── */}
                            <motion.div
                                initial={{ opacity: 0, x: 32 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="lg:col-span-3 flex flex-col gap-5"
                            >
                                {/* Stats en fila */}
                                <div className="grid grid-cols-3 gap-4">
                                    {stats.map((stat, i) => (
                                        <motion.div
                                            key={stat.label}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + i * 0.1 }}
                                            whileHover={{ scale: 1.05, y: -4 }}
                                            onHoverStart={() => setHoveredStat(i)}
                                            onHoverEnd={() => setHoveredStat(null)}
                                            className="card-glass rounded-2xl p-5 text-center cursor-default stat-glow transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                                                 style={{ background: stat.bg, border: `1px solid ${stat.color}30` }}>
                                                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                                            </div>
                                            <p className="text-2xl font-black mb-0.5" style={{ color: stat.color }}>
                                                <AnimatedCounter value={stat.value} delay={600 + i * 100} />
                                            </p>
                                            <p className="text-xs font-medium" style={{ color: "rgba(21,128,61,0.65)" }}>
                                                {stat.label}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Información personal */}
                                <div className="card-glass rounded-3xl p-6 flex-1">
                                    <div className="flex items-center gap-2 mb-5">
                                        <Leaf className="w-4 h-4" style={{ color: "#4ade80" }} />
                                        <h3 className="text-sm font-bold uppercase tracking-widest"
                                            style={{ color: "rgba(21,128,61,0.65)" }}>
                                            Información Personal
                                        </h3>
                                    </div>

                                    <div className="space-y-3">
                                        {infoFields.map((field, i) => (
                                            <motion.div
                                                key={field.label}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.7 + i * 0.1 }}
                                                className="info-row group flex items-center gap-4 p-4 rounded-2xl transition-all cursor-default"
                                                style={{
                                                    background: "rgba(240,253,244,0.8)",
                                                    border: "1px solid rgba(74,222,128,0.2)",
                                                }}
                                                whileHover={{
                                                    background: "rgba(220,252,231,0.9)",
                                                    borderColor: "rgba(74,222,128,0.4)",
                                                }}
                                            >
                                                <div
                                                    className="info-icon-wrap w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                                                    style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}
                                                >
                                                    <field.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" style={{ color: "#4ade80" }} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                                                       style={{ color: "rgba(21,128,61,0.5)" }}>
                                                        {field.label}
                                                    </p>
                                                    <p className="font-semibold text-sm truncate"
                                                       style={{ color: "#14532d" }}>
                                                        {field.value || "—"}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Banner eco */}
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.1 }}
                                    className="rounded-3xl p-5 flex items-center gap-4 relative overflow-hidden"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(220,252,231,0.9) 0%, rgba(187,247,208,0.8) 100%)",
                                        border: "1px solid rgba(74,222,128,0.35)",
                                    }}
                                >
                                    <div className="absolute right-0 top-0 bottom-0 w-32 opacity-5"
                                         style={{ background: "radial-gradient(circle at right, #4ade80, transparent)" }} />

                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                                         style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)" }}>
                                        <Sprout className="w-6 h-6" style={{ color: "#4ade80" }} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm mb-0.5" style={{ color: "#14532d" }}>
                                            Nivel Eco-Guerrero
                                        </p>
                                        <p className="text-xs" style={{ color: "rgba(21,128,61,0.65)" }}>
                                            300 puntos más para alcanzar Nivel 2
                                        </p>
                                        {/* Barra de progreso */}
                                        <div className="mt-2 h-1.5 rounded-full overflow-hidden w-48"
                                             style={{ background: "rgba(74,222,128,0.2)" }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "33%" }}
                                                transition={{ delay: 1.3, duration: 1, ease: "easeOut" }}
                                                className="h-full rounded-full"
                                                style={{ background: "linear-gradient(90deg, #16a34a, #4ade80)" }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
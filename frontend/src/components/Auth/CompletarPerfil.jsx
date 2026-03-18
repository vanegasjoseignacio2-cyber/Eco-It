import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Phone, Calendar, ArrowRight, Leaf,
    CheckCircle2, AlertCircle, Sparkles, TreeDeciduous,
    Recycle, Globe, ChevronRight,
    TreePine,
    Trees,
} from 'lucide-react';

// ── Variantes de animación ───────────────────────────────────────────────────

const pageVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};
const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const slideRight = {
    hidden: { opacity: 0, x: -32 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// ── Íconos flotantes del fondo ───────────────────────────────────────────────
const FLOAT_ICONS = [Leaf, Recycle, TreeDeciduous, Globe, Leaf, Recycle];

export default function CompletarPerfil() {
    const { token, usuario, login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ apellido: '', edad: '', telefono: '' });
    const [focused, setFocused] = useState(null);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const [exito, setExito] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);
        try {
            const res = await fetch('http://localhost:3000/api/auth/completar-perfil', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    apellido: form.apellido,
                    edad: Number(form.edad),
                    telefono: form.telefono,
                }),
            });
            const data = await res.json();
            if (data.success) {
                login(token, data.usuario);
                setExito(true);
                setTimeout(() => navigate('/'), 1800);
            } else {
                setError(data.mensaje || 'Error al guardar los datos.');
            }
        } catch {
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setCargando(false);
        }
    };

    const campos = [
        {
            name: 'apellido', label: 'Apellido', type: 'text',
            placeholder: 'Ej: García Martínez', icon: User,
            hint: 'Como aparece en tu documento',
        },
        {
            name: 'edad', label: 'Edad', type: 'number',
            placeholder: '25', icon: Calendar,
            hint: 'Debes tener al menos 6 años',
            min: 6, max: 110,
        },
        {
            name: 'telefono', label: 'Teléfono', type: 'tel',
            placeholder: '+57 300 123 4567', icon: Phone,
            hint: 'Para notificaciones eco-importantes',
        },
    ];

    const completados = [form.apellido, form.edad, form.telefono].filter(Boolean).length;
    const progreso = (completados / 3) * 100;
    

    return (
        <div className="min-h-screen flex overflow-hidden relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">

            {/* ── Fondo animado ──────────────────────────────────────────────── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {FLOAT_ICONS.map((Icon, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-green-500/10"
                        initial={{ y: '110vh', x: `${8 + i * 16}vw` }}
                        animate={{ y: '-10vh', rotate: 360 }}
                        transition={{
                            duration: 18 + i * 3,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: i * 2.2,
                        }}
                    >
                        <Icon size={32 + i * 10} />
                    </motion.div>
                ))}

                {/* Orbes de fondo */}
                <motion.div
                    className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-300/20 blur-3xl"
                    animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
                    transition={{ duration: 7, repeat: Infinity }}
                />
                <motion.div
                    className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-lime-300/20 blur-3xl"
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
                    transition={{ duration: 9, repeat: Infinity }}
                />
            </div>

            {/* ── Panel izquierdo (ilustración) ─── visible solo en lg ─────── */}
            <motion.div
                variants={slideRight}
                initial="hidden"
                animate="show"
                className="hidden lg:flex flex-col items-center justify-center w-[42%] relative p-12 overflow-hidden"
            >
                {/* Gradiente de fondo del panel */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700" />
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
                        backgroundSize: '36px 36px',
                    }}
                />

                {/* Orbe interno */}
                <motion.div
                    className="absolute top-10 right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 6, repeat: Infinity }}
                />

                {/* Logo — absoluto arriba */}
                <div className="absolute top-10 left-12 z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-500 backdrop-blur flex items-center justify-center">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">Eco-It</span>
                    </div>
                </div>

                {/* Ilustración central */}
                <div className="relative z-10 text-center w-full">
                    {/* Círculo animado con ícono */}
                    <div className="relative mx-auto w-48 h-48">
                        <motion.div
                            className="absolute inset-0 rounded-full bg-white/10"
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute inset-6 rounded-full bg-white/15"
                            animate={{ scale: [1, 1.12, 1] }}
                            transition={{ duration: 4, delay: 0.5, repeat: Infinity }}
                        />
                        <div className="absolute inset-12 rounded-full bg-white/20 flex items-center justify-center">
                            <User className="w-14 h-14 text-white" />
                        </div>

                        {/* Íconos orbitando */}
                        {[Sparkles, Recycle, Leaf].map((Icon, i) => (
                            <motion.div
                                key={i}
                                className="absolute"
                                style={{
                                    top: `${50 + 44 * Math.sin((i * 2 * Math.PI) / 3)}%`,
                                    left: `${50 + 44 * Math.cos((i * 2 * Math.PI) / 3)}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                                animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }}
                                transition={{ duration: 2.5, delay: i * 0.6, repeat: Infinity }}
                            >
                                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-3 leading-snug">
                        Únete a la comunidad<br />
                        <span className="text-lime-300">más verde 🌿</span>
                    </h2>
                    <p className="text-white/70 text-base leading-relaxed max-w-xs mx-auto">
                        Con tu perfil completo podrás descubrir puntos de reciclaje, ganar puntos ecológicos y marcar la diferencia.
                    </p>
                </div>

                {/* Pasos del proceso */}
                <div className="relative z-10 space-y-3 w-full mt-8">
                    {['Registro con Google', 'Completa tu perfil', 'Explora Eco-It'].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all
                                ${i < 1 ? 'bg-white text-green-700' : i === 1 ? 'bg-lime-400 text-green-900' : 'bg-white/20 text-white/60'}`}>
                                {i < 1 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                            </div>
                            <span className={`text-sm font-medium ${i === 1 ? 'text-white' : i < 1 ? 'text-white/60 line-through' : 'text-white/40'}`}>
                                {step}
                            </span>
                            {i < 2 && <div className="flex-1 h-px bg-white/10" />}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── Panel derecho (formulario) ────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
                <motion.div
                    variants={pageVariants}
                    initial="hidden"
                    animate="show"
                    className="w-full max-w-md"
                >
                    {/* Card */}
                    <motion.div
                        variants={fadeUp}
                        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-green-500/10 border border-white/60 overflow-hidden"
                    >
                        {/* Barra de progreso superior */}
                        <div className="h-1 bg-green-100">
                            <motion.div
                                className="h-full bg-gradient-to-r from-lime-500 to-green-500 rounded-full"
                                animate={{ width: `${progreso}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        </div>

                        <div className="p-8">
                            {/* Header */}
                            <motion.div variants={fadeUp} className="mb-8">
                                <div className="flex items-center justify-between mb-5">
                                    {/* Avatar del usuario */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-lime-500 via-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                            {usuario?.nombre?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-green-900">{usuario?.nombre}</p>
                                            <p className="text-xs text-green-400">{usuario?.email}</p>
                                        </div>
                                    </div>

                                    {/* Badge progreso */}
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-100">
                                        <div className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                                        <span className="text-xs font-semibold text-green-600">
                                            {completados}/3
                                        </span>
                                    </div>
                                </div>

                                <h1 className="text-2xl font-bold text-green-950 mb-1.5 flex items-center gap-2">
                                    Completa tu perfil <Trees className='inline text-green-600'/>
                                </h1>
                                <p className="text-sm text-green-500 leading-relaxed">
                                    Solo faltan unos datos para unirte a la comunidad Eco-It.
                                </p>
                            </motion.div>

                            {/* Estado de éxito */}
                            <AnimatePresence>
                                {exito && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center gap-3 shadow-lg"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">¡Perfil completado! </p>
                                            <p className="text-white/80 text-xs mt-0.5">Redirigiendo a Eco-It...</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.97 }}
                                        className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-2.5"
                                    >
                                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-700 font-medium">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Formulario */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {campos.map((campo, i) => {
                                    const Icon = campo.icon;
                                    const isFocused = focused === campo.name;
                                    const hasValue = Boolean(form[campo.name]);

                                    return (
                                        <motion.div
                                            key={campo.name}
                                            variants={fadeUp}
                                            custom={i}
                                        >
                                            <label className="block text-xs font-bold text-green-700 uppercase tracking-wider mb-2">
                                                {campo.label}
                                            </label>

                                            <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-200 overflow-hidden
                                                ${isFocused
                                                    ? 'border-green-400 bg-white shadow-lg shadow-green-500/10'
                                                    : hasValue
                                                        ? 'border-green-200 bg-white'
                                                        : 'border-green-100 bg-green-50/50 hover:border-green-200'
                                                }`}
                                            >
                                                {/* Ícono izquierdo */}
                                                <div className={`pl-4 flex items-center flex-shrink-0 transition-colors duration-200
                                                    ${isFocused ? 'text-green-500' : 'text-green-300'}`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                </div>

                                                <input
                                                    type={campo.type}
                                                    name={campo.name}
                                                    value={form[campo.name]}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocused(campo.name)}
                                                    onBlur={() => setFocused(null)}
                                                    placeholder={campo.placeholder}
                                                    required
                                                    min={campo.min}
                                                    max={campo.max}
                                                    disabled={cargando || exito}
                                                    className="flex-1 px-3 py-3.5 bg-transparent text-sm text-green-900 placeholder:text-green-300 focus:outline-none disabled:opacity-50"
                                                />

                                                {/* Check si tiene valor */}
                                                <AnimatePresence>
                                                    {hasValue && !isFocused && (
                                                        <motion.div
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0, opacity: 0 }}
                                                            className="pr-4"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Hint con animación */}
                                            <AnimatePresence>
                                                {isFocused && (
                                                    <motion.p
                                                        initial={{ opacity: 0, height: 0, y: -4 }}
                                                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="mt-1.5 text-xs text-green-400 flex items-center gap-1.5 pl-1 overflow-hidden"
                                                    >
                                                        <Sparkles className="w-3 h-3 flex-shrink-0" />
                                                        {campo.hint}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}

                                {/* Botón submit */}
                                <motion.div variants={fadeUp} className="pt-2">
                                    <motion.button
                                        type="submit"
                                        disabled={cargando || exito}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-base shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {cargando ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Guardando perfil...
                                            </>
                                        ) : exito ? (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                ¡Listo! Redirigiendo...
                                            </>
                                        ) : (
                                            <>
                                                Guardar y continuar
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </form>

                            {/* Footer */}
                            <motion.div variants={fadeUp} className="mt-4 pt-5 border-t border-green-50">
                                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Leaf className="w-3.5 h-3.5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-green-700 mb-0.5">¿Por qué pedimos esto?</p>
                                        <p className="text-xs text-green-500 leading-relaxed">
                                            Estos datos nos ayudan a personalizar tu experiencia ecológica y conectarte con puntos de reciclaje cercanos.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-1 mt-4 text-xs text-green-300">
                                    <span>Eco-It</span>
                                    <ChevronRight className="w-3 h-3" />
                                    <span>Completar perfil</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
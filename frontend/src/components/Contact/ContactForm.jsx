import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, SendHorizonal, AlertCircle, User, Lock } from "lucide-react";
import ViewportMotion from "../animations/ViewportMotion";
import SendButton from "../button/Buttom";
import { useAuth } from "../../context/AuthContext";

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ContactForm() {
    const { usuario, estaAutenticado } = useAuth();

    // Normalizar usuario del contexto (funciona para Google y registro manual)
    const user = estaAutenticado && usuario ? {
        id:   usuario._id || usuario.id || null,
        name: usuario.nombre || usuario.name || '',
        email: usuario.email || '',
    } : null;
    const [formData, setFormData] = useState({
        name:    '',
        email:   '',
        subject: '',
        message: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError]         = useState('');

    // ── Sincronizar datos del usuario cuando cambia la sesión ────────────────
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name:  user.name,
                email: user.email,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                name:  '',
                email: '',
            }));
        }
    }, [estaAutenticado]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleChange = (e) => {
        // Si el usuario está logueado, name y email son de solo lectura
        if (user && (e.target.name === 'name' || e.target.name === 'email')) return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const body = {
                name:    formData.name.trim(),
                email:   formData.email.trim(),
                subject: formData.subject,
                message: formData.message.trim(),
                userId:  user?.id || null,   // null si es invitado
            };

            const res = await fetch('/api/contact', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(body),
            });

            const data = await res.json();

            if (data.success) {
                setIsSuccess(true);
                // Limpiar solo asunto y mensaje (name/email se mantienen si está logueado)
                setFormData(prev => ({
                    ...prev,
                    subject: '',
                    message: user ? prev.message.replace(prev.message, '') : '',
                }));
                setFormData(prev => ({
                    name:    user ? prev.name  : '',
                    email:   user ? prev.email : '',
                    subject: '',
                    message: '',
                }));
                setTimeout(() => setIsSuccess(false), 6000);
            } else {
                setError(data.mensaje || 'Error al enviar el mensaje.');
            }
        } catch (err) {
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    // ── Estilos reutilizables ─────────────────────────────────────────────────
    const inputBase =
        'w-full px-4 py-3 rounded-xl border-2 border-green-300 focus:border-green-500 ' +
        'focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white/50 text-green-900 ' +
        'placeholder-green-400';

    const inputReadOnly =
        'w-full px-4 py-3 rounded-xl border-2 border-green-200 bg-green-50/70 ' +
        'text-green-800 cursor-not-allowed select-none outline-none';

    return (
        <ViewportMotion direction="left">
            <div className="glass-card rounded-3xl p-8 md:p-10 shadow-xl bg-white/60 border-2 border-green-300">

                {/* Cabecera */}
                <h2 className="text-2xl flex gap-2 items-center md:text-3xl font-bold text-green-900 mb-2">
                    <SendHorizonal className="w-6 h-6 inline" />
                    Envíanos un mensaje
                </h2>
                <p className="text-green-600 mb-1">
                    Completa el formulario y te responderemos lo antes posible.
                </p>

                {/* Badge de estado de sesión */}
                <div className="mb-6">
                    {user ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                                         bg-green-100 text-green-700 border border-green-300
                                         px-3 py-1 rounded-full">
                            <User className="w-3.5 h-3.5" />
                            Enviando como {user.name}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                                         bg-amber-50 text-amber-700 border border-amber-300
                                         px-3 py-1 rounded-full">
                            <User className="w-3.5 h-3.5" />
                            Enviando como invitado
                        </span>
                    )}
                </div>

                {/* ── Banner de éxito ── */}
                <AnimatePresence>
                    {isSuccess && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 rounded-xl bg-green-100 border border-green-300
                                       flex items-center gap-3"
                        >
                            <CheckCircle className="w-6 h-6 text-green-700 shrink-0" />
                            <div>
                                <p className="font-semibold text-green-900">¡Mensaje enviado!</p>
                                <p className="text-sm text-green-700">
                                    Recibimos tu mensaje. Te responderemos pronto.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Banner de error ── */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200
                                       flex items-center gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Formulario ── */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Nombre y Correo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        {/* Nombre */}
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-green-800 flex items-center gap-1">
                                Nombre
                                {user && (
                                    <Lock className="w-3 h-3 text-green-400" title="Autocompletado con tu cuenta" />
                                )}
                            </span>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Tu nombre"
                                required
                                readOnly={!!user}
                                className={user ? inputReadOnly : inputBase}
                            />
                        </div>

                        {/* Correo */}
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-green-800 flex items-center gap-1">
                                Correo
                                {user && (
                                    <Lock className="w-3 h-3 text-green-400" title="Autocompletado con tu cuenta" />
                                )}
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                required
                                readOnly={!!user}
                                className={user ? inputReadOnly : inputBase}
                            />
                        </div>

                    </div>

                    {/* Asunto */}
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-green-800">Asunto</span>
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className={inputBase}
                        >
                            <option value="">Selecciona un asunto</option>
                            <option value="general">Consulta general</option>
                            <option value="support">Soporte técnico</option>
                            <option value="suggestion">Sugerencia</option>
                            <option value="partnership">Colaboración</option>
                        </select>
                    </div>

                    {/* Mensaje */}
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-green-800">Mensaje</span>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            placeholder="¿En qué podemos ayudarte?"
                            required
                            className={`${inputBase} resize-none`}
                        />
                    </div>

                    <SendButton isLoading={isLoading} isSuccess={isSuccess} />
                </form>

            </div>
        </ViewportMotion>
    );
}
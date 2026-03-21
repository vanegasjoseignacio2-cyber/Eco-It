import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    UserPlus,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Leaf,
    ArrowRight,
    User,
    Check,
    Phone,
    AlertCircle,
    ShieldCheck,
    RotateCcw,
    CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// ─── Helpers de API ───────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const enviarCodigo = (datos) =>
    fetch(`${API}/api/auth/enviar-codigo-registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
    }).then(r => r.json());

const verificarCodigo = (email, codigo) =>
    fetch(`${API}/api/auth/verificar-registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo }),
    }).then(r => r.json());

const reenviarCodigo = (email) =>
    fetch(`${API}/api/auth/reenviar-codigo-registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    }).then(r => r.json());

// ─── Temporizador desde localStorage ─────────────────────────────────────────
const calcTimeLeft = () => {
    const expiry = localStorage.getItem('reg_code_expiry');
    if (!expiry) return 0;
    const secs = Math.floor((parseInt(expiry) - Date.now()) / 1000);
    return secs > 0 ? secs : 0;
};

export default function RegisterForm() {
    const navigate = useNavigate();
    const { login } = useAuth();

    // ── Paso ─────────────────────────────────────────────────────────────────
    const [step, setStep] = useState('form'); // 'form' | 'code'

    // ── Estado formulario (idéntico al original) ──────────────────────────────
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [touched, setTouched] = useState({});

    // ── Estado paso 2 ────────────────────────────────────────────────────────
    const [codigo, setCodigo] = useState("");
    const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

    // ── Estado compartido ────────────────────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // ── Temporizador ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (timeLeft <= 0) return;
        const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft]);

    const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    // ── Validaciones (idénticas al original) ──────────────────────────────────
    const isEmpty = (v) => !v || v.toString().trim() === "";

    const passwordRequirements = [
        { text: "Al menos 8 caracteres",    met: password.length >= 8 },
        { text: "Una letra mayúscula",       met: /[A-Z]/.test(password) },
        { text: "Una letra minúscula",       met: /[a-z]/.test(password) },
        { text: "Un número",                 met: /[0-9]/.test(password) },
        { text: "Las contraseñas coinciden", met: password === confirmPassword && password.length > 0 },
    ];

    const requiredFieldsValid =
        !isEmpty(name) &&
        !isEmpty(lastname) &&
        !isEmpty(age) &&
        !isEmpty(email) &&
        !isEmpty(phone) &&
        !isEmpty(password) &&
        !isEmpty(confirmPassword);

    const formValid = passwordRequirements.every((req) => req.met) && acceptTerms && requiredFieldsValid;

    // ── Submit paso 1: enviar código ──────────────────────────────────────────
    const handleSubmit = async (e) => {
        e?.preventDefault?.();

        setTouched({
            name: true, lastname: true, age: true, email: true,
            phone: true, password: true, confirmPassword: true, acceptTerms: true,
        });

        setError("");
        setSuccessMessage("");

        if (!formValid) {
            setError("Por favor completa todos los campos correctamente");
            return;
        }

        setLoading(true);
        try {
            const data = await enviarCodigo({
                nombre:   name.trim(),
                apellido: lastname.trim(),
                email:    email.trim().toLowerCase(),
                telefono: phone.trim(),
                password,
                edad:     parseInt(age),
            });

            if (data.success) {
                localStorage.setItem('reg_code_expiry', Date.now() + 3 * 60 * 1000);
                setTimeLeft(180);
                setStep('code');
            } else {
                if (data.mensaje?.includes('ya tiene una cuenta')) {
                    setError("Este correo electrónico ya está registrado. ¿Quieres iniciar sesión?");
                } else {
                    setError(data.mensaje || "Error al enviar el código.");
                }
            }
        } catch {
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    // ── Submit paso 2: verificar código ───────────────────────────────────────
    const handleCodeSubmit = async (e) => {
        e?.preventDefault?.();
        setError("");
        setSuccessMessage("");

        if (!/^\d{6}$/.test(codigo)) {
            setError("El código debe tener exactamente 6 dígitos.");
            return;
        }

        setLoading(true);
        try {
            const data = await verificarCodigo(email.trim().toLowerCase(), codigo.trim());

            if (data.success) {
                localStorage.removeItem('reg_code_expiry');
                login(data.data.token, data.data.usuario);
                setSuccessMessage("¡Registro exitoso! Redirigiendo...");
                setTimeout(() => navigate('/'), 1500);
            } else {
                setError(data.mensaje || "Código incorrecto.");
            }
        } catch {
            setError("Error de conexión. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    // ── Reenviar código ───────────────────────────────────────────────────────
    const handleReenviar = async () => {
        if (timeLeft > 0 || loading) return;
        setError("");
        setLoading(true);
        try {
            const data = await reenviarCodigo(email.trim().toLowerCase());
            if (data.success) {
                localStorage.setItem('reg_code_expiry', Date.now() + 3 * 60 * 1000);
                setTimeLeft(180);
                setCodigo("");
            } else {
                setError(data.mensaje || "Error al reenviar.");
            }
        } catch {
            setError("Error de conexión. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-xl px-4 lg:px-0 flex-shrink-0">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="relative w-full mx-auto lg:mx-0"
            >
                <div className="p-6 max-w-xl sm:p-8 rounded-3xl bg-white/60 backdrop-blur-xl border-2 border-green-100 shadow-2xl">

                    <AnimatePresence mode="wait">

                    {/* ════════════════════════════════════════════════════════
                        PASO 1 — FORMULARIO DE REGISTRO (layout original)
                    ════════════════════════════════════════════════════════ */}
                    {step === 'form' && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* Header */}
                        <div className="text-center mb-6 sm:mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.4 }}
                                className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-4 shadow-lg"
                            >
                                <Leaf className="w-8 h-8 text-white" />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="text-2xl sm:text-3xl font-bold text-green-900 mb-2"
                            >
                                Únete a Eco-It
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                className="text-sm sm:text-base text-green-600"
                            >
                                Crea tu cuenta y comienza a reciclar
                            </motion.p>
                        </div>

                        {/* Mensajes de error y éxito */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800">{error}</p>
                            </motion.div>
                        )}

                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
                            >
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-green-800">{successMessage}</p>
                            </motion.div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

                            {/* Nombre y Apellido */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7, duration: 0.6 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-green-900 mb-2">Nombre</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                                            placeholder="Tu nombre"
                                            disabled={loading}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-green-900 placeholder:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed ${touched.name && isEmpty(name) ? "border-red-400" : "border-green-200"}`}
                                            required
                                        />
                                    </div>
                                    {touched.name && isEmpty(name) && (
                                        <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-green-900 mb-2">Apellido</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                                        <input
                                            type="text"
                                            value={lastname}
                                            onChange={(e) => setLastname(e.target.value)}
                                            onBlur={() => setTouched((t) => ({ ...t, lastname: true }))}
                                            placeholder="Tu apellido"
                                            disabled={loading}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-green-900 placeholder:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed ${touched.lastname && isEmpty(lastname) ? "border-red-400" : "border-green-200"}`}
                                            required
                                        />
                                    </div>
                                    {touched.lastname && isEmpty(lastname) && (
                                        <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Edad */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.75, duration: 0.6 }}
                            >
                                <label className="block text-sm font-medium text-green-900 mb-2">Edad</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        onBlur={() => setTouched((t) => ({ ...t, age: true }))}
                                        placeholder="Tu edad"
                                        min="1"
                                        disabled={loading}
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-green-900 placeholder:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed ${touched.age && isEmpty(age) ? "border-red-400" : "border-green-200"}`}
                                        required
                                    />
                                </div>
                                {touched.age && isEmpty(age) && (
                                    <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                                )}
                            </motion.div>

                            {/* Email */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                            >
                                <label className="block text-sm font-medium text-green-900 mb-2">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                                        placeholder="tu@email.com"
                                        disabled={loading}
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-green-900 placeholder:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed ${touched.email && isEmpty(email) ? "border-red-400" : "border-green-200"}`}
                                        required
                                    />
                                </div>
                                {touched.email && isEmpty(email) && (
                                    <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                                )}
                            </motion.div>

                            {/* Teléfono */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.85, duration: 0.6 }}
                            >
                                <label className="block text-sm font-medium text-green-900 mb-2">Teléfono</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                                        placeholder="+57 300 123 4567"
                                        disabled={loading}
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-green-900 placeholder:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed ${touched.phone && isEmpty(phone) ? "border-red-400" : "border-green-200"}`}
                                        required
                                    />
                                </div>
                                {touched.phone && isEmpty(phone) && (
                                    <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                                )}
                            </motion.div>

                            {/* Contraseña */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9, duration: 0.6 }}
                            >
                                <label className="block text-sm font-medium text-green-900 mb-2">Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                                        placeholder="••••••••"
                                        disabled={loading}
                                        className={`w-full pl-12 pr-12 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-green-900 placeholder:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed ${touched.password && isEmpty(password) ? "border-red-400" : "border-green-200"}`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-800 transition-colors disabled:opacity-50"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {touched.password && isEmpty(password) && (
                                    <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                                )}
                            </motion.div>

                            {/* Confirmar Contraseña */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.0, duration: 0.6 }}
                            >
                                <label className="block text-sm font-medium text-green-900 mb-2">Confirmar Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                                        placeholder="••••••••"
                                        disabled={loading}
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-green-900 placeholder:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed ${touched.confirmPassword && isEmpty(confirmPassword) ? "border-red-400" : "border-green-200"}`}
                                        required
                                    />
                                </div>
                                {touched.confirmPassword && isEmpty(confirmPassword) && (
                                    <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                                )}
                            </motion.div>

                            {/* Requisitos de contraseña — lista vertical (igual que el original) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1, duration: 0.6 }}
                                className="space-y-2 pt-2"
                            >
                                {passwordRequirements.map((req, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.2 + i * 0.1, duration: 0.4 }}
                                        className={`flex items-center gap-2 text-xs sm:text-sm transition-colors ${req.met ? "text-green-600" : "text-gray-500"}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${req.met ? "bg-green-500 scale-100" : "bg-gray-300 scale-90"}`}>
                                            {req.met && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        {req.text}
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Términos */}
                            <motion.label
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.6, duration: 0.6 }}
                                className="flex items-start gap-2 cursor-pointer text-xs sm:text-sm text-green-800"
                            >
                                <input
                                    type="checkbox"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    onBlur={() => setTouched((t) => ({ ...t, acceptTerms: true }))}
                                    disabled={loading}
                                    className="rounded border-green-300 mt-1 text-green-600 focus:ring-green-500 cursor-pointer disabled:opacity-50"
                                    required
                                />
                                <span>
                                    Acepto los{" "}
                                    <a href="#" className="text-green-600 font-semibold hover:underline">términos de servicio</a>
                                    {" "}y la{" "}
                                    <a href="#" className="text-green-600 font-semibold hover:underline">política de privacidad</a>
                                </span>
                            </motion.label>
                            {touched.acceptTerms && !acceptTerms && (
                                <p className="text-xs text-red-600 mt-1">Debe aceptar los términos para continuar</p>
                            )}

                            {/* Botón submit */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.7, duration: 0.6 }}
                            >
                                <motion.button
                                    type="submit"
                                    whileHover={formValid && !loading ? { scale: 1.02 } : {}}
                                    whileTap={formValid && !loading ? { scale: 0.98 } : {}}
                                    disabled={!formValid || loading}
                                    className={`w-full py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${formValid && !loading
                                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-green-500/25 cursor-pointer"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Enviando código...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5" />
                                            Crear Cuenta
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        </form>

                        {/* Login Link */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.8, duration: 0.6 }}
                            className="mt-6 sm:mt-8 text-center"
                        >
                            <p className="text-sm text-green-700">
                                ¿Ya tienes una cuenta?{" "}
                                <a href="/login" className="text-green-600 font-semibold hover:underline">Inicia sesión</a>
                            </p>
                        </motion.div>
                    </motion.div>
                    )}

                    {/* ════════════════════════════════════════════════════════
                        PASO 2 — VERIFICAR CÓDIGO
                    ════════════════════════════════════════════════════════ */}
                    {step === 'code' && (
                    <motion.div
                        key="code"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* Header */}
                        <div className="text-center mb-6 sm:mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.1 }}
                                className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center mb-4 shadow-lg"
                            >
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </motion.div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-green-900 mb-2">
                                Verifica tu correo
                            </h2>
                            <p className="text-sm sm:text-base text-green-600">
                                Enviamos un código de 6 dígitos a
                            </p>
                            <p className="text-sm sm:text-base text-green-800 font-semibold mt-0.5">
                                {email}
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800">{error}</p>
                            </motion.div>
                        )}

                        {/* Éxito */}
                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
                            >
                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-green-800">{successMessage}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleCodeSubmit} className="space-y-4 sm:space-y-5">

                            {/* Input código */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                <label className="block text-sm font-medium text-green-900 mb-2">
                                    Código de verificación
                                </label>
                                <input
                                    type="text"
                                    value={codigo}
                                    onChange={e => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength={6}
                                    inputMode="numeric"
                                    placeholder="000000"
                                    disabled={loading}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-green-200 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-center text-3xl font-bold tracking-[0.4em] text-green-900 placeholder:text-green-200"
                                />
                            </motion.div>

                            {/* Temporizador y reenviar */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center justify-between"
                            >
                                <span className={`text-sm ${timeLeft > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {timeLeft > 0
                                        ? `⏱️ Expira en ${formatTime(timeLeft)}`
                                        : '⚠️ Código expirado'}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleReenviar}
                                    disabled={timeLeft > 0 || loading}
                                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${timeLeft > 0 || loading
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-green-600 hover:text-green-800 hover:underline'}`}
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Reenviar código
                                </button>
                            </motion.div>

                            {/* Botón verificar */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                <motion.button
                                    type="submit"
                                    whileHover={!loading ? { scale: 1.02 } : {}}
                                    whileTap={!loading ? { scale: 0.98 } : {}}
                                    disabled={loading || codigo.length !== 6}
                                    className={`w-full py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${!loading && codigo.length === 6
                                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-green-500/25 cursor-pointer"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Verificando...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-5 h-5" />
                                            Verificar y crear cuenta
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        </form>

                        {/* Volver */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6 sm:mt-8 text-center"
                        >
                            <button
                                type="button"
                                onClick={() => { setStep('form'); setError(''); setCodigo(''); setSuccessMessage(''); }}
                                className="text-sm text-green-600 font-semibold hover:underline"
                            >
                                ← Volver y editar mis datos
                            </button>
                        </motion.div>
                    </motion.div>
                    )}

                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
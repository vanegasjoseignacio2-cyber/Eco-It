import { useState } from "react";
import { motion } from "framer-motion";
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
    Phone
} from "lucide-react";

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [touched, setTouched] = useState({});

    const isEmpty = (v) => !v || v.trim() === "";

    const passwordRequirements = [
        { text: "Al menos 8 caracteres", met: password.length >= 8 },
        { text: "Una letra mayúscula", met: /[A-Z]/.test(password) },
        { text: "Una letra minúscula", met: /[a-z]/.test(password) },
        { text: "Un número", met: /[0-9]/.test(password) },
        { text: "Las contraseñas coinciden", met: password === confirmPassword && password.length > 0 },
    ];

    const requiredFieldsValid =
        !isEmpty(name) &&
        !isEmpty(lastname) &&
        !isEmpty(email) &&
        !isEmpty(phone) &&
        !isEmpty(password) &&
        !isEmpty(confirmPassword);

    const formValid = passwordRequirements.every((req) => req.met) && acceptTerms && requiredFieldsValid;

    const handleSubmit = (e) => {
        e?.preventDefault?.();
        setTouched({
            name: true,
            lastname: true,
            email: true,
            phone: true,
            password: true,
            confirmPassword: true,
            acceptTerms: true,
        });
        if (!formValid) return;
        // Lógica de registro
        console.log({ name, lastname, email, phone, password, acceptTerms });
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

                    {/* Form */}
                    <div className="space-y-4 sm:space-y-5">
                        {/* Name and Lastname Fields */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-green-900 mb-2">
                                    Nombre
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                                        placeholder="Tu nombre"
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-green-900 placeholder:text-green-400 ${touched.name && isEmpty(name) ? "border-red-400" : "border-green-200"}`}
                                        required
                                    />
                                </div>
                                {touched.name && isEmpty(name) && (
                                    <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-green-900 mb-2">
                                    Apellido
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                                    <input
                                        type="text"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                        onBlur={() => setTouched((t) => ({ ...t, lastname: true }))}
                                        placeholder="Tu apellido"
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-green-900 placeholder:text-green-400 ${touched.lastname && isEmpty(lastname) ? "border-red-400" : "border-green-200"}`}
                                        required
                                    />
                                </div>
                                {touched.lastname && isEmpty(lastname) && (
                                    <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Email Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            <label className="block text-sm font-medium text-green-900 mb-2">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                                    placeholder="tu@email.com"
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-green-900 placeholder:text-green-400 ${touched.email && isEmpty(email) ? "border-red-400" : "border-green-200"}`}
                                    required
                                />
                            </div>
                            {touched.email && isEmpty(email) && (
                                <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                            )}
                        </motion.div>

                        {/* Phone Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.85, duration: 0.6 }}
                        >
                            <label className="block text-sm font-medium text-green-900 mb-2">
                                Teléfono
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                                    placeholder="+57 300 123 4567"
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-green-900 placeholder:text-green-400 ${touched.phone && isEmpty(phone) ? "border-red-400" : "border-green-200"}`}
                                    required
                                />
                            </div>
                            {touched.phone && isEmpty(phone) && (
                                <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                            )}
                        </motion.div>

                        {/* Password Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                        >
                            <label className="block text-sm font-medium text-green-900 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-12 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-green-900 placeholder:text-green-400 ${(touched.password && isEmpty(password)) ? "border-red-400" : "border-green-200"}`}
                                    required
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-800 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {touched.password && isEmpty(password) && (
                                <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                            )}
                        </motion.div>

                        {/* Confirm Password Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.0, duration: 0.6 }}
                        >
                            <label className="block text-sm font-medium text-green-900 mb-2">
                                Confirmar Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-green-900 placeholder:text-green-400 ${(touched.confirmPassword && isEmpty(confirmPassword)) ? "border-red-400" : "border-green-200"}`}
                                    required
                                />
                            </div>
                            {touched.confirmPassword && isEmpty(confirmPassword) && (
                                <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>
                            )}
                        </motion.div>

                        {/* Password Requirements */}
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
                                    <div
                                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${req.met ? "bg-green-500 scale-100" : "bg-gray-300 scale-90"}`}
                                    >
                                        {req.met && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    {req.text}
                                </motion.div>
                            ))}
                            {touched.password && !passwordRequirements.every(r => r.met) && (
                                <p className="text-xs text-red-600 mt-1">La contraseña debe cumplir todos los requisitos.</p>
                            )}
                        </motion.div>

                        {/* Terms Checkbox */}
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
                                className="rounded border-green-300 mt-1 text-green-600 focus:ring-green-500 cursor-pointer"
                                required
                            />
                            <span>
                                Acepto los{" "}
                                <a href="#" className="text-green-600 font-semibold hover:underline">
                                    términos de servicio
                                </a>{" "}
                                y la{" "}
                                <a href="#" className="text-green-600 font-semibold hover:underline">
                                    política de privacidad
                                </a>
                            </span>
                        </motion.label>
                        {touched.acceptTerms && !acceptTerms && (
                            <p className="text-xs text-red-600 mt-1">Debe aceptar los términos para continuar</p>
                        )}

                        {/* Submit Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.7, duration: 0.6 }}
                        >
                            <motion.button
                                whileHover={formValid ? { scale: 1.02 } : {}}
                                whileTap={formValid ? { scale: 0.98 } : {}}
                                onClick={handleSubmit}
                                disabled={!formValid}
                                className={`w-full py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${formValid
                                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-green-500/25 cursor-pointer"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                <UserPlus className="w-5 h-5" />
                                Crear Cuenta
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Login Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8, duration: 0.6 }}
                        className="mt-6 sm:mt-8 text-center"
                    >
                        <p className="text-sm text-green-700">
                            ¿Ya tienes una cuenta?{" "}
                            <a href="/login" className="text-green-600 font-semibold hover:underline">
                                Inicia sesión
                            </a>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
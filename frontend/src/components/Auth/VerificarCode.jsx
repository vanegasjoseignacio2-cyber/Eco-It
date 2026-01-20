import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Eye, EyeOff, Lock, Mail, Sparkles, ShieldCheck, User } from "lucide-react";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
export default function VerifyCode() {
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setCode(value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError("");
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setPasswordError("");
    };

    const handleSubmit = () => {
        if (code.length !== 6) {
            setPasswordError("Por favor ingresa un código válido de 6 dígitos");
            return;
        }

        if (password.length < 8) {
            setPasswordError("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError("Las contraseñas no coinciden");
            return;
        }

        setIsLoading(true);
        // Aquí iría la lógica de verificación
        setTimeout(() => {
            setIsLoading(false);
            alert("Contraseña cambiada exitosamente");
        }, 2000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">

            {/* Navbar */}
            <Navbar />



            <main className="min-h-screen mt-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden py-6 sm:py-12 px-4">
                {/* Hojas flotantes de fondo */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-green-600/10"
                            initial={{ y: "100vh", x: `${20 + i * 20}vw` }}
                            animate={{ y: "-10vh", rotate: 360 }}
                            transition={{
                                duration: 20 + i * 3,
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * 2,
                            }}
                        >
                            <ShieldCheck size={40 + i * 15} />
                            <User size={40 + i * 15} />
                        </motion.div>
                    ))}
                </div>

                <div className="container mx-auto max-w-md relative z-10">

                    {/* Título animado */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6 sm:mb-8 text-center"
                    >
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-green-500/10 text-green-600 mb-3 sm:mb-4 text-sm"
                        >
                            <Sparkles className="w-4 h-4" />
                            Recuperación de Cuenta
                        </motion.span>

                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                            Verificar <span className="text-green-600">Código</span>
                        </h2>
                        <p className="text-gray-600 text-base sm:text-lg px-4">
                            Ingresa el código enviado a tu correo
                        </p>
                    </motion.div>

                    {/* Tarjeta principal */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-green-100"
                    >

                        {/* Header con gradiente */}
                        <div className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 h-20 sm:h-24 relative">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.5, stiffness: 200 }}
                                className="absolute inset-x-0 -bottom-10 sm:-bottom-12 flex justify-center"
                            >
                                <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-2xl mx-auto border-4 border-white">
                                    <CheckCircle className="w-11 sm:w-14 h-11 sm:h-14" strokeWidth={2.5} />
                                </div>
                            </motion.div>
                        </div>

                        {/* Formulario */}
                        <div className="pt-16 sm:pt-20 pb-6 sm:pb-8 px-4 sm:px-8">

                            {/* Campo de código */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="mb-5 sm:mb-6"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Mail className="w-4 h-4 text-green-600" />
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Código de Verificación
                                    </label>
                                </div>

                                <input
                                    type="text"
                                    value={code}
                                    onChange={handleCodeChange}
                                    maxLength={6}
                                    inputMode="numeric"
                                    placeholder="000000"
                                    className="w-full h-14 sm:h-16 text-center text-2xl sm:text-4xl tracking-[0.3rem] sm:tracking-[0.5rem] font-bold 
                          border-2 border-green-200 rounded-xl bg-gradient-to-r from-white to-green-50
                          text-gray-900 placeholder-gray-300
                          focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500
                          transition-all duration-300"
                                    required
                                />
                            </motion.div>

                            {/* Campo de nueva contraseña */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                                className="mb-5 sm:mb-6"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Lock className="w-4 h-4 text-green-600" />
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Nueva contraseña
                                    </label>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 border-2 border-green-200 rounded-xl 
                            focus:ring-4 focus:ring-green-500/30 focus:border-green-500 
                            transition-all duration-300 pr-12 text-gray-900 bg-white"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </motion.div>

                            {/* Campo de confirmar contraseña */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="mb-5 sm:mb-6"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Lock className="w-4 h-4 text-green-600" />
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Confirmar contraseña
                                    </label>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 border-2 border-green-200 rounded-xl 
                            focus:ring-4 focus:ring-green-500/30 focus:border-green-500 
                            transition-all duration-300 pr-12 text-gray-900 bg-white"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </motion.div>

                            {/* Error message */}
                            {passwordError && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3"
                                >
                                    {passwordError}
                                </motion.p>
                            )}

                            {/* Botón de submit */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 
                        hover:from-green-600 hover:to-emerald-700
                        disabled:from-gray-400 disabled:to-gray-500
                        text-white font-semibold py-3 sm:py-4 rounded-xl 
                        transition-all duration-300 shadow-lg hover:shadow-xl 
                        flex items-center justify-center gap-2 text-base sm:text-lg"
                            >
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5" />
                                        Cambiar contraseña
                                    </>
                                )}
                            </motion.button>

                            {/* Link para reenviar código */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="mt-5 sm:mt-6 text-center"
                            >
                                <button
                                    type="button"
                                    className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium hover:underline transition-colors"
                                >
                                    ¿No recibiste el código? Reenviar
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                        className="text-center mt-4 sm:mt-6 text-gray-600 text-xs sm:text-sm px-4"
                    >
                        ¿Recordaste tu contraseña?{" "}
                        <a href="/login" className="text-green-600 font-semibold hover:text-green-700 hover:underline transition-colors">
                            Iniciar sesión
                        </a>
                    </motion.p>
                </div>
            </main>
            {/* Footer */}
            <Footer />
        </div>

    );
}
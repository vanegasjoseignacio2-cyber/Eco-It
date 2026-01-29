import { useState } from "react";
import Footer from "../Layout/Footer";
import { FadeInUp, FadeInLeft, ScaleIn } from "../animations/Animatedlogin"; // ButtonMotion removed
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Eye, EyeOff, Lock } from "lucide-react"; // Added Eye, EyeOff, Lock
import { recuperarPassword, verificarCodigo, restablecerPassword } from "../../services/api"; // Added restablecerPassword

export default function RecuperarPassword() {
    const navigate = useNavigate();

    // Estado del paso: 'email', 'code', 'password'
    const [step, setStep] = useState('email');

    // Estados del formulario
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Estados de UI/Validación
    const [touched, setTouched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Validaciones
    const isValidEmail = /^\S+@\S+\.\S+$/.test(email);
    const emailEmpty = email.trim() === "";

    const isValidCode = /^\d{6}$/.test(code);
    const codeEmpty = code.trim() === "";

    const passwordMatch = password === confirmPassword && password.length >= 6;
    const passwordEmpty = password === "";

    // Paso 1: Enviar Email
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setTouched(true);
        if (emailEmpty || !isValidEmail) return;

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const data = await recuperarPassword(email);

            if (data.success) {
                if (data.debugCodigo) alert(`TU CÓDIGO (DEBUG): ${data.debugCodigo}`);
                setMessage(data.mensaje);
                setStep('code');
            } else {
                setError(data.mensaje || "Error al enviar código");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    // Paso 2: Verificar Código
    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        if (codeEmpty || !isValidCode) {
            setError("Código inválido (debe tener 6 dígitos)");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const data = await verificarCodigo(email, code);

            if (data.success) {
                setStep('password'); // Avanzar al paso de cambio de contraseña
                setMessage(""); // Limpiar mensaje de "código enviado"
            } else {
                setError(data.mensaje || "Código inválido o expirado");
            }
        } catch (err) {
            setError("Error al verificar el código");
        } finally {
            setLoading(false);
        }
    };

    // Paso 3: Nueva Contraseña
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!passwordMatch) {
            setError("Las contraseñas no coinciden o son muy cortas (min 6 caracteres)");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await restablecerPassword(email, code, password);

            if (data.success) {
                setShowSuccessModal(true); // Mostrar modal en lugar de alert
            } else {
                setError(data.mensaje || "Error al actualizar la contraseña");
            }
        } catch (err) {
            setError("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    }

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col nature-bg relative">
            <header className="fixed top-0 inset-x-0 z-20 bg-white/70 backdrop-blur-sm border-b border-green-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <Link to="/" className="flex items-center gap-2 group">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg"
                            >
                                <Leaf className="w-6 h-6 text-white" />
                            </motion.div>
                            <span className="text-2xl font-bold text-black tracking-wide">ECO-IT</span>
                        </Link>
                        <Link to="/login" className="text-green-700 hover:text-green-900 font-medium">Volver al login</Link>
                    </div>
                </div>
            </header>

            <main className="relative flex-1 flex items-center justify-center px-4 pt-24 pb-20 bg-gradient-to-br from-emerald-100 to-green-100">
                <div className="w-full max-w-xl">
                    <div className="mb-8 text-center">
                        <ScaleIn>
                            <div className="inline-flex w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 items-center justify-center text-white shadow-md shadow-gray-400 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3M6.75 10.5h10.5a1.5 1.5 0 011.5 1.5v6.75a1.5 1.5 0 01-1.5 1.5H6.75a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5z" />
                                </svg>
                            </div>
                        </ScaleIn>
                        <FadeInUp>
                            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-2">
                                {step === 'email' ? 'Recuperar contraseña' : step === 'code' ? 'Verificar código' : 'Nueva contraseña'}
                            </h2>
                        </FadeInUp>
                        <FadeInUp delay={0.05}>
                            <p className="text-green-700 font-medium max-w-md mx-auto">
                                {step === 'email' && 'Ingresa tu correo para recibir un código de verificación.'}
                                {step === 'code' && `Hemos enviado un código a ${email}. Introdúcelo abajo.`}
                                {step === 'password' && 'Crea una contraseña segura.'}
                            </p>
                        </FadeInUp>
                    </div>

                    <FadeInLeft delay={0.1}>
                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border-2 border-green-100">
                            <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-28" />
                            <div className="px-8 pb-8 -mt-10">
                                <div className="flex items-center justify-center -mt-10 mb-6">
                                    <ScaleIn delay={0.2}>
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-2xl border-4 border-white">
                                            {/* Step Icon Changes */}
                                            {step === 'password' ? <Lock className="w-10 h-10" /> : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </div>
                                    </ScaleIn>
                                </div>

                                <form className="space-y-6" onSubmit={step === 'email' ? handleEmailSubmit : step === 'code' ? handleCodeSubmit : handlePasswordSubmit} noValidate>

                                    {/* PASO 1: EMAIL */}
                                    {step === 'email' && (
                                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                            <label className="block text-sm font-semibold text-green-800 mb-2">Correo electrónico</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-green-600">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15A2.25 2.25 0 012.25 17.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91A2.25 2.25 0 012.25 6.993V6.75" />
                                                    </svg>
                                                </div>
                                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched(true)} required disabled={loading} placeholder="correo@ejemplo.com"
                                                    className={`w-full pl-10 pr-4 py-3.5 rounded-xl bg-white border-2 ${(touched && !isValidEmail) ? 'border-red-300 focus:border-red-500' : 'border-green-200 focus:border-green-500'} outline-none transition-all text-green-900 placeholder-green-400`}
                                                />
                                            </div>
                                            {(touched && !isValidEmail) && <p className="mt-2 text-sm text-red-600">Ingresa un correo válido.</p>}
                                        </motion.div>
                                    )}

                                    {/* PASO 2: CÓDIGO */}
                                    {step === 'code' && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                            <label className="block text-sm font-semibold text-green-800 mb-2">Código de verificación</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-green-600">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                                    </svg>
                                                </div>
                                                <input type="text" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} required autoFocus disabled={loading} placeholder="123456"
                                                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white border-2 border-green-200 focus:border-green-500 outline-none transition-all text-green-900 placeholder-green-400 tracking-[0.5em] text-center font-bold text-lg"
                                                />
                                            </div>
                                            <p className="mt-2 text-xs text-green-600 text-center">Revisa tu bandeja de entrada o spam.</p>
                                        </motion.div>
                                    )}

                                    {/* PASO 3: NUEVA CONTRASEÑA */}
                                    {step === 'password' && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">

                                            {/* Nueva Contraseña */}
                                            <div>
                                                <label className="block text-sm font-semibold text-green-800 mb-2">Nueva Contraseña</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-white border-2 border-green-200 focus:border-green-500 outline-none transition-all text-green-900 placeholder-green-400"
                                                        placeholder="Mínimo 6 caracteres"
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-800">
                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Confirmar Contraseña */}
                                            <div>
                                                <label className="block text-sm font-semibold text-green-800 mb-2">Confirmar Contraseña</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className={`w-full pl-10 pr-10 py-3.5 rounded-xl bg-white border-2 ${!passwordMatch && confirmPassword ? "border-red-300 focus:border-red-500" : "border-green-200 focus:border-green-500"} outline-none transition-all text-green-900 placeholder-green-400`}
                                                        placeholder="Repite la contraseña"
                                                    />
                                                </div>
                                                {!passwordMatch && confirmPassword && (
                                                    <p className="mt-1 text-xs text-red-600">Las contraseñas no coinciden.</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Botón de Acción Principal CORRECTAMENTE INTEGRADO */}
                                    <motion.button
                                        type="submit"
                                        disabled={loading || (step === 'email' && (!isValidEmail || emailEmpty)) || (step === 'code' && (!isValidCode || codeEmpty)) || (step === 'password' && !passwordMatch)}
                                        whileHover={!loading ? { scale: 1.02, boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)" } : {}}
                                        whileTap={!loading ? { scale: 0.98 } : {}}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-95 text-white font-semibold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-lg tracking-wide"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                {step === 'email' && (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.3} stroke="currentColor" className="w-6 h-6 mr-2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12Zm0 0h7.5" />
                                                        </svg>
                                                        Enviar código
                                                    </>
                                                )}
                                                {step === 'code' && "Verificar código"}
                                                {step === 'password' && "Actualizar contraseña"}
                                            </>
                                        )}
                                    </motion.button>


                                    {/* Mensajes de Estado */}
                                    {error && (
                                        <div className="text-red-700 text-sm font-medium bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4 text-center animate-pulse">
                                            {error}
                                        </div>
                                    )}

                                    {/* Botón atrás en pasos avanzados */}
                                    {step !== 'email' && (
                                        <div className="text-center pt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setStep(step === 'password' ? 'code' : 'email');
                                                    setError("");
                                                }}
                                                className="text-sm text-green-600 hover:underline"
                                            >
                                                {step === 'password' ? '¿Volver a verificar código?' : '¿Correo equivocado? Volver'}
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </FadeInLeft>

                    {/* SUCCESS MODAL IMPLEMENTATION */}
                    {showSuccessModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                                onClick={handleSuccessClose}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                            >
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Contraseña Actualizada!</h3>
                                    <p className="text-gray-600 mb-6">Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión con tu nueva clave.</p>

                                    <button
                                        onClick={handleSuccessClose}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:opacity-95 transition-all transform hover:scale-[1.02]"
                                    >
                                        Iniciar Sesión
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
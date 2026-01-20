import { useState } from "react";
import Footer from "../Layout/Footer";
import { FadeInUp, FadeInLeft, ScaleIn, ButtonMotion } from "../animations/Animatedlogin";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function RecuperarPassword() {
    const [email, setEmail] = useState("");
    const [touched, setTouched] = useState(false);
    const [sent, setSent] = useState(false);

    const isValidEmail = /^\S+@\S+\.\S+$/.test(email);
    const emailEmpty = email.trim() === "";
    const showError = (emailEmpty || !isValidEmail) && touched;

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched(true);
        if (emailEmpty || !isValidEmail) return;
        // Aquí iría la lógica para enviar el correo de verificación
        setSent(true);
    };

    return (
        <div className="min-h-screen flex flex-col nature-bg relative">
            {/* Navbar mínimo: logo + volver al login */}
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
                            <span className="text-2xl font-bold text-black tracking-wide">
                                ECO-IT
                            </span>
                        </Link>
                        <Link to="/login" className="text-green-700 hover:text-green-900 font-medium">
                            Volver al login
                        </Link>
                    </div>
                </div>
            </header>

            <main className="relative flex-1 flex items-center justify-center px-4 pt-24 pb-20 bg-gradient-to-br from-emerald-100 to-green-100">
                <div className="w-full max-w-xl">
                    {/* Título */}
                    <div className="mb-8 text-center">
                        <ScaleIn>
                            <div className="inline-flex w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 items-center justify-center text-white shadow-md shadow-gray-400 mb-3">
                                {/* Icono de candado */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3M6.75 10.5h10.5a1.5 1.5 0 011.5 1.5v6.75a1.5 1.5 0 01-1.5 1.5H6.75a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5z" />
                                </svg>
                            </div>
                        </ScaleIn>
                        <FadeInUp>
                            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-2">Recuperar contraseña</h2>
                        </FadeInUp>
                        <FadeInUp delay={0.05}>
                            <p className="text-green-700 font-medium max-w-md mx-auto">
                                Ingresa tu correo para recibir un código de verificación.
                            </p>
                        </FadeInUp>
                    </div>

                    {/* Tarjeta */}
                    <FadeInLeft delay={0.1}>
                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border-2 border-green-100">
                            <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-28" />

                            <div className="px-8 pb-8 -mt-10">
                                <div className="flex items-center justify-center -mt-10 mb-6">
                                    <ScaleIn delay={0.2}>
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-2xl border-4 border-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </ScaleIn>
                                </div>

                                {/* Formulario */}
                                <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                                    <div>
                                        <label className="block text-sm font-semibold text-green-800 mb-2">Correo electrónico</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-green-600">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15A2.25 2.25 0 012.25 17.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91A2.25 2.25 0 012.25 6.993V6.75" />
                                                </svg>
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onBlur={() => setTouched(true)}
                                                required
                                                placeholder="correo@ejemplo.com"
                                                className={`w-full pl-10 pr-4 py-3.5 rounded-xl bg-white border-2 ${showError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-green-200 focus:border-green-500 focus:ring-green-500/20'} outline-none transition-all text-green-900 placeholder-green-400`}
                                                aria-invalid={showError}
                                            />
                                        </div>
                                        {showError && (
                                            <p className="mt-2 text-sm text-red-600">Ingresa un correo válido.</p>
                                        )}
                                    </div>

                                    <ButtonMotion disabled={emailEmpty || !isValidEmail}>
                                        <button
                                            type="submit"
                                            className="w-[70vh] bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-95 text-white font-semibold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.3} stroke="currentColor" className="w-6 h-6 mr-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12Zm0 0h7.5" />
                                            </svg>
                                            Enviar código
                                        </button>
                                    </ButtonMotion>

                                    {sent && (
                                        <FadeInUp>
                                            <div className="text-green-700 text-sm font-medium bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                                Si el correo está registrado, te enviaremos un código de verificación.
                                            </div>
                                        </FadeInUp>
                                    )}
                                </form>
                            </div>
                        </div>
                    </FadeInLeft>
                </div>
            </main>

            <Footer />
        </div>
    );
}
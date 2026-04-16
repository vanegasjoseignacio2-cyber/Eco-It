import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Leaf, Recycle } from "lucide-react";

export default function RutasEco() {
    return (
        <motion.section
            className="w-full max-w-5xl mx-auto mb-8 sm:mb-12 mt-6 sm:mt-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Card */}
            <div className="relative rounded-3xl overflow-hidden
                bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600
                shadow-[0_20px_60px_rgba(34,197,94,0.35)] p-px">
                
                {/* Inner */}
                <div className="relative rounded-3xl bg-gradient-to-br from-green-900/95 to-emerald-900/95 p-8 sm:p-10 md:p-12 overflow-hidden">
                    
                    {/* BG decoration */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-green-400/10 blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl" />
                        {/* Subtle grid */}
                        <div className="absolute inset-0 opacity-5"
                            style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8 sm:gap-10">
                        
                        {/* Left */}
                        <div className="flex-1 text-center sm:text-left">
                            {/* Badge */}
                            <motion.div
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                                    bg-green-400/20 border border-green-400/30 text-green-300 text-xs font-semibold mb-4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.15 }}
                            >
                                <Sparkles className="w-3 h-3" />
                                Asistente inteligente
                            </motion.div>

                            <motion.h2
                                className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-3"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                Maximiza el potencial<br />
                                <span className="text-green-300">de tus residuos</span>
                            </motion.h2>

                            <motion.p
                                className="text-sm sm:text-base text-green-200/70 leading-relaxed max-w-md mx-auto sm:mx-0"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.25 }}
                            >
                                Clasificación inteligente de residuos y estrategias de reutilización sostenible antes de la recolección municipal.
                            </motion.p>
                        </div>

                        {/* Right — icons + CTA */}
                        <div className="flex flex-col items-center gap-5 flex-shrink-0">
                            {/* Icon cluster */}
                            <div className="flex items-center gap-3">
                                {[Recycle, Leaf, Sparkles].map((Icon, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center"
                                        animate={{ y: [0, -5, 0], rotate: [0, i % 2 === 0 ? 8 : -8, 0] }}
                                        transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                                    >
                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" />
                                    </motion.div>
                                ))}
                            </div>

                            {/* CTA */}
                            <Link to="/ai" className="w-full">
                                <motion.button
                                    className="group relative w-full sm:w-auto px-8 py-3.5 rounded-2xl
                                        bg-gradient-to-r from-green-400 to-emerald-400
                                        text-green-950 font-bold text-sm sm:text-base
                                        shadow-[0_8px_30px_rgba(74,222,128,0.4)]
                                        overflow-hidden"
                                    whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(74,222,128,0.55)" }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {/* Shine */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
                                        whileHover={{ translateX: "100%" }}
                                        transition={{ duration: 0.5 }}
                                    />
                                    <span className="relative flex items-center gap-2 justify-center">
                                        Explorar ahora
                                        <motion.div
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </motion.div>
                                    </span>
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
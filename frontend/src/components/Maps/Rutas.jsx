// Rutas.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Recycle, Sparkles, ArrowRight, Leaf, Trash2, Truck, List, ListCheck, ClipboardList, LibraryBig } from "lucide-react";

export default function RutasEco() {
    return (
        <motion.section
            className="w-full border-2 border-green-400 max-w-6xl mx-auto mb-6 sm:mb-8 md:mb-10 mt-10 sm:mt-10 md:mt-10 rounded-2xl sm:rounded-3xl shadow-xl shadow-green-700/40 bg-gradient-to-br from-white/70 to-green-50  p-8 sm:p-10 md:p-14 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >

            {/* Título con animación */}
            <motion.div
                className="flex items-center justify-center gap-2 mb-3 sm:mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <motion.div
                    animate={{
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Trash2 className="text-green-600 w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-green-900 text-center font-bold px-2">
                    Maximiza el potencial de tus residuos antes de su disposición final
                </h2>
                <motion.div
                    animate={{
                        rotate: [0, -15, 15, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                >
                    <Truck className="text-lime-600 w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
            </motion.div>

            <motion.span
                className="block w-full rounded-full bg-gradient-to-r from-green-700 via-emerald-500 to-lime-500  h-0.5 mb-4 sm:mb-5 md:mb-6"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5 md:gap-6 lg:gap-8 relative z-10">
                <motion.p
                    className="font-medium sm:font-semibold text-green-700 flex-1 text-sm sm:text-base md:text-lg text-center leading-relaxed"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    Accede a información especializada sobre clasificación de residuos y descubre
                    estrategias de reutilización sostenible antes de la recolección municipal
                </motion.p>

                <Link to="/ai" className="flex-shrink-0 w-full sm:w-auto">
                    <motion.button
                        className="group w-full sm:w-auto py-3 sm:py-3.5 md:py-4 px-6 sm:px-7 md:px-8 lg:px-10 rounded-lg sm:rounded-xl shadow-lg shadow-lime-200 bg-gradient-to-tr from-green-500 via-emerald-500 to-lime-500 text-white font-semibold text-sm sm:text-base whitespace-nowrap relative overflow-hidden"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)"
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* Efecto de brillo en hover */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.6 }}
                        />

                        <span className="relative flex items-center gap-2 justify-center">
                            Explorar ahora
                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </motion.div>
                        </span>
                    </motion.button>
                </Link>
            </div>
        </motion.section>
    );
}
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Gamepad2,
    ArrowRight,
    Leaf,
    Recycle,
    TreeDeciduous,
    Droplets,
} from "lucide-react";

export default function Ecogame() {
    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50">

            {/* animación de fondo */}
            <motion.div
                className="absolute top-10 left-10 w-96 h-96 bg-green-300/20 rounded-full blur-3xl"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute bottom-10 right-10 w-[28rem] h-[28rem] bg-lime-300/20 rounded-full blur-3xl"
                animate={{ opacity: [0.2, 0.45, 0.2] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

                    {/* TEXTO */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-100 text-lime-700 text-sm font-medium mb-5">
                            <Gamepad2 className="w-4 h-4" />
                            Próximamente
                        </span>

                        <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
                            Aprende Jugando con{" "}
                            <span className="bg-gradient-to-r from-lime-500 to-emerald-600 bg-clip-text text-transparent">
                                Eco-Juego
                            </span>
                        </h2>

                        <p className="text-xl text-green-700 mb-8 leading-relaxed">
                            Aprende sobre reciclaje, conservación y sostenibilidad con
                            desafíos interactivos, misiones ecológicas y recompensas.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {[
                                "Desafíos de reciclaje interactivos",
                                "Puntos y recompensas ecológicas",
                                "Competencias con amigos",
                                "Misiones para salvar el planeta",
                            ].map((item, index) => (
                                <motion.li
                                    key={item}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ amount: 0.3 }}
                                    transition={{ delay: index * 0.15 }}
                                    className="flex items-center gap-3 text-green-700"
                                >
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center">
                                        <span className="w-2.5 h-2.5 bg-white rounded-full" />
                                    </div>
                                    {item}
                                </motion.li>
                            ))}
                        </ul>

                        <Link
                            to="/game"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-lime-500 to-green-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                        >
                            <Gamepad2 className="w-5 h-5" />
                            Ver Adelanto
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>

                    {/* ilustracion */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative aspect-square max-w-md mx-auto">

                            <motion.div
                                className="absolute inset-0 rounded-full bg-gradient-to-br from-lime-200 via-green-200 to-emerald-200 opacity-50"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            />

                            <motion.div
                                className="absolute inset-10 rounded-full bg-gradient-to-br from-lime-300 via-green-300 to-emerald-300 opacity-60"
                                animate={{ scale: [1, 1.08, 1] }}
                                transition={{ duration: 5, repeat: Infinity }}
                            />

                            <div className="absolute inset-20 rounded-full bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500 flex items-center justify-center shadow-2xl">
                                <Gamepad2 className="w-24 h-24 text-white" />
                            </div>

                            {[Leaf, Recycle, TreeDeciduous, Droplets].map((Icon, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute"
                                    style={{
                                        top: `${50 + 45 * Math.sin((i * Math.PI) / 2)}%`,
                                        left: `${50 + 45 * Math.cos((i * Math.PI) / 2)}%`,
                                        transform: "translate(-50%, -50%)",
                                    }}
                                    animate={{ y: [0, -12, 0], scale: [1, 1.15, 1] }}
                                    transition={{
                                        duration: 2.5,
                                        delay: i * 0.4,
                                        repeat: Infinity,
                                    }}
                                >
                                    <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-green-500" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

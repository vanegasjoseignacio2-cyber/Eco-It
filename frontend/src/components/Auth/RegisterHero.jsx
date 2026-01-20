import { motion } from "framer-motion";
import { Leaf, Check } from "lucide-react";

export default function RegisterHero() {
    return (
        <div className="w-full lg: px-4 lg:px-0">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
            >
                {/* Decorative blurs */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-lime-200 rounded-full blur-3xl opacity-50 pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-200 rounded-full blur-3xl opacity-50 pointer-events-none" />

                <div className="relative z-10 text-center lg:text-left">
                    {/* Logo Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.2 }}
                        className="w-24 h-24 mx-auto lg:mx-0 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center shadow-xl mb-8"
                    >
                        <Leaf className="w-12 h-12 text-white" />
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-900 mb-4"
                    >
                        Únete a la revolución{" "}
                        <span className="bg-gradient-to-r from-lime-500 via-green-500 to-emerald-600 bg-clip-text text-transparent">
                            Verde
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                        className="text-lg sm:text-xl text-green-700 mb-8"
                    >
                        Crea tu cuenta y comienza a hacer la diferencia por nuestro planeta
                    </motion.p>

                    {/* Features List */}
                    <div className="space-y-4 mb-10">
                        {[
                            "100% gratuito para siempre",
                            "Encuentra puntos de reciclaje cercanos",
                            "Asistente IA para tus dudas",
                            "Comunidad de eco-héroes",
                            "Juegos y recompensas ecológicas",
                        ].map((item, index) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                                className="flex items-center gap-3 text-green-700"
                            >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center flex-shrink-0 shadow-md">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm sm:text-base">{item}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Social Proof Card */}
                    {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
                        className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-green-100/50 shadow-lg"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md"
                                    >
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-green-900 text-sm sm:text-base">
                                    +10,000 usuarios
                                </p>
                                <p className="text-xs sm:text-sm text-green-600">
                                    ya forman parte de Eco-It
                                </p>
                            </div>
                        </div>
                    </motion.div> */}
                </div>
            </motion.div>
        </div>
    );
}
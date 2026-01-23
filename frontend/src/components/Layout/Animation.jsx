//animación de carga de inicio

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Recycle } from "lucide-react";

export default function LoadingScreen({ onComplete }) {
    const [stage, setStage] = useState("loading"); // loading | text | done

    useEffect(() => {
        const timer1 = setTimeout(() => setStage("text"), 2000);
        const timer2 = setTimeout(() => setStage("done"), 4000);
        const timer3 = setTimeout(() => onComplete(), 4500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {stage !== "done" && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-100 to-green-200"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >

                    {/*HOJAS FLOTANDO*/}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(15)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute text-green-500/20"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: "-50px",
                                }}
                                animate={{
                                    y: ["0vh", "110vh"],
                                    rotate: [0, 360],
                                    opacity: [0, 1, 1, 0],
                                }}
                                transition={{
                                    duration: 8 + Math.random() * 4,
                                    repeat: Infinity,
                                    delay: Math.random() * 5,
                                    ease: "linear",
                                }}
                            >
                                <Leaf size={20 + Math.random() * 30} />
                            </motion.div>
                        ))}
                    </div>

                    {/* ===== CONTENIDO CENTRAL ===== */}
                    <div className="relative flex flex-col items-center gap-8">
                        <AnimatePresence mode="wait">

                            {/* ===== STAGE: LOADING ===== */}
                            {stage === "loading" && (
                                <motion.div
                                    key="loading"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className="relative"
                                >
                                    {/* CÍRCULO PRINCIPAL */}
                                    <motion.div
                                        className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 flex items-center justify-center shadow-2xl"
                                        animate={{
                                            boxShadow: [
                                                "0 0 30px rgba(34,197,94,0.4)",
                                                "0 0 60px rgba(34,197,94,0.6)",
                                                "0 0 30px rgba(34,197,94,0.4)",
                                            ],
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Recycle className="w-16 h-16 text-white" />
                                        </motion.div>
                                    </motion.div>

                                    {/* anilloos */}
                                    <motion.div
                                        className="absolute -inset-4 rounded-full border-4 border-green-400/30"
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    <motion.div
                                        className="absolute -inset-8 rounded-full border-2 border-green-300/20"
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                                    />

                                    {/* SPINNER */}
                                    <motion.div
                                        className="absolute inset-0 flex items-center justify-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <div className="w-32 h-32 rounded-full border-t-4 border-green-300 animate-spin" />
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* TEXTO  */}
                            {stage === "text" && (
                                <motion.div
                                    key="text"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.5 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center"
                                >
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <motion.div
                                            initial={{ x: -50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <Leaf className="w-12 h-12 text-green-500" />
                                        </motion.div>

                                        <motion.h1
                                            className="text-7xl md:text-8xl font-bold"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                                        >
                                            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                                                Eco
                                            </span>
                                            <span className="text-green-800">-</span>
                                            <span className="text-emerald-600">It</span>
                                        </motion.h1>

                                        <motion.div
                                            initial={{ x: 50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <Recycle className="w-12 h-12 text-emerald-500" />
                                        </motion.div>
                                    </div>

                                    <motion.p
                                        className="text-xl text-green-700 font-medium"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Reduce-Reutiliza-Recicla
                                    </motion.p>

                                    {/* DOTS */}
                                    <motion.div
                                        className="mt-8 flex gap-2 justify-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                    >
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                className="w-3 h-3 rounded-full bg-green-500"
                                                animate={{ y: [0, -10, 0], scale: [1, 1.2, 1] }}
                                                transition={{
                                                    duration: 0.6,
                                                    repeat: Infinity,
                                                    delay: i * 0.2,
                                                }}
                                            />
                                        ))}
                                    </motion.div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Clock, Bell } from 'lucide-react';
import animations from '../animations/Animationgame';

const GameHero = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 md:mb-16"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-100 text-lime-700 text-sm font-medium mb-4"
            >
                <Clock className="w-4 h-4" />
                Próximamente
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-4 px-4">
                <span className="eco-gradient-text">Eco</span>-Juego
            </h1>

            <p className="text-lg md:text-xl text-green-700 max-w-2xl mx-auto mb-8 px-4">
                Aprende sobre reciclaje y medio ambiente de forma divertida mientras compites con amigos
            </p>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="relative inline-block w-full px-4"
            >
                <div className="glass-card rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden max-w-2xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-lime-400/20 to-green-500/20" />

                    <div className="relative z-10">
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center shadow-xl mb-6"
                        >
                            <Gamepad2 className="w-12 h-12 md:w-16 md:h-16 text-white" />
                        </motion.div>

                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-green-900 mb-4">
                            ¡Estamos construyendo algo insano!
                        </h2>

                        <p className="text-sm md:text-base text-green-700 mb-6">
                            Aquí va el juego de Miguelito
                        </p>

                        <motion.button
                            {...animations.buttonHover}
                            className="btn-eco px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-lime-500 to-green-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto w-full sm:w-auto"
                        >
                            <Bell className="w-5 h-5" />
                            Para algo ha de servir más adelante
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default GameHero;
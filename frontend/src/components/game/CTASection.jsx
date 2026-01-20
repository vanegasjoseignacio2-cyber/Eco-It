import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 md:mt-16 text-center px-4"
        >
            <div className="bg-white/70 rounded-2xl md:rounded-3xl p-6 md:p-12 inline-block max-w-3xl mx-auto w-full">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-green-900 mb-4">
                    ¿Quieres ser de los primeros en jugar?
                </h3>

                <p className="text-sm md:text-base text-green-700 mb-6 max-w-md mx-auto">
                    Regístrate ahora y disfruta de las increíbles recompensas que tenemos para ti.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/register"
                        className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                        Registrarme Ahora
                        <ArrowRight className="w-5 h-5" />
                    </Link>

                    <Link
                        to="/"
                        className="px-6 md:px-8 py-3 md:py-4 bg-white text-green-700 rounded-full font-semibold border-2 border-green-200 hover:border-green-400 hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default CTASection;
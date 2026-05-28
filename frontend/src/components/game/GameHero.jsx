import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Play, Maximize2, RotateCcw, ArrowLeft, Info, ShieldAlert } from 'lucide-react';
import animations from '../animations/Animationgame';

const GameHero = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const iframeContainerRef = useRef(null);
    const iframeRef = useRef(null);

    const handleFullscreen = () => {
        if (iframeContainerRef.current) {
            if (iframeContainerRef.current.requestFullscreen) {
                iframeContainerRef.current.requestFullscreen();
            } else if (iframeContainerRef.current.mozRequestFullScreen) {
                iframeContainerRef.current.mozRequestFullScreen();
            } else if (iframeContainerRef.current.webkitRequestFullscreen) {
                iframeContainerRef.current.webkitRequestFullscreen();
            } else if (iframeContainerRef.current.msRequestFullscreen) {
                iframeContainerRef.current.msRequestFullscreen();
            }
        }
    };

    const handleReload = () => {
        if (iframeRef.current) {
            iframeRef.current.src = iframeRef.current.src;
        }
    };

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
                <Gamepad2 className="w-4 h-4 text-lime-600" />
                ¡Juego Disponible!
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-4 px-4">
                <span className="eco-gradient-text">Eco</span>-Juego
            </h1>

            <p className="text-lg md:text-xl text-green-700 max-w-2xl mx-auto mb-8 px-4">
                Aprende sobre reciclaje y medio ambiente de forma divertida mientras compites con amigos
            </p>

            <div className="max-w-4xl mx-auto px-4">
                <AnimatePresence mode="wait">
                    {!isPlaying ? (
                        <motion.div
                            key="lobby"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="glass-card rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden max-w-3xl mx-auto border border-green-200/50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-lime-400/20 via-emerald-400/10 to-green-500/20 pointer-events-none" />

                            <div className="relative z-10">
                                <motion.div
                                    animate={{
                                        rotate: [0, 8, -8, 0],
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center shadow-xl mb-6"
                                >
                                    <Gamepad2 className="w-12 h-12 md:w-16 md:h-16 text-white" />
                                </motion.div>

                                <h2 className="text-2xl md:text-3xl font-extrabold text-green-900 mb-4">
                                    Eco-Reciclador de Residuos
                                </h2>

                                <p className="text-sm md:text-base text-green-700 mb-8 max-w-lg mx-auto">
                                    ¡Únete a la aventura! Aprende a clasificar los residuos correctamente y ayuda a salvar nuestro planeta en este juego interactivo en 3D.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-md mx-auto mb-8 bg-green-50/55 p-5 rounded-2xl border border-green-100">
                                    <div className="flex items-start gap-2">
                                        <Info className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
                                        <p className="text-xs text-green-800">
                                            <strong>Instrucciones:</strong> Arrastra o selecciona el contenedor adecuado para cada tipo de residuo.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <ShieldAlert className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
                                        <p className="text-xs text-green-800">
                                            <strong>Consejo:</strong> Consigue rachas consecutivas para desbloquear multiplicadores de puntos.
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    {...animations.buttonHover}
                                    onClick={() => setIsPlaying(true)}
                                    className="px-8 py-4 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white rounded-full font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 mx-auto text-lg cursor-pointer"
                                >
                                    <Play className="w-6 h-6 fill-white" />
                                    ¡JUGAR AHORA!
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="gameplay"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="w-full flex flex-col bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-500/30"
                        >
                            {/* Toolbar superior */}
                            <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                                <button
                                    onClick={() => setIsPlaying(false)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-semibold cursor-pointer"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Salir del juego
                                </button>
                                <div className="text-emerald-400 font-bold text-sm hidden sm:block">
                                    Eco-Juego Interactiva
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleReload}
                                        title="Reiniciar Juego"
                                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleFullscreen}
                                        title="Pantalla Completa"
                                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Iframe del juego */}
                            <div ref={iframeContainerRef} className="relative w-full aspect-video bg-black flex items-center justify-center">
                                <iframe
                                    ref={iframeRef}
                                    src="/eco-juego/index.html"
                                    title="Eco Juego WebGL"
                                    className="w-full h-full border-0"
                                    allowFullScreen
                                    allow="autoplay; fullscreen; xr-spatial-tracking"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default GameHero;
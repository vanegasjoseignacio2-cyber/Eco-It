import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gamepad2, Play, Maximize2, RotateCcw, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Info, ShieldAlert,
    CheckCircle2, Trophy, Star
} from 'lucide-react';
import animations from '../animations/Animationgame';
import { guardarPuntajeJuego } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const GameHero = ({ onPuntajeGuardado }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [resultadoPartida, setResultadoPartida] = useState(null); // { puntos, nuevosLogros }
    const iframeContainerRef = useRef(null);
    const iframeRef = useRef(null);
    const gameWrapperRef = useRef(null);
    const { estaAutenticado } = useAuth();

    const handleFullscreen = () => {
        if (gameWrapperRef.current) {
            try {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    gameWrapperRef.current.requestFullscreen();
                }
            } catch (err) {
                console.error('Failed to request fullscreen:', err);
            }
        }
    };

    const simulateKeyEvent = (key, keyCode, isKeyDown) => {
        if (!iframeRef.current) return;
        try {
            const doc = iframeRef.current.contentDocument;
            if (!doc) return;
            const canvas = doc.getElementById('unity-canvas');
            const target = canvas || doc;
            const eventType = isKeyDown ? 'keydown' : 'keyup';
            const event = new KeyboardEvent(eventType, {
                bubbles: true,
                cancelable: true,
                key: key,
                code: key,
                keyCode: keyCode,
                which: keyCode
            });
            target.dispatchEvent(event);
        } catch (e) {
            console.error('Error simulating key event', e);
        }
    };

    const MobileControlButton = ({ icon: Icon, label, keyName, keyCode }) => (
        <button
            onPointerDown={(e) => { e.preventDefault(); simulateKeyEvent(keyName, keyCode, true); }}
            onPointerUp={(e) => { e.preventDefault(); simulateKeyEvent(keyName, keyCode, false); }}
            onPointerLeave={(e) => { e.preventDefault(); simulateKeyEvent(keyName, keyCode, false); }}
            className="w-12 h-12 bg-black/40 active:bg-emerald-600/80 rounded-full flex items-center justify-center border border-white/20 select-none touch-none transition-all backdrop-blur-md shadow-xl"
        >
            {Icon ? <Icon className="w-6 h-6 text-white" /> : <span className="text-white font-extrabold text-sm">{label}</span>}
        </button>
    );

    const handleReload = () => {
        if (iframeRef.current) {
            iframeRef.current.src = iframeRef.current.src;
        }
    };

    // ── Escuchar mensajes del juego WebGL ──────────────────────────────────────
    const handleGameMessage = useCallback(async (event) => {
        // Log temporal para ver TODOS los mensajes que llegan (incluso de React DevTools)
        // Filtramos algunos muy ruidosos si es necesario
        if (event.data && event.data.source !== 'react-devtools-bridge' && event.data.type !== 'webpackOk') {
            console.log('Mensaje recibido en GameHero:', event.data);
        }

        // Aceptar mensajes del iframe del juego
        let data = event.data;
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                // No es JSON válido
            }
        }
        
        if (!data || typeof data !== 'object') return;
        
        // Soportar tanto GAME_OVER (versión anterior/completa) como setScore (nueva versión del plugin)
        if (data.type !== 'GAME_OVER' && data.type !== 'setScore') return;
        
        console.log('¡Evento de fin de juego detectado!', data);
        
        if (!estaAutenticado) {
            console.log('Usuario no autenticado, ignorando guardado de puntaje.');
            return;
        }

        // Extraer los datos dependiendo del formato del mensaje
        let puntos = 0;
        let residuosRecolectados = 0;
        let errores = 0;
        let rachaMaxima = 0;
        let tiempoJugado = 0;

        if (data.type === 'setScore') {
            puntos = data.score || 0;
            // Podríamos asumir 1 partida jugada y un residuo para que cuente como participación
            residuosRecolectados = puntos > 0 ? 1 : 0;
        } else {
            puntos = data.puntos || 0;
            residuosRecolectados = data.residuosRecolectados || 0;
            errores = data.errores || 0;
            rachaMaxima = data.rachaMaxima || 0;
            tiempoJugado = data.tiempoJugado || 0;
        }

        if (puntos <= 0 && residuosRecolectados <= 0) {
            console.log('Ignorando guardado: la partida no tiene puntos ni residuos recolectados.');
            return; // partida vacía
        }

        try {
            setGuardando(true);
            const response = await guardarPuntajeJuego({
                puntos,
                residuosRecolectados,
                errores,
                rachaMaxima,
                tiempoJugado
            });

            if (response.success) {
                setResultadoPartida({
                    puntos: response.data.puntosGanados,
                    puntosTemporada: response.data.puntosTemporada,
                    nuevosLogros: response.data.nuevosLogros || []
                });
                // Notificar al padre para que recargue ranking/logros
                if (onPuntajeGuardado) onPuntajeGuardado();
            }
        } catch (err) {
            console.error('Error guardando puntaje:', err);
        } finally {
            setGuardando(false);
        }
    }, [estaAutenticado, onPuntajeGuardado]);

    useEffect(() => {
        window.addEventListener('message', handleGameMessage);
        return () => window.removeEventListener('message', handleGameMessage);
    }, [handleGameMessage]);

    const cerrarResultado = () => setResultadoPartida(null);

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

            <div className="max-w-5xl mx-auto md:px-6">
                <AnimatePresence mode="wait">
                    {!isPlaying ? (
                        <motion.div
                            key="lobby"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="glass-card rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden max-w-3xl mx-auto border border-green-200/50 mx-4 md:mx-auto"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-lime-400/20 via-emerald-400/10 to-green-500/20 pointer-events-none" />

                            <div className="relative z-10">
                                <motion.div
                                    animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
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

                                {/* Resultado de última partida */}
                                <AnimatePresence>
                                    {resultadoPartida && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="mb-6 bg-gradient-to-br from-lime-100 to-green-100 border-2 border-lime-300 rounded-2xl p-4 text-left"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    <p className="font-bold text-green-900 text-sm">¡Puntaje guardado!</p>
                                                </div>
                                                <button onClick={cerrarResultado} className="text-green-400 hover:text-green-700 text-xl leading-none">×</button>
                                            </div>
                                            <p className="text-2xl font-extrabold text-green-700">
                                                +{resultadoPartida.puntos.toLocaleString()} pts
                                            </p>
                                            <p className="text-xs text-green-600 mt-1">
                                                Total en temporada: {resultadoPartida.puntosTemporada.toLocaleString()} pts
                                            </p>
                                            {resultadoPartida.nuevosLogros.length > 0 && (
                                                <div className="mt-3 space-y-1">
                                                    <p className="text-xs font-semibold text-yellow-700 flex items-center gap-1">
                                                        <Trophy className="w-3.5 h-3.5" /> ¡Logros desbloqueados!
                                                    </p>
                                                    {resultadoPartida.nuevosLogros.map((logro) => (
                                                        <div key={logro.id} className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-2 py-1">
                                                            <Star className="w-3 h-3 text-yellow-500" />
                                                            <span className="text-xs font-medium text-yellow-800">{logro.nombre}</span>
                                                            <span className="ml-auto text-xs text-yellow-600 font-bold">+{logro.puntos} pts</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.button
                                    {...animations.buttonHover}
                                    onClick={() => { setIsPlaying(true); setResultadoPartida(null); }}
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
                            ref={gameWrapperRef}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="w-full flex flex-col bg-slate-900 sm:rounded-3xl overflow-hidden shadow-2xl sm:border-4 border-emerald-500/30"
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
                                <div className="text-emerald-400 font-bold text-sm hidden sm:flex items-center gap-2">
                                    Eco-Juego Interactiva
                                    {guardando && (
                                        <span className="text-xs text-lime-400 animate-pulse">💾 Guardando...</span>
                                    )}
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

                            {/* Iframe del juego con Controles Superpuestos */}
                            <div ref={iframeContainerRef} className="relative w-full aspect-[4/3] sm:aspect-video bg-black flex items-center justify-center">
                                <iframe
                                    ref={iframeRef}
                                    src="/eco-juego/index.html"
                                    title="Eco Juego WebGL"
                                    className="w-full h-full border-0"
                                    allowFullScreen
                                    allow="autoplay; fullscreen; xr-spatial-tracking; pointer-lock"
                                />

                                {/* Controles móviles superpuestos */}
                                <div className="absolute inset-x-0 bottom-0 p-3 md:hidden flex justify-between items-end pointer-events-none z-10">
                                    {/* D-Pad */}
                                    <div className="grid grid-cols-3 gap-1 pointer-events-auto opacity-75 hover:opacity-100 transition-opacity">
                                        <div />
                                        <MobileControlButton icon={ArrowUp} keyName="ArrowUp" keyCode={38} />
                                        <div />
                                        
                                        <MobileControlButton icon={ArrowLeft} keyName="ArrowLeft" keyCode={37} />
                                        <MobileControlButton icon={ArrowDown} keyName="ArrowDown" keyCode={40} />
                                        <MobileControlButton icon={ArrowRight} keyName="ArrowRight" keyCode={39} />
                                    </div>
                                    
                                    {/* Action Button */}
                                    <div className="pointer-events-auto opacity-75 hover:opacity-100 transition-opacity mb-2 mr-2">
                                        <button
                                            onPointerDown={(e) => { e.preventDefault(); simulateKeyEvent(" ", 32, true); }}
                                            onPointerUp={(e) => { e.preventDefault(); simulateKeyEvent(" ", 32, false); }}
                                            onPointerLeave={(e) => { e.preventDefault(); simulateKeyEvent(" ", 32, false); }}
                                            className="w-16 h-16 bg-emerald-600/70 active:bg-emerald-600/100 rounded-full flex flex-col items-center justify-center shadow-2xl border-2 border-emerald-400/50 backdrop-blur-md select-none touch-none transition-all"
                                        >
                                            <span className="text-white font-extrabold tracking-wider text-[10px] uppercase">Acción</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default GameHero;
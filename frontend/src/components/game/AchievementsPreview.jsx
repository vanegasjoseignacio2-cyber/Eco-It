import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Leaf, Recycle, TreeDeciduous, Star, Lock, Trophy, Target,
    Zap, Gamepad2, Diamond, Backpack
} from 'lucide-react';
import animations from '../animations/Animationgame';
import { obtenerLogrosUsuario } from '../../services/api';

const ICON_MAP = {
    Leaf,
    Recycle,
    TreeDeciduous,
    Star,
    Trophy,
    Target,
    Zap,
    Gamepad2,
    Diamond,
    Backpack
};

const SkeletonCard = () => (
    <div className="rounded-xl md:rounded-2xl p-3 md:p-4 bg-gray-100 border-2 border-gray-200 animate-pulse">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-200 mb-2 md:mb-3" />
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
        <div className="h-2 bg-gray-100 rounded w-1/2" />
    </div>
);

const AchievementsPreview = ({ refreshKey }) => {
    const [logros, setLogros] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [tooltip, setTooltip] = useState(null);

    const cargarLogros = async () => {
        try {
            setLoading(true);
            setError(false);
            const res = await obtenerLogrosUsuario();
            if (res.success) {
                setLogros(res.data.logros);
                setEstadisticas(res.data.estadisticas);
            }
        } catch (err) {
            console.error('Error cargando logros:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarLogros();
    }, [refreshKey]);

    const desbloqueados = logros.filter(l => l.desbloqueado).length;

    return (
        <motion.div
            {...animations.fadeInLeft}
            transition={{ delay: 0.5 }}
            className="bg-white/70 rounded-2xl md:rounded-3xl p-4 md:p-8 h-full flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-green-900 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Logros
                </h3>
                {!loading && (
                    <span className="px-3 py-1 rounded-full bg-lime-100 text-lime-700 text-xs font-bold">
                        {desbloqueados}/{logros.length}
                    </span>
                )}
            </div>

            {/* Barra de progreso general */}
            {!loading && logros.length > 0 && (
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-green-600 mb-1">
                        <span>Progreso</span>
                        <span>{Math.round((desbloqueados / logros.length) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(desbloqueados / logros.length) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full rounded-full bg-gradient-to-r from-lime-400 to-green-500"
                        />
                    </div>
                </div>
            )}

            {/* Grid de logros */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 flex-1">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                ) : error ? (
                    <div className="col-span-2 text-center py-8 text-green-600 text-sm">
                        <p>No se pudieron cargar los logros.</p>
                        <button onClick={cargarLogros} className="mt-2 underline text-lime-600">Reintentar</button>
                    </div>
                ) : (
                    logros.map((logro, index) => {
                        const IconComponent = ICON_MAP[logro.icono] || Star;
                        return (
                            <motion.div
                                key={logro.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 + index * 0.07 }}
                                className={`relative rounded-xl md:rounded-2xl p-3 md:p-4 cursor-help transition-all
                                    ${logro.desbloqueado
                                        ? 'bg-gradient-to-br from-lime-50 to-green-100 border-2 border-lime-300 hover:shadow-lg hover:scale-[1.02]'
                                        : 'bg-gray-100 border-2 border-gray-200 opacity-70 hover:opacity-90'
                                    }`}
                                onMouseEnter={() => setTooltip(logro.id)}
                                onMouseLeave={() => setTooltip(null)}
                            >
                                {/* Tooltip descripción */}
                                {tooltip === logro.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 w-44 text-center shadow-xl pointer-events-none"
                                    >
                                        {logro.descripcion}
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-slate-800" />
                                    </motion.div>
                                )}

                                {/* Candado si bloqueado */}
                                {!logro.desbloqueado && (
                                    <div className="absolute top-2 right-2">
                                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                                    </div>
                                )}

                                {/* Icono */}
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-3
                                    ${logro.desbloqueado
                                        ? 'bg-gradient-to-br from-lime-400 to-green-500'
                                        : 'bg-gray-300'}`}
                                >
                                    <IconComponent className={`w-5 h-5 md:w-6 md:h-6 ${logro.desbloqueado ? 'text-white' : 'text-gray-400'}`} />
                                </div>

                                {/* Nombre */}
                                <h4 className={`font-semibold text-xs md:text-sm leading-tight ${logro.desbloqueado ? 'text-green-900' : 'text-gray-500'}`}>
                                    {logro.nombre}
                                </h4>

                                {/* Puntos */}
                                <p className={`text-xs mt-0.5 ${logro.desbloqueado ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                                    +{logro.puntos.toLocaleString()} pts
                                </p>

                                {/* Fecha de desbloqueo */}
                                {logro.desbloqueado && logro.desbloqueadoEn && (
                                    <p className="text-[10px] text-green-400 mt-0.5">
                                        {new Date(logro.desbloqueadoEn).toLocaleDateString('es-CO')}
                                    </p>
                                )}
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Stats rápidas */}
            {estadisticas && !loading && (
                <div className="mt-4 pt-4 border-t border-green-100 grid grid-cols-3 gap-2 text-center">
                    <div>
                        <p className="text-lg font-bold text-green-700">{estadisticas.residuosRecolectados}</p>
                        <p className="text-[10px] text-green-500">Residuos</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-green-700">{estadisticas.partidasJugadas}</p>
                        <p className="text-[10px] text-green-500">Partidas</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-green-700">{estadisticas.rachaMaxima}</p>
                        <p className="text-[10px] text-green-500">Racha max</p>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default AchievementsPreview;
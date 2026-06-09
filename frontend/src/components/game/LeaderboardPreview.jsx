import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, RefreshCw } from 'lucide-react';
import animations from '../animations/Animationgame';
import { obtenerRankingReal } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SeasonCountdown from './SeasonCountdown';

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

const SkeletonRow = () => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-2 bg-gray-100 rounded w-1/3" />
        </div>
    </div>
);

const LeaderboardPreview = ({ refreshKey }) => {
    const { usuario } = useAuth();
    const [ranking, setRanking] = useState([]);
    const [temporada, setTemporada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const cargarRanking = async () => {
        try {
            setLoading(true);
            setError(false);
            const res = await obtenerRankingReal();
            if (res.success) {
                setRanking(res.data.ranking);
                setTemporada(res.data.temporada);
            }
        } catch (err) {
            console.error('Error cargando ranking:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarRanking();
    }, [refreshKey]);

    return (
        <motion.div
            {...animations.fadeInRight}
            transition={{ delay: 0.5 }}
            className="bg-white/70 rounded-2xl md:rounded-3xl p-4 md:p-8 h-full flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 md:mb-5">
                <h3 className="text-xl md:text-2xl font-bold text-green-900 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500" />
                    Ranking Temporada
                </h3>
                <button
                    onClick={cargarRanking}
                    disabled={loading}
                    className="p-1.5 rounded-lg text-green-400 hover:text-green-700 hover:bg-green-50 transition-colors"
                    title="Actualizar"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Cuenta regresiva */}
            <SeasonCountdown temporada={temporada} />

            {/* Ranking list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3 flex-1">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : error ? (
                    <div className="text-center py-8 text-green-600 text-sm col-span-2">
                        <p>No se pudo cargar el ranking.</p>
                        <button onClick={cargarRanking} className="mt-2 underline text-lime-600">Reintentar</button>
                    </div>
                ) : ranking.length === 0 ? (
                    <div className="text-center py-8 text-green-600 text-sm col-span-2">
                        <p>¡Sé el primero en el ranking!</p>
                        <p className="text-xs mt-1 text-green-400">Juega una partida para aparecer aquí.</p>
                    </div>
                ) : (
                    ranking.map((user, index) => {
                        const esYo = user.esYo || (usuario && usuario.nombre === user.name);
                        return (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.08 }}
                                className={`flex items-center gap-3 md:gap-4 p-3 rounded-xl hover:shadow-md transition-shadow
                                    ${user.rank <= 3
                                        ? 'bg-gradient-to-r from-lime-50 to-green-50 border border-lime-200'
                                        : 'bg-white/50'}
                                    ${esYo ? 'ring-2 ring-lime-400 ring-offset-1' : ''}`}
                            >
                                {/* Posición */}
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0
                                    ${user.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white'
                                        : user.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                                        : user.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
                                        : 'bg-green-100 text-green-700'}`}>
                                    {user.rank}
                                </div>

                                {/* Avatar */}
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0
                                    ${esYo ? 'bg-gradient-to-br from-lime-500 to-green-600' : 'bg-gradient-to-br from-green-400 to-emerald-500'}`}>
                                    {user.avatar}
                                </div>

                                {/* Nombre y puntos */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-green-900 text-sm md:text-base truncate">
                                        {user.name} {esYo && <span className="text-lime-600 text-xs font-normal">(tú)</span>}
                                    </p>
                                    <p className="text-xs md:text-sm text-green-600">
                                        {user.points.toLocaleString()} pts
                                    </p>
                                </div>

                                {/* Medalla */}
                                {user.rank <= 3 && (
                                    <div className="text-xl md:text-2xl flex-shrink-0">{MEDAL[user.rank]}</div>
                                )}
                            </motion.div>
                        );
                    })
                )}
            </div>
        </motion.div>
    );
};

export default LeaderboardPreview;
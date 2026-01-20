import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import animations from '../animations/Animationgame';

const LeaderboardPreview = ({ leaderboard }) => {
    //  RANKING - PUNTO DE INTEGRACIÓN CON BACKEND
    // TODO: Reemplazar con llamada a API
    // const { data: leaderboard, loading } = useLeaderboard('weekly');
    // API Endpoint: GET /api/leaderboard?period=weekly&limit=5

    return (
        <motion.div
            {...animations.fadeInRight}
            transition={{ delay: 0.5 }}
            className="bg-white/70 rounded-2xl md:rounded-3xl p-4 md:p-8 h-full"
        >
            <h3 className="text-xl md:text-2xl font-bold text-green-900 mb-4 md:mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Vista Previa: Ranking
            </h3>

            {/* Grid Responsive de Ranking */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3">
                {leaderboard.map((user, index) => (
                    <motion.div
                        key={user.id} //  ID único para MongoDB
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className={`flex items-center gap-3 md:gap-4 p-3 rounded-xl hover:shadow-md transition-shadow ${user.rank <= 3
                                ? "bg-gradient-to-r from-lime-50 to-green-50 border border-lime-200"
                                : "bg-white/50"
                            }`}
                    >
                        {/* Número de Ranking */}
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0 ${user.rank === 1
                                ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white"
                                : user.rank === 2
                                    ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                                    : user.rank === 3
                                        ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
                                        : "bg-green-100 text-green-700"
                            }`}>
                            {user.rank}
                        </div>

                        {/* Avatar del Usuario */}
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm md:text-base flex-shrink-0">
                            {user.avatar}
                        </div>

                        {/* Info del Usuario */}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-green-900 text-sm md:text-base truncate">
                                {user.name}
                            </p>
                            <p className="text-xs md:text-sm text-green-600">
                                {user.points.toLocaleString()} pts
                            </p>
                        </div>

                        {/* Medalla para Top 3 */}
                        {user.rank <= 3 && (
                            <div className="text-xl md:text-2xl flex-shrink-0">
                                {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : "🥉"}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default LeaderboardPreview;
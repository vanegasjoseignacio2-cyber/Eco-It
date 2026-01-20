import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Recycle, TreeDeciduous, Star, Lock } from 'lucide-react';
import animations from '../animations/Animationgame';

const AchievementsPreview = ({ achievements }) => {
    // LOGROS - PUNTO DE INTEGRACIÓN CON BACKEND
    // TODO: Reemplazar con llamada a API
    // const { data: achievements, loading } = useAchievements(userId);
    // API Endpoint: GET /api/achievements/:userId

    // Mapeo de iconos de lucide-react
    const iconMap = {
        Leaf: Leaf,
        Recycle: Recycle,
        TreeDeciduous: TreeDeciduous,
        Star: Star,
    };

    return (
        <motion.div
            {...animations.fadeInLeft}
            transition={{ delay: 0.5 }}
            className="bg-white/70 rounded-2xl md:rounded-3xl p-4 md:p-8 h-full"
        >
            <h3 className="text-xl md:text-2xl font-bold text-green-900 mb-4 md:mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Vista Previa: Logros
            </h3>

            {/* Grid Responsive de Logros */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 md:gap-4">
                {achievements.map((achievement, index) => {
                    const IconComponent = iconMap[achievement.icon];

                    return (
                        <motion.div
                            key={achievement.id} // 🔑 ID único para MongoDB
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className={`relative rounded-xl md:rounded-2xl p-3 md:p-4 ${achievement.unlocked
                                    ? "bg-gradient-to-br from-lime-50 to-green-100 border-2 border-lime-300"
                                    : "bg-gray-100 border-2 border-gray-200"
                                } hover:shadow-lg transition-shadow`}
                        >
                            {!achievement.unlocked && (
                                <div className="absolute inset-0 bg-gray-200/50 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
                                    <Lock className="w-6 h-6 text-gray-400" />
                                </div>
                            )}

                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl ${achievement.unlocked
                                    ? "bg-gradient-to-br from-lime-400 to-green-500"
                                    : "bg-gray-300"
                                } flex items-center justify-center mb-2 md:mb-3`}>
                                <IconComponent className={`w-6 h-6 ${achievement.unlocked ? "text-white" : "text-gray-500"}`} />
                            </div>

                            <h4 className={`font-semibold text-xs md:text-sm ${achievement.unlocked ? "text-green-900" : "text-gray-500"
                                }`}>
                                {achievement.name}
                            </h4>

                            <p className={`text-xs ${achievement.unlocked ? "text-green-600" : "text-gray-400"
                                }`}>
                                +{achievement.points} pts
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

// Importar Trophy desde lucide-react
import { Trophy } from 'lucide-react';

export default AchievementsPreview;
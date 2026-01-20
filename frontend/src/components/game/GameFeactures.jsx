import React from 'react';
import { motion } from 'framer-motion';
import { Target, Trophy, Users, Zap } from 'lucide-react';
import animations from '../animations/Animationgame';

const GameFeatures = ({ features }) => {
    // Mapeo de iconos de lucide-react
    const iconMap = {
        Target: Target,
        Trophy: Trophy,
        Users: Users,
        Zap: Zap,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16 px-4"
        >
            {features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon];

                return (
                    <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        {...animations.hoverLift}
                        className="bg-white/70 rounded-2xl p-6 text-center hover:shadow-xl transition-all"
                    >
                        <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                            <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-bold text-green-900 mb-2 text-sm md:text-base">
                            {feature.title}
                        </h3>
                        <p className="text-xs md:text-sm text-green-600">
                            {feature.description}
                        </p>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default GameFeatures;
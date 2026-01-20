import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

// Importar componentes
import GameHero from '../game/GameHero';
import GameFeatures from '../game/GameFeactures';
import AchievementsPreview from '../game/AchievementsPreview';
import LeaderboardPreview from '../game/LeaderboardPreview';
import CTASection from '../game/CTASection';

// Importar data
import gameData from '../../Constants/GameData';

// Importar tus componentes existentes
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';

const GamePage = () => {
    return (
        <div className="min-h-screen nature-bg">
            <Navbar />

            <main className="pt-20 min-h-screen w-full bg-gradient-to-r from-emerald-50 via-emerald-100 to-lime-100 relative">
<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#f7fef9_0%,_transparent_40%)]"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_#ecfccb_0%,_transparent_50%)]"></div>

                <section className="py-8  md:py-12 lg:py-20 relative overflow-hidden">
                    {/* Animated Background Icons */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute text-emerald-500/20"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    y: [0, -30, 0],
                                    rotate: [0, 360],
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 5 + Math.random() * 5,
                                    repeat: Infinity,
                                    delay: Math.random() * 5,
                                }}
                            >
                                <Gamepad2 className="w-8 h-8" />
                            </motion.div>
                        ))}
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        {/* Hero Section */}
                        <GameHero />

                        {/* Features Grid */}
                        <GameFeatures features={gameData.features} />

                        {/* Achievements and Leaderboard */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 px-4 mb-8">
                            <AchievementsPreview achievements={gameData.achievements} />
                            <LeaderboardPreview leaderboard={gameData.leaderboard} />
                        </div>

                        {/* CTA Section */}
                        <CTASection />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default GamePage;
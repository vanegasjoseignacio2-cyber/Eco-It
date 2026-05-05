import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { obtenerPerfil } from '../../services/api';

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
    const { usuario, estaAutenticado, logout } = useAuth();
    const [bannedData, setBannedData] = useState(null);

    useEffect(() => {
        // Verificar status del usuario
        const verificarBaneo = async () => {
            if (!estaAutenticado) return;
            try {
                // Consultamos el perfil actual para actualizar en tiempo real
                const data = await obtenerPerfil();
                if (data.success && data.data.status === 'banned') {
                    setBannedData(data.data.banHasta);
                } else if (usuario && usuario.status === 'banned') {
                    setBannedData(usuario.banHasta);
                }
            } catch (error) {
                console.error("Error validando perfil", error);
            }
        };

        verificarBaneo();
    }, [estaAutenticado, usuario]);

    const renderBannedScreen = () => {
        let mensaje = "Fuiste baneado por comportamiento inadecuado.";
        if (bannedData) {
            const banDate = new Date(bannedData);
            const now = new Date();
            const diff = banDate.getTime() - now.getTime();
            if (diff > 0) {
                const dias = Math.ceil(diff / (1000 * 3600 * 24));
                mensaje += ` Tiempo restante para el desbaneo: ${dias} día(s).`;
            }
        }

        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 w-full px-4 relative z-10">
                <div className="text-red-600 bg-red-50 p-8 rounded-3xl max-w-lg text-center border-2 border-red-200 shadow-lg">
                    <h2 className="text-3xl font-extrabold mb-4">Acceso Denegado</h2>
                    <p className="text-red-800 text-lg">{mensaje}</p>
                    <button 
                        onClick={logout} 
                        className="mt-8 px-6 py-3 bg-red-100 hover:bg-red-200 text-red-900 rounded-xl transition-all shadow-sm font-semibold inline-flex items-center gap-2"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        );
    };

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
                        {bannedData ? renderBannedScreen() : (
                            <>
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
                            </>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default GamePage;
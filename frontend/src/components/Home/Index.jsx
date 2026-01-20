import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Map,
    Leaf,
    TreePine,
    Globe,
    Sparkles,
    ArrowRight,
    MapPin,
} from "lucide-react";
import AnimatedSection from "../animations/Animatedsection";

// futuras estadísticas
const stats = [
    { value: "", label: "Usuarios Activos", icon: Globe },
    { value: "", label: "Puntos de Reciclaje", icon: MapPin },
    { value: "", label: "Consultas IA", icon: Sparkles },
    { value: "", label: "Ciudades", icon: TreePine },
];

export default function Index() {
    return (
        <main>
            {/*HERO*/}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

                {/* Fondo */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" />

                {/* Hojas flotantes */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-green-600/20"
                            initial={{ y: "100vh", x: `${15 + i * 15}vw` }}
                            animate={{ y: "-10vh", rotate: 360 }}
                            transition={{
                                duration: 15 + i * 2,
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * 2,
                            }}
                        >
                            <Leaf size={30 + i * 10} />
                        </motion.div>
                    ))}
                </div>

                {/* Contenido */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">

                    {/* Badge */}
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 mb-8"
                    >
                        <Sparkles className="w-4 h-4" />
                        Plataforma Ecológica Inteligente
                    </motion.span>

                    {/* titulo */}
                    <AnimatedSection delay={100}>
                        <h1 className="text-6xl md:text-8xl font-bold mb-6">
                            Recicla con <span className="text-green-600">Eco-It</span>
                        </h1>
                    </AnimatedSection>

                    {/* Subs */}
                    <AnimatedSection delay={250}>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 text-gray-700">
                            Descubre puntos ecológicos, consulta con IA y aprende jugando.
                        </p>
                    </AnimatedSection>

                    {/* botones */}
                    <AnimatedSection delay={400}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/ai">
                                <button className="btn-hover group px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-lg shadow-xl shadow-green-500/25 hover:shadow-green-500/40 flex items-center gap-3 hover:scale-105 transition-all duration-500">
                                    Comenzar Ahora
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>

                            <Link to="/maps">
                                <button className="btn-hover px-8 py-4 rounded-full border-2 border-green-600 text-green-600 font-semibold text-lg shadow-xl shadow-green-500/0 hover:bg-gradient-to-r from-green-500 to-emerald-600 hover:text-white transition-all flex items-center gap-3 hover:shadow-green-500/40 hover:border-none hover:scale-105 duration-500">
                                    <Map className="w-5 h-5" />
                                    Ver Mapas
                                </button>
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </main>
    );
}

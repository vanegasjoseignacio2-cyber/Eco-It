import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { fadeUp } from "../animations/motionVariants";

export default function HeroSection() {
    return (
        <section className="relative py-16 bg-gradient-to-br  from-green-600 via-emerald-500 to-teal-400 text-white overflow-hidden">
            <div className="relative max-w-7xl mx-auto px-4 text-center">
                <motion.div {...fadeUp}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 mb-6">
                        <Sparkles className="w-4 h-4" />
                        Asistente Inteligente
                    </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Eco-IA Asistente
                        </h1>
                        <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                            Tu guía inteligente para resolver dudas sobre reciclaje
                        </p>
                </motion.div>
            </div>
        </section>
    );
}

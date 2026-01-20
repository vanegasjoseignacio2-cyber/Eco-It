import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "../animations/Animatedsection";
import AnimatedIconsBackground from "../animations/AnimatedIconsBackground";
import ShinyText from "../animations/ShinyText";

export default function HeaderContact() {
    return (
        <section className="relative py-16 mt-20 bg-gradient-to-tr from-green-100 via-emerald-100/70 to-teal-50/70 overflow-hidden">

            <AnimatedIconsBackground />

            {/* CONTENIDO */}
            <div className="relative max-w-7xl mx-auto px-4 text-center">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 mb-8"
                >
                    <MessageCircle className="w-4 h-4" />
                    Estamos aquí para ti
                </motion.span>

                <AnimatedSection delay={150}>
                    <h1 className="text-4xl md:text-5xl font-bold text-emerald-800">
                        Ponte en{" "}
                        <ShinyText
                            text="Contacto"
                            speed={10}
                            color="#16a34a"
                            shineColor="#4ade80"
                            className="font-bold"
                        />
                    </h1>

                </AnimatedSection>

                <AnimatedSection delay={250}>
                    <p className="text-xl text-green-700 max-w-2xl mx-auto">
                        ¿Tienes preguntas, sugerencias o quieres colaborar? Nos encantaría escucharte
                    </p>
                </AnimatedSection>
            </div>
        </section>
    );
}

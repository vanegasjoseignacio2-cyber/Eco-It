import { Leaf, MessageSquare } from "lucide-react";
import AnimatedSection from "../animations/Animatedsection";

export default function Section() {
    return (
        <section className="py-24 bg-gradient-to-br from-green-600 to-emerald-700 text-white relative overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, white 2px, transparent 2px)",
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>

            {/* Contenido */}
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <AnimatedSection delay={100}>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        ¿Listo para hacer la diferencia?
                    </h2>

                    <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
                        Únete a miles de personas que ya están cambiando el mundo con Eco-It.
                        Cada acción cuenta.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="btn-hover px-8 py-4 rounded-full bg-white text-green-600 font-semibold text-lg shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 transition-transform hover:scale-105">
                            <Leaf className="w-5 h-5" />
                            Crear Cuenta Gratis
                        </button>

                        <button className="btn-hover px-8 py-4 rounded-full border-2 border-white text-white font-semibold text-lg hover:bg-white/10 flex items-center justify-center gap-3 transition-transform hover:scale-105">
                            <MessageSquare className="w-5 h-5" />
                            Contáctanos
                        </button>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}


import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import ViewportMotion from "../animations/ViewportMotion";

const faqItems = [
    {
        question: "¿Eco-It es gratuito?",
        answer:
            "¡Sí! Eco-It es completamente gratuito. Nuestra misión es hacer accesible la información sobre reciclaje para todos.",
    },
    {
        question: "¿Cómo puedo encontrar puntos de reciclaje?",
        answer:
            "Usa nuestra función de Mapas Ecológicos. Puedes filtrar por tipo de residuo y encontrar el punto más cercano a tu ubicación.",
    },
    {
        question: "¿El asistente IA realmente puede identificar materiales?",
        answer:
            "Nuestro asistente puede analizar imágenes y darte orientación sobre cómo reciclar diferentes materiales.",
    },
    {
        question: "¿Cuándo estará disponible el Eco-Juego?",
        answer:
            "Estamos trabajando arduamente en el desarrollo. ¡Esperamos lanzarlo muy pronto!",
    },
];

export default function ContactFAQ() {
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <ViewportMotion direction="right">
            <div className="space-y-6 w-[80vh] max-w-4xl mx-auto lg:ml-0">
                <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
                    <Leaf className="w-6 h-6 text-green-700" />
                    Preguntas Frecuentes
                </h2>

                {faqItems.map((faq, index) => (
                    <div
                        key={index}
                        className="glass-card rounded-2xl overflow-hidden bg-white/70"
                    >
                        <button
                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            className="w-full px-6 py-4 flex justify-between items-center text-left text-green-800 font-medium hover:bg-white/95"
                        >
                            {faq.question}
                            <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }}>
                                <ArrowRight className="w-5 h-5 rotate-90 text-green-600" />
                            </motion.div>
                        </button>

                        {openFaq === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                className="px-6 pb-4 text-green-700"
                            >
                                {faq.answer}
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>
        </ViewportMotion>
    );
}

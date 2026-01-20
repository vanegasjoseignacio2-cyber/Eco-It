import { motion } from "framer-motion";
import { Bot, Lightbulb, Leaf } from "lucide-react";
import SuggestedQuestions from "./Suggestedquestions";
import { fadeSideLeft } from "../animations/motionVariants";

export default function EcoSidebar({ onQuestion }) {
    return (
        <motion.aside {...fadeSideLeft} className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100 border-2 border-emerald-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 flex items-center justify-center">
                        <Bot className="text-white" />
                    </div>
                    <div className="">
                        <h3 className="font-bold">Eco-IA</h3>
                        <p className="text-sm text-muted-foreground">En línea</p>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    Pregunta o sube imágenes de residuos
                </p>
            </div>

            <SuggestedQuestions onSelect={onQuestion} />

            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100 border-2 border-emerald-300">
                <h3 className="font-bold flex items-center gap-2 text-green-600">
                    <Leaf /> Dato Ecológico
                </h3>
                <p className="text-sm mt-2">
                    Reciclar una tonelada de papel salva 17 árboles 🌱
                </p>
            </div>
        </motion.aside>
    );
}

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { suggestedQuestions } from "../../Data/botResponses";

export default function SuggestedQuestions({ onSelect }) {
    return (
        <div className="p-4 bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100 sm:p-6 rounded-2xl border-2 border-emerald-300">
            <h3 className="font-bold  rounded-2xl mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                Preguntas sugeridas
            </h3>

            <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onSelect(question)}
                        className="
                w-full text-left
                p-3
                rounded-xl
                bg-secondary/50 hover:bg-secondary
                text-xs sm:text-sm
                transition-all
                "
                    >
                        {question}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

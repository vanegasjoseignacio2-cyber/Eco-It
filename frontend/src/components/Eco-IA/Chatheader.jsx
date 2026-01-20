import { Bot } from "lucide-react";
import AnimatedSection from "../animations/Animatedsection";

export default function ChatHeader() {
    return (
        <div className="
        top-10 z-10
        p-3 sm:p-4
        border-b border-border
        bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500
        backdrop-blur
        ">
            <div className="flex items-center gap-3">
                <div className="
            w-9 h-9 sm:w-10 sm:h-10
            rounded-full
            bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500
            flex items-center justify-center
            ">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>

                <div>
                    <AnimatedSection delay={100}>
                    <h3 className="font-semibold text-sm sm:text-base">
                        Eco-IA Chat
                    </h3>
                    </AnimatedSection>

                    <AnimatedSection delay={400}>
                    <p className="text-xs text-muted-foreground">
                        Siempre listo para ayudarte
                    </p>
                    </AnimatedSection>
                </div>
            </div>
        </div>
    );
}

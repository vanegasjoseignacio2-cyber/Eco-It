import { Check, Recycle } from "lucide-react";
import {FadeInLeft,ScaleIn,} from "../animations/Animatedlogin";


export default function LoginHero() {
    const items = [
        "Accede a mapas personalizados",
        "Guarda tus puntos favoritos",
        "Historial de preguntas al asistente",
        "Participa en la comunidad",
    ];

    return (
        <FadeInLeft>
            <div className="mt-16 lg:mt-24 relative block">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-200 rounded-full blur-3xl opacity-50" />

                <div className="relative z-10 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
                    <ScaleIn delay={0.2}>
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl mb-8 mx-auto lg:mx-0">
                            <Recycle className="w-12 h-12 text-white" />
                        </div>
                    </ScaleIn>

                    <h1 className="text-4xl xl:text-5xl font-bold text-green-900 mb-4">
                        Bienvenido de nuevo a <span className="eco-gradient-text">Eco-It</span>
                    </h1>

                    <p className="text-xl text-green-700 mb-8">
                        Inicia sesión para continuar tu camino hacia un mundo más verde
                    </p>

                    <div className="space-y-4">
                        {items.map((item, i) => (
                            <FadeInLeft key={item} delay={0.3 + i * 0.1}>
                                <div className="flex items-center gap-3 text-green-700">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white">
                                        <Check className="w-4 h-4 stroke-[2.5]"/>
                                    </div>
                                    {item}
                                </div>
                            </FadeInLeft>
                        ))}
                    </div>
                </div>
            </div>
        </FadeInLeft>
    );
}

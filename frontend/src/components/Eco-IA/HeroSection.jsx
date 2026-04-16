import { motion } from "framer-motion";
import { Sparkles, Leaf, Zap } from "lucide-react";

export default function HeroSection() {
    const title = "Eco-IA";
    const characters = Array.from(title);

    const scrollToChat = () => {
        const chatElement = document.getElementById("chat-section");
        if (chatElement) {
            chatElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="relative h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-100 via-emerald-100 to-lime-50">
            {/* Orbs decorativos - Más luminosos */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-20 -left-20 w-[35rem] h-[35rem] bg-emerald-200/40 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-16 -right-16 w-[40rem] h-[40rem] bg-teal-200/30 rounded-full blur-[120px] pointer-events-none"
            />
            
            {/* Grid pattern suave */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.05]"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px"
                }}
            />

            <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 mb-8 shadow-xl"
                    >
                        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                            <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                        </motion.div>
                        <span className="text-green-800 font-bold text-xs tracking-[0.2em] uppercase">Tecnología Sostenible</span>
                    </motion.div>

                    {/* Título con animación de escritura */}
                    <div className="flex justify-center mb-8">
                        <motion.h1
                            className="text-7xl md:text-9xl font-black text-green-600 leading-none tracking-tighter"
                            style={{ textShadow: "0 4px 12px rgba(255,255,255,0.3)" }}
                        >
                            {characters.map((char, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, filter: "blur(0px)" }}
                                    transition={{
                                        duration: 0.3,
                                        delay: 0.6 + index * 0.15,
                                        ease: "easeOut"
                                    }}
                                    className={char === "-" ? "text-green-600" : ""}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8, duration: 0.8 }}
                        className="text-lg md:text-2xl text-[#064e3b]/80 max-w-2xl mx-auto font-medium leading-relaxed tracking-wide"
                    >
                        Experimenta el futuro del reciclaje con nuestra <span className="text-green-600 font-black">Asistente Virtual</span> más avanzada.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.2 }}
                        className="flex items-center justify-center gap-5 mt-12 flex-wrap"
                    >
                        {[
                            { icon: Leaf, label: "Ecológico" },
                            { icon: Zap, label: "Instantáneo" },
                            { icon: Sparkles, label: "Predictivo" },
                        ].map(({ icon: Icon, label }, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 2.4 + i * 0.1 }}
                                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.5)" }}
                                className="flex items-center gap-2.5 px-6 py-2.5 bg-white/30 backdrop-blur-sm rounded-xl border border-white/50 shadow-md transition-colors cursor-default"
                            >
                                <Icon className="w-4 h-4 text-emerald-700" />
                                <span className="text-sm font-bold text-green-600">{label}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Flecha de Scroll */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer group"
                onClick={scrollToChat}
            >
                <span className="text-green-600 text-[12px] font-black tracking-[0.3em] uppercase group-hover:text-emerald-900 transition-colors">Explorar</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex items-center justify-center"
                >
                    <svg 
                        width="30" 
                        height="30" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-green-700 group-hover:text-emerald-900 transition-colors"
                    >
                        <path d="M7 13L12 18L17 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30"/>
                    </svg>
                </motion.div>
            </motion.div>
        </section>
    );
}
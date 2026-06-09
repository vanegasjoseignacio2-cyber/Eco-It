import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Flame } from 'lucide-react';

const pad = (n) => String(n).padStart(2, '0');

const SeasonCountdown = ({ temporada }) => {
    const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
    const [urgente, setUrgente] = useState(false);

    useEffect(() => {
        if (!temporada?.fin) return;

        const calcular = () => {
            const ahora = Date.now();
            const fin = new Date(temporada.fin).getTime();
            const diff = Math.max(0, fin - ahora);

            const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
            const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ dias, horas, minutos, segundos });
            setUrgente(dias < 3);
        };

        calcular();
        const interval = setInterval(calcular, 1000);
        return () => clearInterval(interval);
    }, [temporada]);

    if (!temporada) return null;

    const bloques = [
        { label: 'Días', valor: timeLeft.dias },
        { label: 'Horas', valor: timeLeft.horas },
        { label: 'Min', valor: timeLeft.minutos },
        { label: 'Seg', valor: timeLeft.segundos },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-2xl p-5 md:p-6 mb-6 border-2 ${urgente
                ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
                : 'bg-gradient-to-r from-lime-50 to-emerald-50 border-lime-200'
                }`}
        >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                    {urgente
                        ? <Flame className="w-5 h-5 text-orange-500" />
                        : <Timer className="w-5 h-5 text-lime-600" />
                    }
                    <div>
                        <p className={`text-xs font-medium uppercase tracking-wider ${urgente ? 'text-orange-500' : 'text-lime-600'}`}>
                            Temporada activa
                        </p>
                        <h4 className={`font-bold text-sm md:text-base ${urgente ? 'text-orange-900' : 'text-green-900'}`}>
                            {temporada.nombre}
                        </h4>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${urgente
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-lime-100 text-lime-700'
                    }`}>
                    #{temporada.numero}
                </span>
            </div>

            {/* Cuenta regresiva */}
            <p className={`text-xs mb-3 ${urgente ? 'text-orange-600' : 'text-green-600'}`}>
                {urgente ? '⚠️ ¡La temporada está por terminar! Sube tu posición' : 'Tiempo restante para el cierre de temporada'}
            </p>

            <div className="grid grid-cols-4 gap-2">
                {bloques.map(({ label, valor }) => (
                    <motion.div
                        key={label}
                        className={`rounded-xl p-2 md:p-3 text-center ${urgente
                            ? 'bg-gradient-to-b from-orange-400 to-red-500'
                            : 'bg-gradient-to-b from-lime-400 to-green-500'
                            }`}
                        animate={urgente && label === 'Seg' ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        <p className="text-white font-extrabold text-lg md:text-2xl leading-none">
                            {pad(valor)}
                        </p>
                        <p className="text-white/80 text-[10px] md:text-xs font-medium mt-0.5">
                            {label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default SeasonCountdown;

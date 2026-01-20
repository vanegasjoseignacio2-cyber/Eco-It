import { useState, useEffect } from 'react';

export default function EfectoEcoOndas({ dark = false }) {
    const [waves, setWaves] = useState([]);

    // Configurar opacidades según modo
    const borderAlpha = dark ? 0.6 : 0.4;
    const centerAlpha = dark ? 0.5 : 0.3;
    const midAlpha = dark ? 0.25 : 0.1;

    useEffect(() => {
        // Función para crear una onda
        const createWave = () => {
            const id = Date.now() + Math.random();
            const x = Math.random() * 100;
            const y = Math.random() * 100;

            setWaves(prev => [...prev, { id, x, y }]);

            // Eliminar la onda después de 4 segundos
            setTimeout(() => {
                setWaves(prev => prev.filter(w => w.id !== id));
            }, 4000);
        };

        // Crear primera onda inmediatamente
        createWave();

        // Crear ondas iniciales adicionales
        setTimeout(() => createWave(), 800);
        setTimeout(() => createWave(), 1600);

        // Función para programar ondas de forma continua
        const scheduleWaves = () => {
            const delay = 1200 + Math.random() * 2000; // Entre 1.2 y 3.2 segundos
            return setTimeout(() => {
                createWave();
                timeoutRef.current = scheduleWaves();
            }, delay);
        };

        // Iniciar la programación de ondas
        const timeoutRef = { current: scheduleWaves() };

        // Limpiar al desmontar
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Fondo con gradiente animado */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #f7fef9, #e6fdf0, #ccf9e3)',
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 10s ease infinite alternate'
                }}
            />

            {/* Contenedor de ondas */}
            <div className="absolute inset-0 pointer-events-none">
                {waves.map(wave => (
                    <div
                        key={wave.id}
                        className="absolute rounded-full"
                        style={{
                            left: `${wave.x}%`,
                            top: `${wave.y}%`,
                            border: `2px solid rgba(16, 185, 129, ${borderAlpha})`,
                            background: `radial-gradient(circle, rgba(34, 197, 94, ${centerAlpha}), rgba(16, 185, 129, ${midAlpha}) 50%, transparent 70%)`,
                            animation: 'ripple 4s ease-out forwards'
                        }}
                    />
                ))}
            </div>

            <style jsx>{`
                        @keyframes gradientShift {
                        0% {
                            background-position: 0% 50%;
                        }
                        100% {
                            background-position: 100% 50%;
                        }
                        }

                        @keyframes ripple {
                        0% {
                            width: 20px;
                            height: 20px;
                            opacity: 1;
                            filter: blur(5px);
                            margin-left: -10px;
                            margin-top: -10px;
                        }
                        30% {
                            opacity: 0.8;
                            filter: blur(15px);
                        }
                        70% {
                            opacity: 0.4;
                            filter: blur(30px);
                        }
                        100% {
                            width: 600px;
                            height: 600px;
                            opacity: 0;
                            filter: blur(50px);
                            margin-left: -300px;
                            margin-top: -300px;
                        }
                        }
                    `}</style>
        </div>
    );
}
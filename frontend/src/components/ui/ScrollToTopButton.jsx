import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Aparece después de 400px de scroll
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    const startY = window.scrollY;
    const duration = 1200; // Duración de 1.2 segundos
    const startTime = performance.now();

    // Función de easing de entrada y salida suave (easeInOutCubic) para evitar inicios o finales bruscos
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);

      window.scrollTo(0, startY * (1 - easeProgress));

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          // Aparece desde la mitad de la pantalla (aprox) y baja suavemente
          initial={{ opacity: 0, y: -200, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.5 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 15,
            mass: 1
          }}
          className="fixed bottom-8 right-8 z-[100]"
        >
          <button
            onClick={scrollToTop}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 active:scale-95 focus:outline-none"
            aria-label="Volver arriba"
          >
            {/* Gradiente original (Base) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-teal-600 transition-opacity duration-700 ease-in-out group-hover:opacity-0 pointer-events-none"></div>
            
            {/* Gradiente de hover (Aparece suavemente) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100 pointer-events-none"></div>

            {/* Círculo exterior giratorio */}
            <div className="absolute inset-[-8px] rounded-full border-2 border-dashed border-emerald-500/40 group-hover:border-emerald-700 group-hover:scale-110 transition-all duration-500 animate-[spin_10s_linear_infinite] pointer-events-none"></div>
            
            <ChevronUp className="relative z-10 w-8 h-8 transition-transform duration-500 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


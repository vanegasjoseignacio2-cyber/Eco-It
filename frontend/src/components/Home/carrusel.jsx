/**
 * AdamaCarousel.jsx — Imagen completa, sin recortes, responsive
 * ─────────────────────────────────────────────────────────────
 * La imagen define la altura del contenedor (width:100% height:auto).
 * No hay height fijo ni position:absolute en la imagen.
 * mode="wait" garantiza que nunca hay dos slides visibles al mismo tiempo,
 * por lo que NO necesitamos overflow:hidden para la transición.
 * Navegación: dots + swipe/drag + teclado + autoplay.
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { obtenerSlidesPublicos } from "../../services/api";

// ─── SLIDES DE RESPALDO ───────────────────────────────────────────────────────
const FALLBACK_SLIDES = [
    {
        id: "fallback_1",
        src: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1920&q=80",
        alt: "Energía solar en la naturaleza",
        tag: "Energía Limpia",
        title: "Soluciones\nSostenibles",
        subtitle: "Tecnología verde al servicio del planeta.",
        active: true,
    },
    {
        id: "fallback_2",
        src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
        alt: "Bosque digital",
        tag: "Ecosistema",
        title: "Innovación\nNatural",
        subtitle: "Fusionamos datos con biodiversidad.",
        active: true,
    },
    {
        id: "fallback_3",
        src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=80",
        alt: "Ciudad sostenible",
        tag: "Smart Cities",
        title: "Ciudades\nInteligentes",
        subtitle: "Infraestructura conectada y eco-responsable.",
        active: true,
    },
];

// ─── HOOK: carga slides desde API ────────────────────────────────────────────
function useDynamicSlides() {
    const [slides, setSlides] = useState([]);

    const load = useCallback(async () => {
        try {
            const data = await obtenerSlidesPublicos();
            if (data.success && data?.slides?.length > 0) {
                setSlides(data.slides);
            } else {
                setSlides(FALLBACK_SLIDES);
            }
        } catch {
            setSlides(FALLBACK_SLIDES);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    return slides;
}

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const AUTO_PLAY_INTERVAL = 5500;
const DRAG_THRESHOLD     = 60;

// ─── VARIANTES FRAMER MOTION — cross-fade puro (sin translateX) ─────────────
// Sin translate no necesitamos overflow:hidden en el padre.
// El contenedor crece libremente con la imagen → nunca hay recorte.
const slideVariants = {
    enter:  { opacity: 0 },
    center: { opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
    exit:   { opacity: 0, transition: { duration: 0.3,  ease: "easeIn"  } },
};


const textContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const textItemVariants = {
    hidden:  { y: 24, opacity: 0, filter: "blur(6px)" },
    visible: { y: 0,  opacity: 1, filter: "blur(0px)",
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const sectionVariants = {
    hidden:  { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0,
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function AdamaCarousel() {
    const slides = useDynamicSlides();

    const [[current, direction], setCurrent] = useState([0, 1]);
    const [isPaused, setIsPaused] = useState(false);

    const wrapperRef = useRef(null);
    const isInView   = useInView(wrapperRef, { once: false, margin: "-10%" });
    const dragStart  = useRef(null);

    const displaySlides = slides.length > 0 ? slides : FALLBACK_SLIDES;
    const slide         = displaySlides[current] || displaySlides[0];

    useEffect(() => {
        setCurrent(([c]) => [Math.min(c, Math.max(slides.length - 1, 0)), 1]);
    }, [slides.length]);

    const goTo = useCallback((index) => {
        const len = slides.length || 1;
        setCurrent(([c]) => [(index + len) % len, index > c ? 1 : -1]);
    }, [slides.length]);

    const next = useCallback(() => {
        setCurrent(([c]) => {
            const len = slides.length || 1;
            return [(c + 1) % len, 1];
        });
    }, [slides.length]);

    const prev = useCallback(() => {
        setCurrent(([c]) => {
            const len = slides.length || 1;
            return [(c - 1 + len) % len, -1];
        });
    }, [slides.length]);

    // Auto-play
    useEffect(() => {
        if (isPaused || !isInView || slides.length <= 1) return;
        const id = setInterval(() => { next(); }, AUTO_PLAY_INTERVAL);
        return () => clearInterval(id);
    }, [isPaused, isInView, next, current, slides.length]);

    // Teclado
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft")  prev();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [next, prev]);

    // Drag / swipe
    const onDragStart = (e) => {
        dragStart.current = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    };
    const onDragEnd = (e) => {
        if (dragStart.current === null) return;
        const end   = e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
        const delta = dragStart.current - end;
        if (Math.abs(delta) > DRAG_THRESHOLD) delta > 0 ? next() : prev();
        dragStart.current = null;
    };

    return (
        <motion.section
            ref={wrapperRef}
            className="ada-outer"
            variants={sectionVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            aria-label="Carrusel de eventos Adama"
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ── Layout exterior ───────────────────────────────────────────── */
        .ada-outer {
          width: 100%;
          padding: 5rem 2rem 6rem;
          background: #f5f4f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
        }

        .ada-inner {
          display: grid;
          grid-template-columns: 1fr 1.8fr;
          gap: 3.5rem;
          align-items: start;
          width: 100%;
          max-width: 1280px;
        }

        /* ── Panel de texto (izquierda) ────────────────────────────────── */
        .ada-text-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-left: 1rem;
          position: sticky;
          top: 2rem;
        }

        .ada-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
          color: #8b8680;
          font-family: 'DM Sans', sans-serif;
        }

        .ada-eyebrow-line {
          display: inline-block;
          width: 28px;
          height: 1px;
          background: #c5c0b8;
        }

        .ada-main-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.4rem, 4vw, 4rem);
          line-height: 1.05;
          color: #1a1816;
          margin: 0;
          font-weight: 400;
          letter-spacing: -0.01em;
        }

        .ada-main-title em {
          font-style: italic;
          color: #5c6e50;
        }

        .ada-description {
          font-size: clamp(0.88rem, 1.2vw, 1rem);
          line-height: 1.8;
          color: #6b6560;
          max-width: 38ch;
          font-weight: 300;
        }

        /* Slide info dinámico */
        .ada-slide-info {
          border-left: 2px solid #d8d4ce;
          padding-left: 1rem;
          margin-top: 0.5rem;
        }

        .ada-slide-tag {
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
          color: #5c6e50;
          margin-bottom: 0.5rem;
        }

        .ada-slide-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.2rem, 1.8vw, 1.6rem);
          color: #1a1816;
          line-height: 1.15;
          margin: 0 0 0.5rem;
          font-weight: 400;
          white-space: pre-line;
        }

        .ada-slide-subtitle {
          font-size: 0.85rem;
          color: #8b8680;
          line-height: 1.7;
          max-width: 30ch;
          font-weight: 300;
        }

        /* ── Panel carrusel (derecha) ──────────────────────────────────── */
        /*
         * SIN overflow:hidden aquí — la imagen define la altura.
         * SIN height fijo — el contenedor crece con la imagen.
         * border-radius + box-shadow solo en el wrapper exterior.
         */
        .ada-screen-wrapper {
          border-radius: 20px;
          box-shadow:
            0 2px 0px rgba(0,0,0,0.15),
            0 32px 64px rgba(0,0,0,0.12),
            0 8px 24px rgba(0,0,0,0.08);
          background: #f5f4f0;
          overflow: hidden;   /* solo para que border-radius funcione en las esquinas */
        }

        /* Área deslizable — SIN overflow:hidden, el contenedor crece con la imagen */
        .ada-screen {
          position: relative;
          width: 100%;
          cursor: grab;
        }

        .ada-screen:active { cursor: grabbing; }

        /*
         * IMAGEN: flow normal, sin position:absolute.
         * width:100% → ocupa todo el ancho del carrusel.
         * height:auto → la altura se calcula automáticamente según el aspect-ratio.
         * Resultado: el contenedor SIEMPRE se adapta a la imagen, sea portrait,
         * landscape, cuadrada o panorámica. CERO recortes.
         */
        .ada-img {
          display: block;
          width: 100%;
          height: auto;
          pointer-events: none;
          user-select: none;
        }

        /* ── Dots ──────────────────────────────────────────────────────── */
        .ada-dots {
          display: flex;
          gap: 6px;
          align-items: center;
          justify-content: center;
          padding: 12px 0 14px;
          background: #f0efe9;
        }

        .ada-dot {
          height: 4px;
          border-radius: 3px;
          background: rgba(0,0,0,0.18);
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: none;
          padding: 0;
        }

        .ada-dot.active {
          background: #1a1816;
          width: 22px !important;
        }

        /* ── Responsividad ─────────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .ada-inner {
            grid-template-columns: 1fr 1.6fr;
            gap: 2.5rem;
          }
        }

        @media (max-width: 900px) {
          .ada-outer { padding: 3rem 1.5rem 4rem; }
          .ada-inner {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .ada-text-panel {
            padding-left: 0;
            align-items: center;
            text-align: center;
            position: static;
          }
          .ada-slide-info {
            border-left: none;
            border-top: 2px solid #d8d4ce;
            padding-left: 0;
            padding-top: 1rem;
          }
          .ada-slide-subtitle { max-width: 100%; }
          .ada-description { max-width: 100%; }
          /* Carrusel centrado en tablet */
          .ada-screen-wrapper {
            max-width: 560px;
            margin: 0 auto;
          }
        }

        @media (max-width: 640px) {
          .ada-outer { padding: 2rem 1rem 3rem; }
          .ada-main-title { font-size: 2.1rem; }
          .ada-screen-wrapper {
            max-width: 100%;
            border-radius: 14px;
          }
          .ada-screen { border-radius: 0; }
        }

        @media (max-width: 480px) {
          .ada-outer { padding: 1.5rem 0.75rem 2.5rem; }
        }
      `}</style>

            <div className="ada-inner">

                {/* ── PANEL DE TEXTO ── */}
                <motion.div
                    className="ada-text-panel"
                    variants={textContainerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    <motion.span className="ada-eyebrow" variants={textItemVariants}>
                        <span className="ada-eyebrow-line" />
                        Eventos Adama
                    </motion.span>

                    <motion.h2 className="ada-main-title" variants={textItemVariants}>
                        Momentos<br />
                        que <em>inspiran</em>
                    </motion.h2>

                    <motion.p className="ada-description" variants={textItemVariants}>
                        Descubre los eventos y actividades que dan vida a nuestra comunidad.
                        Cada encuentro es una oportunidad de crecer juntos.
                    </motion.p>

                    {/* Info del slide activo */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slide?._id || slide?.id || current}
                            className="ada-slide-info"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {slide?.tag && (
                                <div className="ada-slide-tag">{slide.tag}</div>
                            )}
                            {slide?.title && (
                                <h3 className="ada-slide-title">{slide.title}</h3>
                            )}
                            {slide?.subtitle && (
                                <p className="ada-slide-subtitle">{slide.subtitle}</p>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* ── PANEL CARRUSEL ── */}
                <div>
                    <div className="ada-screen-wrapper">
                        {/* Área deslizable */}
                        <div
                            className="ada-screen"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            onMouseDown={onDragStart}
                            onMouseUp={onDragEnd}
                            onTouchStart={onDragStart}
                            onTouchEnd={onDragEnd}
                        >
                            {/*
                             * mode="wait": el slide saliente termina su animación ANTES
                             * de que el entrante comience → solo 1 slide en pantalla.
                             * El overflow:hidden del padre clipea el translate X,
                             * pero el contenido (imagen) dicta la altura → sin recorte vertical.
                             */}
                            <AnimatePresence initial={false} mode="wait">
                                <motion.div
                                    key={slide?._id || slide?.id || current}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    style={{ width: "100%" }}
                                    aria-roledescription="slide"
                                    aria-label={`Slide ${current + 1} de ${displaySlides.length}: ${(slide?.title || "").replace("\n", " ")}`}
                                >
                                    {/*
                                     * La imagen está en flow normal (no absolute).
                                     * El contenedor se estira para contenerla completamente.
                                     */}
                                    <img
                                        src={slide?.src}
                                        alt={slide?.alt || ""}
                                        className="ada-img"
                                        draggable={false}
                                        loading={current === 0 ? "eager" : "lazy"}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Dots */}
                        {displaySlides.length > 1 && (
                            <div className="ada-dots" role="tablist" aria-label="Navegación de slides">
                                {displaySlides.map((s, i) => (
                                    <button
                                        key={s._id || s.id || i}
                                        role="tab"
                                        aria-selected={i === current}
                                        aria-label={`Ir al slide ${i + 1}`}
                                        className={`ada-dot ${i === current ? "active" : ""}`}
                                        style={{ width: i === current ? 22 : 8 }}
                                        onClick={() => goTo(i)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </motion.section>
    );
}
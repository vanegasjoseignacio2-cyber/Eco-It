/**
 * EcoCarousel.jsx  — v3 "Floating Card"
 * ─────────────────────────────────────────────────────────────────────────────
 * Misma lógica que v2 (localStorage/API + FALLBACK_SLIDES, auto-play, drag,
 * teclado, progress bar, aspect-ratio adaptativo).
 * Rediseño visual: tarjeta flotante centrada con estética futurista coherente
 * con el resto de la app (lime/green/emerald, blur, bordes glowing).
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";
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
const AUTO_PLAY_INTERVAL = 5000;
const DRAG_THRESHOLD     = 60;

// ─── VARIANTES FRAMER MOTION ──────────────────────────────────────────────────
const slideVariants = {
    enter:  (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0, scale: 1.04 }),
    center: { x: 0, opacity: 1, scale: 1,
        transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0, scale: 0.97,
        transition: { duration: 0.55, ease: [0.55, 0, 1, 0.45] } }),
};

const textContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
};
const textItemVariants = {
    hidden:  { y: 28, opacity: 0, filter: "blur(8px)" },
    visible: { y: 0,  opacity: 1, filter: "blur(0px)",
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const sectionVariants = {
    hidden:  { opacity: 0, y: 60, scale: 0.97 },
    visible: { opacity: 1, y: 0,  scale: 1,
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function EcoCarousel() {
    const slides = useDynamicSlides();

    const [[current, direction], setCurrent] = useState([0, 1]);
    const [isPaused,   setIsPaused]   = useState(false);
    const [progress,   setProgress]   = useState(0);
    const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });
    const [aspectHeight, setAspectHeight] = useState("520px");

    const wrapperRef = useRef(null);
    const isInView   = useInView(wrapperRef, { once: false, margin: "-10%" });
    const dragStart  = useRef(null);

    useEffect(() => {
        setCurrent(([c]) => [Math.min(c, Math.max(slides.length - 1, 0)), 1]);
        setProgress(0);
    }, [slides.length]);

    const goTo = useCallback((index) => {
        const len = slides.length || 1;
        setCurrent([(index + len) % len, index > current ? 1 : -1]);
        setProgress(0);
    }, [current, slides.length]);

    const next = useCallback(() => goTo(current + 1), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1), [current, goTo]);

    // Auto-play
    useEffect(() => {
        if (isPaused || !isInView || slides.length <= 1) return;
        const startTime = Date.now();
        const id = setInterval(() => {
            const elapsed = Date.now() - startTime;
            setProgress(Math.min((elapsed / AUTO_PLAY_INTERVAL) * 100, 100));
            if (elapsed >= AUTO_PLAY_INTERVAL) next();
        }, 50);
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

    // Altura adaptativa según aspect ratio de la imagen
    useEffect(() => {
        if (imgNatural.w > 0 && imgNatural.h > 0) {
            const cardW   = Math.min(window.innerWidth * 0.88, 1100);
            const calcH   = cardW * (imgNatural.h / imgNatural.w);
            const clampH  = Math.min(Math.max(calcH, 380), 620);
            setAspectHeight(`${clampH}px`);
        }
    }, [imgNatural]);

    const slide         = slides.length > 0 ? (slides[current] || slides[0]) : FALLBACK_SLIDES[0];
    const displaySlides = slides.length > 0 ? slides : FALLBACK_SLIDES;

    return (
        /* ── SECCIÓN CONTENEDORA (fondo suave del sitio) ── */
        <motion.section
            ref={wrapperRef}
            className="eco-outer"
            variants={sectionVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            aria-label="Carrusel de proyectos Eco-It"
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap');

        /* ── Sección exterior ──────────────────────────────────────────── */
        .eco-outer {
          width: 100%;
          padding: 5rem 1.25rem;
          background: linear-gradient(to bottom, #f0fdf4, #ecfdf5, #f0fdf4);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          font-family: 'Syne', sans-serif;
        }

        /* ── Encabezado de sección ─────────────────────────────────────── */
        .eco-heading {
          text-align: center;
          max-width: 600px;
        }
        .eco-heading-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          border-radius: 9999px;
          background: rgba(101,163,13,0.1);
          color: #4d7c0f;
          font-size: 0.78rem;
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .eco-heading h2 {
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 800;
          color: #14532d;
          line-height: 1.15;
          margin: 0;
        }
        .eco-heading h2 span {
          background: linear-gradient(135deg, #65a30d, #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Tarjeta del carrusel ──────────────────────────────────────── */
        .eco-card {
          position: relative;
          width: min(100%, 1100px);
          border-radius: 20px;
          overflow: hidden;
          cursor: grab;
          box-shadow:
            0 0 0 1px rgba(101,163,13,0.2),
            0 4px 30px rgba(5,150,105,0.12),
            0 20px 60px rgba(0,0,0,0.12);
          background: #0a0f0d;
        }
        .eco-card:active { cursor: grabbing; }

        /* ── Efectos de fondo ──────────────────────────────────────────── */
        .eco-grid {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background-image:
            linear-gradient(rgba(29,255,143,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(29,255,143,0.035) 1px, transparent 1px);
          background-size: 55px 55px;
        }
        .eco-noise {
          position: absolute; inset: 0; z-index: 2; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px; pointer-events: none;
        }
        .eco-glow {
          position: absolute; top: -30%; left: -10%; width: 55%; height: 90%;
          background: radial-gradient(ellipse, rgba(29,255,143,0.10) 0%, transparent 70%);
          z-index: 2; pointer-events: none; filter: blur(50px);
        }
        /* Glow decorativo en esquina derecha */
        .eco-glow-right {
          position: absolute; bottom: -20%; right: -5%; width: 40%; height: 60%;
          background: radial-gradient(ellipse, rgba(0,201,167,0.08) 0%, transparent 70%);
          z-index: 2; pointer-events: none; filter: blur(40px);
        }
        /* Borde luminoso superior */
        .eco-top-line {
          position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 20;
          background: linear-gradient(90deg, transparent 0%, #1dff8f 40%, #00c9a7 60%, transparent 100%);
          opacity: 0.6;
        }

        /* ── Imagen ────────────────────────────────────────────────────── */
        .eco-img-wrapper {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .eco-img-contain {
          max-width: 100%; max-height: 100%;
          width: auto; height: auto;
          object-fit: contain; pointer-events: none;
          will-change: transform, opacity;
        }

        /* ── Overlay degradado ─────────────────────────────────────────── */
        .eco-overlay {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(
            120deg,
            rgba(10,15,13,0.90) 0%,
            rgba(13,31,24,0.55) 50%,
            rgba(10,15,13,0.70) 100%
          );
        }

        /* ── Contenido textual ─────────────────────────────────────────── */
        .eco-content {
          position: absolute; inset: 0; z-index: 10;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: clamp(1.75rem, 5vw, 3.5rem);
          max-width: 640px;
        }
        .eco-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: #1dff8f;
          border: 1px solid rgba(29,255,143,0.3);
          padding: 5px 14px; border-radius: 4px;
          backdrop-filter: blur(6px);
          background: rgba(29,255,143,0.06);
          width: fit-content; margin-bottom: 1.1rem;
        }
        .eco-title {
          font-size: clamp(1.8rem, 5vw, 4rem);
          font-weight: 800; line-height: 1.05;
          color: #e8fff4; margin-bottom: 1rem;
          white-space: pre-line;
          background: linear-gradient(135deg, #e8fff4 60%, #00c9a7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .eco-subtitle {
          font-family: 'Space Mono', monospace;
          font-size: clamp(0.72rem, 1.2vw, 0.88rem);
          color: rgba(232,255,244,0.6);
          max-width: 36ch; line-height: 1.75;
        }

        /* ── Barra de progreso ─────────────────────────────────────────── */
        .eco-progress-track {
          position: absolute; bottom: 0; left: 0; width: 100%; height: 3px;
          background: rgba(29,255,143,0.1); z-index: 20;
        }
        .eco-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #1dff8f, #00c9a7);
          box-shadow: 0 0 10px rgba(29,255,143,0.5);
          transition: width 50ms linear;
        }

        /* ── Controles ─────────────────────────────────────────────────── */
        .eco-controls {
          position: absolute;
          bottom: clamp(1.25rem, 3vw, 2rem);
          right: clamp(1.25rem, 3vw, 2.5rem);
          z-index: 20; display: flex; align-items: center; gap: 0.6rem;
        }
        .eco-btn {
          width: 44px; height: 44px; border-radius: 10px;
          border: 1px solid rgba(29,255,143,0.2);
          background: rgba(13,31,24,0.7); backdrop-filter: blur(12px);
          color: #1dff8f;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
        }
        .eco-btn:hover {
          background: rgba(29,255,143,0.1);
          border-color: rgba(29,255,143,0.6);
          box-shadow: 0 0 18px rgba(29,255,143,0.2);
        }
        .eco-btn:focus-visible { outline: 2px solid #1dff8f; outline-offset: 3px; }

        /* ── Dots ──────────────────────────────────────────────────────── */
        .eco-dots {
          position: absolute;
          bottom: clamp(1.25rem, 3vw, 2rem);
          left: clamp(1.25rem, 3vw, 2.5rem);
          z-index: 20; display: flex; gap: 8px; align-items: center;
        }
        .eco-dot {
          height: 3px; border-radius: 2px;
          background: rgba(29,255,143,0.25); cursor: pointer;
          transition: width 0.35s ease, background 0.35s ease, box-shadow 0.35s ease;
        }
        .eco-dot.active {
          background: #1dff8f;
          box-shadow: 0 0 8px rgba(29,255,143,0.6);
        }

        /* ── Contador ──────────────────────────────────────────────────── */
        .eco-counter {
          position: absolute;
          top: clamp(1.25rem, 3vw, 2rem);
          right: clamp(1.25rem, 3vw, 2.5rem);
          z-index: 20;
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.15em;
          color: rgba(232,255,244,0.35);
        }
        .eco-counter strong { color: #1dff8f; font-size: 0.9rem; }

        /* ── Indicador de slide activo (esquina superior izquierda) ────── */
        .eco-badge-corner {
          position: absolute;
          top: clamp(1.25rem, 3vw, 2rem);
          left: clamp(1.25rem, 3vw, 2.5rem);
          z-index: 20;
          display: flex; align-items: center; gap: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(232,255,244,0.4);
        }
        .eco-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #1dff8f;
          box-shadow: 0 0 8px #1dff8f;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        /* ── Hint de swipe en mobile ───────────────────────────────────── */
        .eco-swipe-hint {
          display: none;
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          color: rgba(101,163,13,0.6);
          letter-spacing: 0.1em;
          margin-top: 0.5rem;
        }

        /* ── Responsividad ─────────────────────────────────────────────── */
        @media (max-width: 640px) {
          .eco-outer { padding: 3rem 1rem; }
          .eco-content { padding: 1.25rem 1.25rem 4rem; }
          .eco-swipe-hint { display: block; }
        }
      `}</style>

            {/* ── ENCABEZADO ── */}
            <motion.div
                className="eco-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.7, delay: 0.1 }}
            >
                <div className="eco-heading-badge">
                    <Leaf size={11} />
                    Destacados
                </div>
                <h2>Lo mejor de <span>Eco-It</span></h2>
            </motion.div>

            {/* ── TARJETA ── */}
            <div
                className="eco-card"
                style={{ height: aspectHeight, minHeight: "380px" }}
            >
                {/* Efectos de fondo */}
                <div className="eco-top-line"  aria-hidden="true" />
                <div className="eco-grid"      aria-hidden="true" />
                <div className="eco-noise"     aria-hidden="true" />
                <div className="eco-glow"      aria-hidden="true" />
                <div className="eco-glow-right" aria-hidden="true" />

                {/* Slides */}
                <AnimatePresence initial={true} mode="wait">
                    <motion.div
                        key={slide._id || slide.id || current}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        style={{ position: "absolute", inset: 0, zIndex: 5 }}
                        onMouseDown={onDragStart}
                        onMouseUp={onDragEnd}
                        onTouchStart={onDragStart}
                        onTouchEnd={onDragEnd}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        aria-roledescription="slide"
                        aria-label={`Slide ${current + 1} de ${displaySlides.length}: ${(slide.title || "").replace("\n", " ")}`}
                    >
                        <div className="eco-img-wrapper">
                            <img
                                src={slide.src}
                                alt={slide.alt || ""}
                                className="eco-img-contain"
                                draggable={false}
                                loading={current === 0 ? "eager" : "lazy"}
                                onLoad={(e) => setImgNatural({
                                    w: e.currentTarget.naturalWidth,
                                    h: e.currentTarget.naturalHeight,
                                })}
                            />
                        </div>

                        <div className="eco-overlay" aria-hidden="true" />

                        <motion.div
                            className="eco-content"
                            variants={textContainerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {slide.tag && (
                                <motion.div className="eco-tag" variants={textItemVariants}>
                                    <Leaf size={10} />
                                    {slide.tag}
                                </motion.div>
                            )}
                            {slide.title && (
                                <motion.h2 className="eco-title" variants={textItemVariants}>
                                    {slide.title}
                                </motion.h2>
                            )}
                            {slide.subtitle && (
                                <motion.p className="eco-subtitle" variants={textItemVariants}>
                                    {slide.subtitle}
                                </motion.p>
                            )}
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Badge en vivo (esquina sup. izq.) */}
                <div className="eco-badge-corner" aria-hidden="true">
                    <span className="eco-badge-dot" />
                    En vivo
                </div>

                {/* Contador */}
                <div className="eco-counter" aria-live="polite">
                    <strong>{String(current + 1).padStart(2, "0")}</strong>
                    {" / "}
                    {String(displaySlides.length).padStart(2, "0")}
                </div>

                {/* Dots */}
                {displaySlides.length > 1 && (
                    <div className="eco-dots" role="tablist" aria-label="Slides">
                        {displaySlides.map((s, i) => (
                            <button
                                key={s._id || s.id || i}
                                role="tab"
                                aria-selected={i === current}
                                aria-label={`Ir al slide ${i + 1}`}
                                className={`eco-dot ${i === current ? "active" : ""}`}
                                style={{ width: i === current ? 28 : 14 }}
                                onClick={() => goTo(i)}
                            />
                        ))}
                    </div>
                )}

                {/* Prev / Next */}
                {displaySlides.length > 1 && (
                    <div className="eco-controls">
                        <motion.button
                            className="eco-btn"
                            onClick={prev}
                            whileTap={{ scale: 0.88 }}
                            aria-label="Slide anterior"
                        >
                            <ChevronLeft size={18} />
                        </motion.button>
                        <motion.button
                            className="eco-btn"
                            onClick={next}
                            whileTap={{ scale: 0.88 }}
                            aria-label="Siguiente slide"
                        >
                            <ChevronRight size={18} />
                        </motion.button>
                    </div>
                )}

                {/* Barra de progreso */}
                <div className="eco-progress-track" aria-hidden="true">
                    <div className="eco-progress-bar" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* Hint swipe en mobile */}
            <p className="eco-swipe-hint" aria-hidden="true">← desliza para navegar →</p>
        </motion.section>
    );
}
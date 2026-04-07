/**
 * EcoCarousel.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Carrusel de viewport completo con estética futurista para Eco-It.
 *
 * PALETA ECO-IT (ajusta si tienes los valores exactos de tu brand):
 *   --eco-dark      : #0A0F0D   → fondo principal oscuro casi negro
 *   --eco-green     : #1DFF8F   → verde neón primario
 *   --eco-teal      : #00C9A7   → teal de acento
 *   --eco-mid       : #0D1F18   → fondo de panel / overlay
 *   --eco-surface   : #12261E   → superficie de tarjeta
 *   --eco-muted     : #3A5C4A   → texto / borde secundario
 *
 * DEPENDENCIAS:
 *   npm install framer-motion lucide-react
 *
 * IMÁGENES CON CLOUDINARY:
 *   Reemplaza cada `src` en el array SLIDES con tu URL de Cloudinary.
 *   Ejemplo:
 *     `https://res.cloudinary.com/<TU_CLOUD>/image/upload/v.../nombre.jpg`
 *   Puedes aplicar transformaciones directamente en la URL:
 *     .../c_fill,w_1920,h_1080,q_auto,f_auto/nombre.jpg
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client"; // Next.js App Router — elimina esta línea si usas Vite / CRA

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";

// ─── CONFIGURACIÓN DE SLIDES ─────────────────────────────────────────────────
// Reemplaza `src` con tus URLs de Cloudinary.
// `tag` es el chip de categoría; `title` y `subtitle` son textos del slide.
const SLIDES = [
    {
        id: 1,
        // Cloudinary: https://res.cloudinary.com/<CLOUD>/image/upload/c_fill,w_1920,h_1080,q_auto,f_auto/<PUBLIC_ID>
        src: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1920&q=80",
        alt: "Energía solar en la naturaleza",
        tag: "Energía Limpia",
        title: "Soluciones\nSostenibles",
        subtitle: "Tecnología verde al servicio del planeta.",
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
        alt: "Bosque digital",
        tag: "Ecosistema",
        title: "Innovación\nNatural",
        subtitle: "Fusionamos datos con biodiversidad.",
    },
    {
        id: 3,
        src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=80",
        alt: "Ciudad sostenible",
        tag: "Smart Cities",
        title: "Ciudades\nInteligentes",
        subtitle: "Infraestructura conectada y eco-responsable.",
    },
    {
        id: 4,
        src: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1920&q=80",
        alt: "Agua limpia",
        tag: "Agua",
        title: "Recursos\nVitales",
        subtitle: "Gestión inteligente del agua para el futuro.",
    },
    {
        id: 5,
        src: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=1920&q=80",
        alt: "Reciclaje tecnológico",
        tag: "Economía Circular",
        title: "Ciclo\nPerfecto",
        subtitle: "Cero residuos, máximo impacto positivo.",
    },
];

// ─── CONSTANTES ──────────────────────────────────────────────────────────────
const AUTO_PLAY_INTERVAL = 5000; // ms entre slides en modo automático
const DRAG_THRESHOLD = 60;       // px mínimos para contar como swipe

// ─── VARIANTES DE ANIMACIÓN (Framer Motion) ──────────────────────────────────
/**
 * slideVariants: controla la entrada/salida de cada slide.
 * `direction` viene del estado del carrusel: 1 → derecha, -1 → izquierda.
 */
const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 1.04,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: (direction) => ({
        x: direction > 0 ? "-100%" : "100%",
        opacity: 0,
        scale: 0.97,
        transition: { duration: 0.55, ease: [0.55, 0, 1, 0.45] },
    }),
};

/** Animación escalonada del texto en cada slide */
const textContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};
const textItemVariants = {
    hidden: { y: 32, opacity: 0, filter: "blur(8px)" },
    visible: {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
};

/** Entrada del contenedor completo cuando entra al viewport */
const viewportVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function EcoCarousel() {
    const [[current, direction], setCurrent] = useState([0, 1]);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    /* Ref para la detección de viewport */
    const wrapperRef = useRef(null);
    const isInView = useInView(wrapperRef, { once: false, margin: "-10%" });

    /* Ref para el drag (swipe táctil / mouse) */
    const dragStart = useRef(null);

    // ── Navegar a un slide específico ──────────────────────────────────────────
    const goTo = useCallback(
        (index) => {
            const newDir = index > current ? 1 : -1;
            setCurrent([(index + SLIDES.length) % SLIDES.length, newDir]);
            setProgress(0);
        },
        [current]
    );

    const next = useCallback(() => goTo(current + 1), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1), [current, goTo]);

    // ── Auto-play con barra de progreso ───────────────────────────────────────
    useEffect(() => {
        if (isPaused || !isInView) return;

        const startTime = Date.now();
        const tick = () => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min((elapsed / AUTO_PLAY_INTERVAL) * 100, 100);
            setProgress(pct);
            if (elapsed >= AUTO_PLAY_INTERVAL) next();
        };

        const id = setInterval(tick, 50);
        return () => clearInterval(id);
    }, [isPaused, isInView, next, current]);

    // ── Soporte de teclado ────────────────────────────────────────────────────
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [next, prev]);

    // ── Handlers de drag / swipe ──────────────────────────────────────────────
    const onDragStart = (e) => {
        dragStart.current = e.type === "touchstart"
            ? e.touches[0].clientX
            : e.clientX;
    };
    const onDragEnd = (e) => {
        if (dragStart.current === null) return;
        const end = e.type === "touchend"
            ? e.changedTouches[0].clientX
            : e.clientX;
        const delta = dragStart.current - end;
        if (Math.abs(delta) > DRAG_THRESHOLD) delta > 0 ? next() : prev();
        dragStart.current = null;
    };

    const slide = SLIDES[current];

    // ─── RENDER ────────────────────────────────────────────────────────────────
    return (
        /**
         * Contenedor externo: ocupa un viewport completo (100svh).
         * Se anima al entrar/salir del viewport gracias a useInView + variants.
         */
        <motion.section
            ref={wrapperRef}
            className="eco-section"
            variants={viewportVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            aria-label="Carrusel de proyectos Eco-It"
        >
            {/* ── ESTILOS GLOBALES (inline para un único archivo) ─────────────── */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap');

        :root {
          --eco-dark    : #0A0F0D;
          --eco-green   : #1DFF8F;
          --eco-teal    : #00C9A7;
          --eco-mid     : #0D1F18;
          --eco-surface : #12261E;
          --eco-muted   : #3A5C4A;
          --eco-white   : #E8FFF4;
        }

        /* Sección que ocupa exactamente un viewport */
        .eco-section {
          position: relative;
          width: 100%;
          height: 100svh;        /* 100svh evita el salto de barra móvil */
          overflow: hidden;
          background: var(--eco-dark);
          font-family: 'Syne', sans-serif;
          cursor: grab;
        }
        .eco-section:active { cursor: grabbing; }

        /* ── Imagen de fondo de cada slide ─────────────────────────────── */
        .eco-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          will-change: transform, opacity;
        }

        /* ── Overlay con gradiente eco-tech ────────────────────────────── */
        .eco-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              135deg,
              rgba(10,15,13,0.88) 0%,
              rgba(13,31,24,0.65) 50%,
              rgba(10,15,13,0.80) 100%
            );
          z-index: 1;
        }

        /* ── Ruido sutil para textura "pantalla" ───────────────────────── */
        .eco-noise {
          position: absolute;
          inset: 0;
          z-index: 2;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
          pointer-events: none;
        }

        /* ── Líneas de cuadrícula "HUD" ────────────────────────────────── */
        .eco-grid {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(29,255,143,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(29,255,143,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* ── Brillo neón en esquina superior-izquierda ──────────────────── */
        .eco-glow {
          position: absolute;
          top: -20%;
          left: -10%;
          width: 55%;
          height: 70%;
          background: radial-gradient(ellipse, rgba(29,255,143,0.12) 0%, transparent 70%);
          z-index: 2;
          pointer-events: none;
          filter: blur(40px);
        }

        /* ── Contenido textual ─────────────────────────────────────────── */
        .eco-content {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(2rem, 6vw, 6rem);
          max-width: 700px;
        }

        .eco-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--eco-green);
          border: 1px solid rgba(29,255,143,0.35);
          padding: 5px 14px;
          border-radius: 2px;
          backdrop-filter: blur(4px);
          background: rgba(29,255,143,0.06);
          width: fit-content;
          margin-bottom: 1.5rem;
        }

        .eco-title {
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 800;
          line-height: 1.0;
          color: var(--eco-white);
          margin-bottom: 1.25rem;
          white-space: pre-line;
          /* Acento neón en la primera palabra */
          background: linear-gradient(135deg, #E8FFF4 60%, var(--eco-teal));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .eco-subtitle {
          font-family: 'Space Mono', monospace;
          font-size: clamp(0.85rem, 1.4vw, 1rem);
          color: rgba(232,255,244,0.65);
          max-width: 38ch;
          line-height: 1.7;
        }

        /* ── Barra de progreso auto-play ───────────────────────────────── */
        .eco-progress-track {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(29,255,143,0.12);
          z-index: 20;
        }
        .eco-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--eco-teal), var(--eco-green));
          box-shadow: 0 0 12px rgba(29,255,143,0.6);
          transition: width 50ms linear;
        }

        /* ── Controles de navegación ───────────────────────────────────── */
        .eco-controls {
          position: absolute;
          bottom: clamp(1.5rem, 4vw, 3rem);
          right: clamp(1.5rem, 5vw, 5rem);
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .eco-btn {
          width: 48px;
          height: 48px;
          border-radius: 2px;
          border: 1px solid rgba(29,255,143,0.25);
          background: rgba(13,31,24,0.75);
          backdrop-filter: blur(10px);
          color: var(--eco-green);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.25s, border-color 0.25s, box-shadow 0.25s;
        }
        .eco-btn:hover {
          background: rgba(29,255,143,0.12);
          border-color: var(--eco-green);
          box-shadow: 0 0 20px rgba(29,255,143,0.25);
        }
        .eco-btn:focus-visible {
          outline: 2px solid var(--eco-green);
          outline-offset: 3px;
        }

        /* ── Indicadores de slide (dots) ───────────────────────────────── */
        .eco-dots {
          position: absolute;
          bottom: clamp(1.5rem, 4vw, 3rem);
          left: clamp(1.5rem, 6vw, 6rem);
          z-index: 20;
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .eco-dot {
          height: 3px;
          border-radius: 1px;
          background: rgba(29,255,143,0.3);
          cursor: pointer;
          transition: width 0.35s ease, background 0.35s ease, box-shadow 0.35s ease;
        }
        .eco-dot.active {
          background: var(--eco-green);
          box-shadow: 0 0 10px rgba(29,255,143,0.7);
        }

        /* ── Número de slide (esquina superior derecha) ─────────────────── */
        .eco-counter {
          position: absolute;
          top: clamp(1.5rem, 4vw, 3rem);
          right: clamp(1.5rem, 5vw, 5rem);
          z-index: 20;
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          color: rgba(232,255,244,0.4);
        }
        .eco-counter strong {
          color: var(--eco-green);
          font-size: 1rem;
        }

        /* ── Logo / wordmark (esquina superior izquierda) ───────────────── */
        .eco-logo {
          position: absolute;
          top: clamp(1.5rem, 4vw, 3rem);
          left: clamp(1.5rem, 6vw, 6rem);
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: 0.05em;
          color: var(--eco-white);
        }
        .eco-logo span { color: var(--eco-green); }

        /* ── Línea decorativa lateral derecha ──────────────────────────── */
        .eco-sidebar-line {
          position: absolute;
          right: 0;
          top: 0;
          width: 3px;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent,
            var(--eco-teal) 40%,
            var(--eco-green) 60%,
            transparent
          );
          opacity: 0.3;
          z-index: 15;
        }
      `}</style>

            {/* ── LOGO ──────────────────────────────────────────────────────────── */}
            <div className="eco-logo" aria-label="Eco-It">
                <Leaf size={18} color="var(--eco-green)" />
                Eco-<span>It</span>
            </div>

            {/* ── CONTADOR ──────────────────────────────────────────────────────── */}
            <div className="eco-counter" aria-live="polite">
                <strong>{String(current + 1).padStart(2, "0")}</strong>
                {" / "}
                {String(SLIDES.length).padStart(2, "0")}
            </div>

            {/* ── EFECTOS DE FONDO ──────────────────────────────────────────────── */}
            <div className="eco-grid" aria-hidden="true" />
            <div className="eco-noise" aria-hidden="true" />
            <div className="eco-glow" aria-hidden="true" />
            <div className="eco-sidebar-line" aria-hidden="true" />

            {/* ── SLIDES ────────────────────────────────────────────────────────── */}
            {/*
       * AnimatePresence: mantiene el slide saliente en el DOM durante la
       * transición. `custom` pasa la dirección a las variantes.
       */}
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={current}                  /* key cambia → Framer anima enter/exit */
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={{ position: "absolute", inset: 0, zIndex: 5 }}
                    /* Soporte de swipe táctil y mouse */
                    onMouseDown={onDragStart}
                    onMouseUp={onDragEnd}
                    onTouchStart={onDragStart}
                    onTouchEnd={onDragEnd}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    aria-roledescription="slide"
                    aria-label={`Slide ${current + 1} de ${SLIDES.length}: ${slide.title.replace("\n", " ")}`}
                >
                    {/*
           * IMAGEN CON CLOUDINARY
           * ────────────────────────────────────────────────────────────────
           * Reemplaza `slide.src` con la URL de Cloudinary de este slide.
           * Para lazy-load y optimización automática en Next.js usa <Image>:
           *
           *   import Image from "next/image";
           *   <Image src={slide.src} alt={slide.alt} fill priority className="eco-img" />
           *
           * Con Cloudinary Loader (next.config.js):
           *   const url = `https://res.cloudinary.com/<CLOUD>/image/upload/
           *     c_fill,w_1920,h_1080,q_auto,f_auto/${slide.cloudinaryId}`;
           */}
                    <img
                        src={slide.src}
                        alt={slide.alt}
                        className="eco-img"
                        draggable={false}
                        /* Carga anticipada del primer slide; el resto es lazy */
                        loading={current === 0 ? "eager" : "lazy"}
                    />

                    {/* Overlay de color */}
                    <div className="eco-overlay" aria-hidden="true" />

                    {/* Texto del slide con animación escalonada */}
                    <motion.div
                        className="eco-content"
                        variants={textContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Chip de categoría */}
                        <motion.div className="eco-tag" variants={textItemVariants}>
                            <Leaf size={10} />
                            {slide.tag}
                        </motion.div>

                        {/* Título principal */}
                        <motion.h2 className="eco-title" variants={textItemVariants}>
                            {slide.title}
                        </motion.h2>

                        {/* Subtítulo */}
                        <motion.p className="eco-subtitle" variants={textItemVariants}>
                            {slide.subtitle}
                        </motion.p>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* ── INDICADORES (dots) ────────────────────────────────────────────── */}
            <div className="eco-dots" role="tablist" aria-label="Slides">
                {SLIDES.map((s, i) => (
                    <button
                        key={s.id}
                        role="tab"
                        aria-selected={i === current}
                        aria-label={`Ir al slide ${i + 1}`}
                        className={`eco-dot ${i === current ? "active" : ""}`}
                        style={{ width: i === current ? 32 : 16 }}
                        onClick={() => goTo(i)}
                    />
                ))}
            </div>

            {/* ── BOTONES PREV / NEXT ───────────────────────────────────────────── */}
            <div className="eco-controls">
                <motion.button
                    className="eco-btn"
                    onClick={prev}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Slide anterior"
                >
                    <ChevronLeft size={20} />
                </motion.button>

                <motion.button
                    className="eco-btn"
                    onClick={next}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Siguiente slide"
                >
                    <ChevronRight size={20} />
                </motion.button>
            </div>

            {/* ── BARRA DE PROGRESO ─────────────────────────────────────────────── */}
            <div className="eco-progress-track" aria-hidden="true">
                <div
                    className="eco-progress-bar"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </motion.section>
    );
}
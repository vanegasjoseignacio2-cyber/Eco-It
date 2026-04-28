/**
 * Carrusel.jsx — Imagen completa, sin recortes, responsive
 * ─────────────────────────────────────────────────────────────
 * La imagen define la altura del contenedor (width:100% height:auto).
 * No hay height fijo ni position:absolute en la imagen.
 * mode="wait" garantiza que nunca hay dos slides visibles al mismo tiempo,
 * por lo que NO necesitamos overflow:hidden para la transición.
 * Navegación: dots + swipe/drag + teclado + autoplay.
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion as Motion, AnimatePresence, useInView } from "framer-motion";
import { obtenerSlidesPublicos } from "../../services/api";

// ─── SLIDES DE RESPALDO ───────────────────────────────────────────────────────
const FALLBACK_SLIDES = [
    {
        id: "fallback_1",
        src: "https://hjdoblekhuila.com/media/multimedia/DANTA_DE_MONTA%C3%91A.jpeg",
        alt: "Nuestra fauna",
        tag: "Nuestra fauna",
        title: "Danta de\nmontaña",
        subtitle: "Es considerado el jardinero de los bosques y páramos debido a su papel crucial en la dispersión de semillas",
        active: true,
    },
    {
        id: "fallback_2",
        src: "https://elcampesino.co/wp-content/uploads/2018/12/oso_de_anteojos_foto_Giovanny_Pulido_33-2.jpg",
        alt: "Bosque digital",
        tag: "Nuestra fauna",
        title: "Oso de \nanteojos",
        subtitle: "Sus manchas son únicas, como huellas dactilares; no existen dos osos de anteojos iguales.",
        active: true,
    },
    {
        id: "fallback_3",
        src: "https://www.agenciadeviajesyimmytours.com/wp-content/uploads/2023/01/paramo-de-miraflores_2.jpg",
        alt: "paramo ",
        tag: "Nuestro páramo",
        title: "Cerro paramo de\n miraflores",
        subtitle: "Este páramo es el hogar del oso de anteojos, una especie majestuosa que sobrevive en las cumbres, pero que hoy lucha contra la pérdida de su hábitat natural.",
        active: true,
    },
    {
        id: "fallback_4",
        src: "https://www.elnuevosiglo.com.co/sites/default/files/2020-05/09asfoto%20ambiente%20mayo%2030.jpg",
        alt: "paramo ",
        tag: "Nuestro páramo",
        title: "Frailejones",
        subtitle: "Cada gota de agua que sale de tu grifo en gran parte del Huila comenzó su viaje siendo atrapada por los pelitos de esas hojas. Ver una imagen de un frailejón es, literalmente, ver la fuente de tu propia vida.",
        active: true,
    },
     {
        id: "fallback_5",
        src: "https://tsmnoticias.com/wp-content/uploads/2020/01/En-peligro-el-parque-regional-Cerro-P%C3%A1ramo-de-Miraflores-7.jpeg",
        alt: "nuetra fauna ",
        tag: "Nuestra fauna",
        title: "Gallito de las rocas",
        subtitle: "El gallito de las rocas del Huila cambia drásticamente el ecosistema: dispersa semillas clave que permiten regenerar bosques enteros tras disturbios.",
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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { load(); }, [load]);

    return slides;
}

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const AUTO_PLAY_INTERVAL = 5500;
const DRAG_THRESHOLD     = 60;

// Helper para asegurar que las imágenes de Cloudinary no se recorten (sin recortes)
function sanitizeCloudinaryUrl(url) {
    if (!url || !url.includes("res.cloudinary.com")) return url;
    // Si la URL ya tiene transformaciones de recorte (c_fill), las cambiamos por c_limit
    // c_limit mantiene la proporción original y el tamaño completo sin recortes.
    if (url.includes("/upload/")) {
        return url.replace(/\/upload\/[^/]+\//, "/upload/c_limit,w_1920,q_auto,f_auto/");
    }
    return url;
}


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
export default function Carrusel() {
    const slides = useDynamicSlides();

    const [[current, _direction], setCurrent] = useState([0, 1]);
    const [isPaused, setIsPaused] = useState(false);

    const wrapperRef = useRef(null);
    const isInView   = useInView(wrapperRef, { once: false, margin: "-10%" });
    const dragStart  = useRef(null);

    const isFallback = slides === FALLBACK_SLIDES || slides.length === 0;
    const displaySlides = slides.length > 0 ? slides : FALLBACK_SLIDES;
    const slide         = displaySlides[current] || displaySlides[0];

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
        <Motion.section
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
  background: linear-gradient(135deg, #f0fdf4, #ecfdf5, #f0fdfa);
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
  background: linear-gradient(90deg, #16a34a, #059669);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
            0 2px 0px rgba(0,0,0,0.05),
            0 20px 48px rgba(0,0,0,0.1),
            0 8px 16px rgba(0,0,0,0.06);
          background: #ffffff; /* Fondo blanco para que combine mejor con flyers */
          overflow: hidden;
          max-height: 85vh; /* Un poco más de aire vertical */
          width: fit-content;
          max-width: 100%;
          margin: 0 auto;
        }
                    .ada-carousel-col {
            width: 100%;
            min-width: 0; /* previene overflow en grid */
            }

        /* El radio se aplica directamente a la imagen y a los dots */
        .ada-screen-wrapper .ada-screen {
          border-radius: 20px 20px 0 0;
        }

        .ada-screen-wrapper .ada-img {
          border-radius: 20px 20px 0 0;
        }

        /* Cuando no hay dots, radio completo en las 4 esquinas */
        .ada-screen-wrapper .ada-screen--no-dots,
        .ada-screen-wrapper .ada-screen--no-dots .ada-img {
          border-radius: 20px;
        }

        .ada-screen-wrapper .ada-dots {
          border-radius: 0 0 20px 20px;
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
          max-height: 80vh;
          object-fit: contain; 
          pointer-events: none;
          user-select: none;
        }

        /* Fade-in al cambiar de slide: animación CSS pura, sin motion.div */
        @keyframes adaFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .ada-img--fade {
          animation: adaFadeIn 0.45s ease-out both;
        }

        /* ── Dots ──────────────────────────────────────────────────────── */
.ada-dots {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 12px 0 14px;

  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  border-top: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
}
  .ada-dots::before {
  content: "";
  position: absolute;
  inset: 0;
  border-top: 1px solid rgba(255,255,255,0.6);
  pointer-events: none;
}

.ada-dot {
  height: 4px;
  width: 10px;
  border-radius: 3px;
  background: rgba(15, 23, 42, 0.25); /* slate oscuro suave */
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
  padding: 0;
}

.ada-dot:hover {
  background: rgba(5, 150, 105, 0.6); /* emerald-600 */
}

.ada-dot.active {
  background: linear-gradient(90deg, #16a34a, #059669, #0d9488);
  width: 20px;
  box-shadow: 0 0 8px rgba(5, 150, 105, 0.35);
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
          .ada-screen-wrapper .ada-screen,
          .ada-screen-wrapper .ada-img {
            border-radius: 14px 14px 0 0;
          }
          .ada-screen-wrapper .ada-screen--no-dots,
          .ada-screen-wrapper .ada-screen--no-dots .ada-img {
            border-radius: 14px;
          }
          .ada-screen-wrapper .ada-dots {
            border-radius: 0 0 14px 14px;
          }
        }

        @media (max-width: 480px) {
          .ada-outer { padding: 1.5rem 0.75rem 2.5rem; }
        }
      `}</style>

            <div className="ada-inner">

                {/* ── PANEL DE TEXTO ── */}
                <Motion.div
                    className="ada-text-panel"
                    variants={textContainerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    <Motion.span className="ada-eyebrow" variants={textItemVariants}>
                        <span className="ada-eyebrow-line" />
                    </Motion.span>

                    <Motion.h2 className="ada-main-title" variants={textItemVariants}>
                        {isFallback ? (
                            <>Nuestra<br />riqueza <em>natural</em></>
                        ) : (
                            <>Actividades<br />que <em>motivan</em></>
                        )}
                    </Motion.h2>

                    <Motion.p className="ada-description" variants={textItemVariants}>
                        {isFallback ? (
                            "Descubre la fauna, flora y los ecosistemas que dan vida a nuestro municipio. Un patrimonio natural que debemos conocer y proteger."
                        ) : (
                            "Descubre los eventos y actividades que dan vida a nuestra comunidad. Cada encuentro es una oportunidad de crecer juntos."
                        )}
                    </Motion.p>

                    {/* Info del slide activo */}
                    <AnimatePresence mode="wait">
                        <Motion.div
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
                        </Motion.div>
                    </AnimatePresence>
                </Motion.div>

                {/* ── PANEL CARRUSEL ── */}
                <div className="ada-carousel-col">
                    <div className="ada-screen-wrapper">
                        {/* Área deslizable */}
                        <div
                            className={`ada-screen${displaySlides.length <= 1 ? " ada-screen--no-dots" : ""}`}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            onMouseDown={onDragStart}
                            onMouseUp={onDragEnd}
                            onTouchStart={onDragStart}
                            onTouchEnd={onDragEnd}
                            aria-roledescription="region"
                            aria-label={`Slide ${current + 1} de ${displaySlides.length}: ${(slide?.title || "").replace("\n", " ")}`}
                        >
                            {/*
                             * Un solo <img> en flujo normal — NUNCA position:absolute.
                             * La src cambia al nuevo slide; la transición es CSS opacity.
                             * El contenedor siempre tiene la altura natural de la imagen.
                             * CERO recortes, CERO colapso de altura.
                             */}
                            <img
                                key={slide?._id || slide?.id || current}
                                src={sanitizeCloudinaryUrl(slide?.src)}
                                alt={slide?.alt || ""}
                                className="ada-img ada-img--fade"
                                draggable={false}
                                loading={current === 0 ? "eager" : "lazy"}
                            />
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
        </Motion.section>
    );
}

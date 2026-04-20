// LogoCarousel.jsx
const logos = [
  {
    name: "GreenCore",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke="#4a7c59" strokeWidth="1.5"/>
        <path d="M8 18c2-4 4-6 6-6s4 2 6 6" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="14" cy="10" r="2" fill="#4a7c59"/>
      </svg>
    ),
  },
  {
    name: "Solartia",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="22" height="22" rx="5" stroke="#5a7a5a" strokeWidth="1.5"/>
        <path d="M9 14h10M14 9v10" stroke="#5a7a5a" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "EcoNova",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4L4 10v8l10 6 10-6v-8L14 4z" stroke="#607d63" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="14" cy="14" r="3" fill="#607d63"/>
      </svg>
    ),
  },
  {
    name: "Renova360",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M5 20 Q14 4 23 20" stroke="#4a6741" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 20 Q14 10 20 20" stroke="#4a6741" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "SolarSync",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="5" stroke="#557a55" strokeWidth="1.5"/>
        <path d="M14 4v3M14 21v3M4 14H7M21 14h3M6.9 6.9l2.1 2.1M19 19l2.1 2.1M6.9 21.1L9 19M19 9l2.1-2.1" stroke="#557a55" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "BioTech EU",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M7 21c0-5 3-9 7-9s7 4 7 9" stroke="#4d7358" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 12V6" stroke="#4d7358" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 8l4-4 4 4" stroke="#4d7358" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "DataGreen",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="12" width="6" height="10" rx="1.5" stroke="#4a7c59" strokeWidth="1.5"/>
        <rect x="11" y="8" width="6" height="14" rx="1.5" stroke="#4a7c59" strokeWidth="1.5"/>
        <rect x="18" y="5" width="6" height="17" rx="1.5" stroke="#4a7c59" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    name: "ClimateOps",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 5a9 9 0 100 18A9 9 0 0014 5z" stroke="#527052" strokeWidth="1.5"/>
        <path d="M9 14c1-3 3-4 5-4s4 1 5 4" stroke="#527052" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "Asociación de Recicladores de Garzón",
    // Coloca la imagen en /public/logos/recicladores_garzon.png de tu proyecto
    img: "/logos/recicladores_garzon.png",
    href: "https://www.informacolombia.com/directorio-empresas/informacion-empresa/eco-ambientales-huila-esp-sas",
  },
];

// Ítem estándar: icono SVG + nombre
const LogoItem = ({ name, icon, img, href }) => {
  if (img) {
    const content = (
      <img
        src={img}
        alt={name}
        style={{ height: "64px", width: "auto", objectFit: "contain" }}
      />
    );
    return href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center mx-10 opacity-60 hover:opacity-95 transition-opacity"
      >
        {content}
      </a>
    ) : (
      <span className="inline-flex items-center mx-10 opacity-60 hover:opacity-95 transition-opacity">
        {content}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 mx-10 opacity-55 hover:opacity-90 transition-opacity">
      {icon}
      <span className="text-lg font-medium text-gray-600 tracking-tight">{name}</span>
    </span>
  );
};

export default function LogoCarousel() {
  return (
    <>
      {/* Estilos inline para la animación — sin depender de Tailwind utilities */}
      <style>{`
        @keyframes slide-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
        .carousel-track {
          display: inline-block;
          width: max-content;
          animation: slide-left 25s linear infinite;
        }
        .carousel-wrapper:hover .carousel-track {
          animation-play-state: paused;
        }
      `}</style>

      <section className="bg-[#f8f9f6] pt-10 pb-6">
        <h2 className="text-center text-2xl font-semibold mb-1 text-[#1a2e1a]">
          Empresas que confían en Eco-It
        </h2>
        <p className="text-center text-[15px] font-light text-[#5a7a5a] mb-2">
          Impulsando la transformación digital sostenible en el sector
        </p>

        <div
          className="carousel-wrapper relative overflow-hidden whitespace-nowrap py-8"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0, white 100px, white calc(100% - 100px), transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, white 100px, white calc(100% - 100px), transparent 100%)",
          }}
        >
          <div className="carousel-track">
            {logos.map((l) => (
              <LogoItem key={l.name} {...l} />
            ))}
          </div>
          <div className="carousel-track">
            {logos.map((l) => (
              <LogoItem key={l.name + "-dup"} {...l} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
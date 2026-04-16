import { MapPin, ChevronRight } from "lucide-react";

const TYPE_COLORS = {
    recycling:  { bg: "bg-green-100",   text: "text-green-700",   dot: "bg-green-500",   label: "Reciclaje" },
    ecobottle:  { bg: "bg-lime-100",    text: "text-lime-700",    dot: "bg-lime-500",    label: "Eco-Botella" },
    truck:      { bg: "bg-teal-100",    text: "text-teal-700",    dot: "bg-teal-500",    label: "Recolector" },
    container:  { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", label: "Contenedor" },
    green_zone: { bg: "bg-green-100",   text: "text-green-800",   dot: "bg-green-600",   label: "Zona Verde" },
};

export default function PlaceCard({ place, onClick }) {
    const cfg = TYPE_COLORS[place.type] || TYPE_COLORS.recycling;

    return (
        <button
            onClick={onClick}
            className="group w-full text-left bg-white/80 backdrop-blur-sm rounded-2xl p-4
                border border-white/60 hover:border-green-300/60
                shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(34,197,94,0.18)]
                transition-all duration-250 hover:-translate-y-0.5 active:translate-y-0"
        >
            <div className="flex items-start gap-3">
                {/* Icon dot */}
                <div className={`mt-0.5 w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                    <MapPin className={`w-4 h-4 ${cfg.text}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-green-900 text-sm truncate leading-snug">{place.name}</h4>
                    <p className="text-xs text-green-600/70 mt-0.5 line-clamp-2 leading-relaxed">{place.vicinity}</p>
                    {place.type && (
                        <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                        </span>
                    )}
                </div>

                {/* Arrow */}
                <ChevronRight className="w-4 h-4 text-green-300 group-hover:text-green-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
            </div>
        </button>
    );
}
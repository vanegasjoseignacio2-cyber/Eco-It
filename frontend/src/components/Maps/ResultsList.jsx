import { MapPin, Layers } from "lucide-react";
import { useRef, useEffect } from "react";
import PlaceCard from "./PlaceCard";

export default function ResultsList({ places, onSelect }) {
    const listRef = useRef(null);

    const applyBarrelEffect = () => {
        const container = listRef.current;
        if (!container) return;
        const cards = container.querySelectorAll(".barrel-card");
        const centerY = container.scrollTop + container.clientHeight / 2;
        cards.forEach((card) => {
            const dist = (card.offsetTop + card.clientHeight / 2) - centerY;
            const rx = Math.max(Math.min(dist / 28, 15), -15);
            const tz = -Math.abs(dist) / 10;
            card.style.transform = `perspective(900px) rotateX(${rx}deg) translateZ(${tz}px)`;
        });
    };

    useEffect(() => { applyBarrelEffect(); }, [places]);

    return (
        <div className="flex flex-col h-full rounded-3xl overflow-hidden
            bg-gradient-to-b from-white/70 to-green-50/80 backdrop-blur-xl
            border border-green-200/50 shadow-[0_8px_40px_rgba(34,197,94,0.12)]">

            {/* HEADER */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5
                bg-white/60 backdrop-blur-md border-b border-green-100/80">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <Layers className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-xs text-green-500 font-medium">Resultados</p>
                        <p className="text-sm font-bold text-green-900 leading-none">{places.length} ubicaciones</p>
                    </div>
                </div>
                {places.length > 0 && (
                    <span className="text-xs text-green-500 bg-green-100 px-2.5 py-1 rounded-full font-medium">
                        cerca de ti
                    </span>
                )}
            </div>

            {/* LIST */}
            <div
                ref={listRef}
                onScroll={applyBarrelEffect}
                className="flex-1 p-3 sm:p-4 space-y-2.5 overflow-y-auto scrollbar-eco"
                style={{ perspective: "900px", transformStyle: "preserve-3d", maxHeight: "360px" }}
            >
                {places.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-green-400">
                        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                            <MapPin className="w-7 h-7 text-green-400" />
                        </div>
                        <p className="text-sm font-medium text-green-600">Sin resultados aún</p>
                        <p className="text-xs text-green-400 mt-1">Busca o usa tu ubicación</p>
                    </div>
                ) : (
                    places.map((place) => (
                        <div
                            key={place.place_id}
                            className="barrel-card transition-transform duration-100 transform-gpu"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            <PlaceCard place={place} onClick={() => onSelect(place)} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
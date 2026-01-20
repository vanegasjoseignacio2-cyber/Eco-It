//resultados de las búsquedas
import { MapPin } from "lucide-react";
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
            const cardCenter =
                card.offsetTop + card.clientHeight / 2;

            const distance = cardCenter - centerY;

            // Intensidad del efecto
            const rotateX = Math.max(
                Math.min(distance / 25, 18),
                -18
            );

            const translateZ = -Math.abs(distance) / 8;

            card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        translateZ(${translateZ}px)
      `;
        });
    };

    useEffect(() => {
        applyBarrelEffect();
    }, [places]);

    return (
        <div className="relative bg-[linear-gradient(150deg,_#bbf7d0,_#d1fae5,_#ccfbf1)] rounded-3xl overflow-hidden max-h-[420px] scrollbar-eco">

            {/* HEADER */}
            <div className="sticky top-0 z-20 bg-green-100/80 backdrop-blur-md px-4 py-3 border-b border-green-200">
                <h3 className="font-semibold text-green-900">
                    {places.length} ubicaciones encontradas
                </h3>
            </div>

            {/* LISTA */}
            <div
                ref={listRef}
                onScroll={applyBarrelEffect}
                className="p-4 space-y-6 overflow-y-auto max-h-[360px]"
                style={{
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                }}
            >
                {places.length === 0 ? (
                    <div className="text-center py-10 text-green-600">
                        <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Busca lugares cerca de ti</p>
                    </div>
                ) : (
                    places.map((place) => (
                        <div
                            key={place.place_id}
                            className="barrel-card transition-transform duration-150 transform-gpu"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            <PlaceCard
                                place={place}
                                onClick={() => onSelect(place)}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

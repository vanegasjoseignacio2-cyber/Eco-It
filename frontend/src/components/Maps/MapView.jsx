//mapa 
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

//icono(aún no funcional)
const ecoMarkerIcon = L.divIcon({
    className: "eco-marker-wrapper",
    html: `
        <div class="eco-marker-pin">
            <div class="eco-marker-head">
                <span class="eco-ripple"></span>
            </div>
            <div class="eco-marker-point"></div>
        </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
});

const centerGarzon = {
    lat: 2.195,
    lng: -75.627,
};

export default function MapView({ places = [], selectedPlace, onMarkerClick }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);


    // Inicializar mapa

    useEffect(() => {
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView(
                [centerGarzon.lat, centerGarzon.lng],
                14
            );

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "© OpenStreetMap contributors",
            }).addTo(mapInstanceRef.current);
        }

        return () => {
            mapInstanceRef.current?.remove();
            mapInstanceRef.current = null;
        };
    }, []);


    // Marcadores
    
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        const validPlaces = places.filter(
            (p) =>
                typeof p.lat === "number" &&
                typeof p.lng === "number" &&
                !isNaN(p.lat) &&
                !isNaN(p.lng)
        );

        validPlaces.forEach((place) => {
            const marker = L.marker(
                [place.lat, place.lng],
                { icon: ecoMarkerIcon }
            ).addTo(mapInstanceRef.current);

            marker.bindPopup(`
                <div>
                    <h3 style="font-weight:600;margin-bottom:4px;">
                        ${place.name}
                    </h3>
                    <p style="font-size:12px;color:#666;">
                        ${place.vicinity}
                    </p>
                </div>
            `);

            marker.on("click", () => onMarkerClick?.(place));
            markersRef.current.push(marker);
        });

        if (validPlaces.length > 0) {
            const bounds = L.latLngBounds(
                validPlaces.map((p) => [p.lat, p.lng])
            );
            mapInstanceRef.current.fitBounds(bounds, {
                padding: [50, 50],
            });
        }
    }, [places, onMarkerClick]);


    // Selección

    useEffect(() => {
        if (
            selectedPlace &&
            typeof selectedPlace.lat === "number" &&
            typeof selectedPlace.lng === "number" &&
            mapInstanceRef.current
        ) {
            mapInstanceRef.current.setView(
                [selectedPlace.lat, selectedPlace.lng],
                16,
                { animate: true }
            );
        }
    }, [selectedPlace]);

    return (
        <>
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

            {/* ESTILOS DEL MARCADOR - PIN ESTILO GOOGLE MAPS */}
            <style>{`
                .eco-marker-wrapper {
                    background: none !important;
                    border: none !important;
                }

                .eco-marker-pin {
                    position: relative;
                    width: 50px;
                    height: 50px;
                }

                .eco-marker-head {
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(135deg, #22c55e, #10b981);
                    border: 3px solid white;
                    border-radius: 50% 50% 50% 0;
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%) rotate(-45deg);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
                    z-index: 1001;
                }

                .eco-marker-head::before {
                    content: '';
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    background: white;
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .eco-marker-point {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-top: 12px solid #10b981;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
                }

                .eco-ripple {
                    position: absolute;
                    inset: -8px;
                    border-radius: 50%;
                    background: rgba(16, 185, 129, 0.25);
                    animation: ripple 2s infinite ease-out;
                    z-index: 1000;
                }

                @keyframes ripple {
                    0% {
                        transform: scale(0.5) rotate(45deg);
                        opacity: 0.8;
                    }
                    100% {
                        transform: scale(1.5) rotate(45deg);
                        opacity: 0;
                    }
                }

                /* Animación de entrada */
                .eco-marker-pin {
                    animation: markerDrop 0.6s ease-out;
                }

                @keyframes markerDrop {
                    0% {
                        transform: translateY(-100px);
                        opacity: 0;
                    }
                    60% {
                        transform: translateY(5px);
                    }
                    100% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </>
    );
}
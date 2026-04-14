import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";

// ─── Tipos (igual que AdminMap) ───────────────────────────────────────────────
const POINT_TYPES = {
    recycling:  { label: "Punto de Reciclaje", color: "#22c55e" },
    ecobottle:  { label: "Eco-Botella",         color: "#84cc16" },
    truck:      { label: "Carro Recolector",    color: "#14b8a6" },
    container:  { label: "Contenedor",          color: "#10b981" },
    green_zone: { label: "Zona Verde",          color: "#4ade80" },
};

function getTypeIconSVG(type, color = "white") {
    const svgs = {
        recycling:  `<path d="M7 21v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4M3 7l9-4 9 4v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />`,
        ecobottle:  `<path d="M12 2v20M17 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />`,
        truck:      `<rect width="16" height="13" x="2" y="4" rx="2" /><path d="M16 21h.01M12 21h.01M8 21h.01" />`,
        container:  `<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />`,
        green_zone: `<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 21 2c-2.5 4-3 5.5-4.1 11.2A7 7 0 0 1 11 20z" />`,
    };
    return `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${svgs[type] || svgs.recycling}</svg>`;
}

function buildMarkerIcon(color, type) {
    return L.divIcon({
        className: "eco-marker-wrapper",
        html: `
            <div style="position:relative;width:44px;height:52px;">
                <div style="
                    width:36px;height:36px;
                    background:linear-gradient(135deg,${color}cc,${color});
                    border:3px solid white;
                    border-radius:50% 50% 50% 0;
                    position:absolute;top:0;left:50%;
                    transform:translateX(-50%) rotate(-45deg);
                    box-shadow:0 4px 14px ${color}55;
                    display:flex;align-items:center;justify-content:center;
                ">
                    <div style="transform:rotate(45deg);display:flex;align-items:center;justify-content:center;width:100%;height:100%;">
                        ${getTypeIconSVG(type, "white")}
                    </div>
                </div>
                <div style="
                    position:absolute;bottom:0;left:50%;
                    transform:translateX(-50%);
                    width:0;height:0;
                    border-left:6px solid transparent;
                    border-right:6px solid transparent;
                    border-top:14px solid ${color};
                "></div>
                <span style="
                    position:absolute;inset:-6px;top:4px;
                    border-radius:50%;
                    background:${color}33;
                    animation:ripple 2s infinite ease-out;
                    transform:rotate(-45deg);
                "></span>
            </div>
        `,
        iconSize: [44, 52],
        iconAnchor: [22, 52],
        popupAnchor: [0, -52],
    });
}

// ─── Configuración igual que AdminMap ────────────────────────────────────────
const DEFAULT_CENTER = { lat: 2.195, lng: -75.627 };
const MAP_BOUNDS = L.latLngBounds([2.140, -75.690], [2.240, -75.560]);

export default function MapView({ points, selectedPlace, onMarkerClick }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const userMarkerRef = useRef(null);

    // ─── Inicializar mapa ──────────────────────────────────────────────────
    useEffect(() => {
        if (mapInstanceRef.current) return;

        mapInstanceRef.current = L.map(mapRef.current, {
            zoomControl: false,
            minZoom: 13,
            maxBounds: MAP_BOUNDS,
            maxBoundsViscosity: 1.0,
        }).setView([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], 14);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
            minZoom: 13,
        }).addTo(mapInstanceRef.current);

        L.control.zoom({ position: "bottomright" }).addTo(mapInstanceRef.current);

        return () => {
            mapInstanceRef.current?.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // ─── Función para renderizar marcadores ───────────────────────────────
    const renderMarkers = (puntos) => {
        if (!mapInstanceRef.current) return;

        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        const valid = puntos.filter(
            (p) => typeof p.lat === "number" && typeof p.lng === "number" &&
                   !isNaN(p.lat) && !isNaN(p.lng)
        );

        valid.forEach((punto) => {
            const cfg = POINT_TYPES[punto.tipo] || POINT_TYPES.recycling;
            const icon = buildMarkerIcon(cfg.color, punto.tipo);

            const marker = L.marker([punto.lat, punto.lng], { icon })
                .addTo(mapInstanceRef.current);

            marker.bindPopup(`
                <div style="font-family:sans-serif;min-width:160px;">
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                        <div style="width:10px;height:10px;border-radius:50%;background:${cfg.color}"></div>
                        <strong style="font-size:13px;color:#14532d">${punto.nombre}</strong>
                    </div>
                    <p style="font-size:11px;color:#6b7280;margin:0 0 4px">${cfg.label}</p>
                    ${punto.descripcion ? `<p style="font-size:11px;color:#374151;">${punto.descripcion}</p>` : ""}
                    ${punto.imagen ? `<img src="${punto.imagen}" alt="${punto.nombre}" style="width:100%;height:80px;object-fit:cover;border-radius:8px;margin-top:6px;" />` : ""}
                </div>
            `, { 
                maxWidth: 260,
                autoPanPadding: [50, 50]
            });

            marker.on("click", () => onMarkerClick?.({
                id: punto._id,
                name: punto.nombre,
                type: punto.tipo,
                lat: punto.lat,
                lng: punto.lng,
                vicinity: punto.descripcion,
            }));

            markersRef.current.push(marker);
        });
    };

    // Re-renderizar marcadores cuando cambian los puntos (prop)
    useEffect(() => {
        if (points) renderMarkers(points);
    }, [points]);

    // ─── Centrar en punto seleccionado + Marcador de mi ubicación ───────────
    useEffect(() => {
        if (!selectedPlace || !mapInstanceRef.current) return;
        if (isNaN(selectedPlace.lat) || isNaN(selectedPlace.lng)) return;
        
        const { lat, lng, name } = selectedPlace;

        // Si es "Mi ubicación", mostrar punto azul
        if (name === "Mi ubicación") {
            if (userMarkerRef.current) userMarkerRef.current.remove();
            
            const userIcon = L.divIcon({
                className: 'user-location-marker',
                html: `
                    <div style="position:relative;">
                        <div style="width:20px;height:20px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 10px rgba(59,130,246,0.5);"></div>
                        <div style="position:absolute;inset:-10px;background:#3b82f6;opacity:0.3;border-radius:50%;animation:ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                    </div>
                `,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            userMarkerRef.current = L.marker([lat, lng], { icon: userIcon })
                .addTo(mapInstanceRef.current)
                .bindPopup("<b>Estás aquí</b>")
                .openPopup();
        } else {
            // Limpiar marcador de usuario si se selecciona otro punto
            if (userMarkerRef.current) {
                userMarkerRef.current.remove();
                userMarkerRef.current = null;
            }
        }

        mapInstanceRef.current.setView([lat, lng], 18, { animate: true });
    }, [selectedPlace]);

    return (
        <div style={{ position: "relative", width: "100%", height: "100%", zIndex: 1 }}>
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
            <style>{`
                .eco-marker-wrapper { background: none !important; border: none !important; }
                .leaflet-popup-content-wrapper {
                    border-radius: 12px !important;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
                }
                .leaflet-popup-tip { display: none; }
                .leaflet-control-zoom a {
                    border-radius: 8px !important;
                    border: 1px solid #e5e7eb !important;
                    color: #15803d !important;
                }
                @keyframes ripple {
                    0%   { transform: scale(0.5) rotate(-45deg); opacity: 0.7; }
                    100% { transform: scale(2)   rotate(-45deg); opacity: 0; }
                }
                @keyframes ping {
                    0% { transform: scale(1); opacity: 0.8; }
                    75%, 100% { transform: scale(3); opacity: 0; }
                }
            `}</style>
        </div>
    );
}
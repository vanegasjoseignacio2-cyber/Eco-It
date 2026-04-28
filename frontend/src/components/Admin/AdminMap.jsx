// AdminMap.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Panel de administración de puntos georreferenciados de Eco-It
// Permite crear, editar, filtrar y eliminar: puntos de reciclaje,
// eco-botellas, carros recolectores, contenedores y zonas verdes.
//
// ⚠️  MAPA ACTUAL: Leaflet + OpenStreetMap (gratuito, sin key)
// 🔁  PARA CAMBIAR DE API DE MAPA → busca el bloque marcado con:
//     "// [SWAP_MAP_API]" y reemplaza la inicialización de L.tileLayer()
//     por la URL de tiles de Google Maps, Mapbox, HERE, etc.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import {
    MapPin,
    Plus,
    Search,
    Trash2,
    Pencil,
    X,
    Recycle,
    Truck,
    Leaf,
    Package,
    Filter,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    ChevronDown,
    Save,
    LocateFixed,
    Image as ImageIcon,
    UploadCloud,
} from "lucide-react";
import ConfirmationModal from "../ui/ConfirmationModal";

// ─── Configuración de Cloudinary ────────────────────────────────────────────────
const cld = new Cloudinary({ cloud: { cloudName: 'dwx3v7vex' } });

function getCloudinaryPublicId(url) {
    if (!url) return null;
    try {
        const parts = url.split('/upload/');
        if (parts.length > 1) {
            let path = parts[1];
            if (path.match(/^v\d+\//)) {
                path = path.substring(path.indexOf('/') + 1);
            }
            const lastDot = path.lastIndexOf('.');
            if (lastDot !== -1) {
                path = path.substring(0, lastDot);
            }
            return path;
        }
    } catch(e) { /* ignore */ }
    return null;
}

// ─── Tipos de puntos ──────────────────────────────────────────────────────────
// TODO: estos tipos pueden venir de BD → GET /api/admin/map/point-types
const POINT_TYPES = {
    recycling: {
        label: "Punto de Reciclaje",
        icon: Recycle,
        color: "#22c55e",
        markerColor: "#22c55e",
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        pill: "bg-green-100 text-green-700",
    },
    ecobottle: {
        label: "Eco-Botella",
        icon: Package,
        color: "#84cc16",
        markerColor: "#84cc16",
        bg: "bg-lime-50",
        text: "text-lime-700",
        border: "border-lime-200",
        pill: "bg-lime-100 text-lime-700",
    },
    truck: {
        label: "Carro Recolector",
        icon: Truck,
        color: "#14b8a6",
        markerColor: "#14b8a6",
        bg: "bg-teal-50",
        text: "text-teal-700",
        border: "border-teal-200",
        pill: "bg-teal-100 text-teal-700",
    },
    container: {
        label: "Contenedor",
        icon: Trash2,
        color: "#10b981",
        markerColor: "#10b981",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        pill: "bg-emerald-100 text-emerald-700",
    },
    green_zone: {
        label: "Zona Verde",
        icon: Leaf,
        color: "#4ade80",
        markerColor: "#4ade80",
        bg: "bg-green-50",
        text: "text-green-600",
        border: "border-green-100",
        pill: "bg-green-50 text-green-600",
    },
};

// ─── Estado inicial de puntos (vacío, vendrá de BD) ──────────────────────────
// TODO: GET /api/admin/map/points → [{ id, name, type, lat, lng, description, active, createdAt }]
const INITIAL_POINTS = [];

// ─── Centro por defecto del mapa ──────────────────────────────────────────────
// TODO: puede venir de configuración → GET /api/admin/config/map-center
const DEFAULT_CENTER = { lat: 2.195, lng: -75.627 };
const DEFAULT_ZOOM = 14;

// ─── Helpers ─────────────────────────────────────────────────────────────────
let _idCounter = 1;
const genId = () => `local_${_idCounter++}`;

function getTypeIconSVG(type, color = "white") {
    const icons = {
        recycling: `<path d="M7 11V7l5-5 5 5v4l-5 5-5-5zM12 2v4M7 11h10" stroke="${color}" stroke-width="2" fill="none"/>`,
        ecobottle: `<path d="M12 2v20M7 7h10M7 17h10" stroke="${color}" stroke-width="2" fill="none"/>`, // Simplificado
        truck: `<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10" stroke="${color}" stroke-width="2" fill="none"/>`,
        container: `<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="${color}" stroke-width="2" fill="none"/>`,
        green_zone: `<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 21 2c-2.5 4-3 5.5-4.1 11.2A7 7 0 0 1 11 20zM11 20v-5" stroke="${color}" stroke-width="2" fill="none"/>`
    };

    // SVG Paths aproximados para Lucide (simplificados para legibilidad)
    const svgs = {
        recycling: `<path d="M7 21v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4M3 7l9-4 9 4v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />`,
        ecobottle: `<path d="M12 2v20M17 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />`,
        truck: `<rect width="16" height="13" x="2" y="4" rx="2" /><path d="M16 21h.01M12 21h.01M8 21h.01M22 21h.01" />`,
        container: `<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />`,
        green_zone: `<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 21 2c-2.5 4-3 5.5-4.1 11.2A7 7 0 0 1 11 20z" />`
    };

    return `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${svgs[type] || svgs.recycling}</svg>`;
}

function buildMarkerIcon(color, type) {
    const iconSVG = getTypeIconSVG(type, "white");
    return L.divIcon({
        className: "eco-admin-marker-wrapper",
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
                    display:flex;align-items:center;justify-center;
                ">
                    <div style="transform: rotate(45deg); display:flex; align-items:center; justify-content:center; width:100%; height:100%;">
                        ${iconSVG}
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
            </div>
        `,
        iconSize: [44, 52],
        iconAnchor: [22, 52],
        popupAnchor: [0, -52],
    });
}

function buildArrowMarkerIcon(type) {
    const cfg = POINT_TYPES[type] || POINT_TYPES.recycling;
    const color = cfg.markerColor;
    return L.divIcon({
        className: "eco-admin-draft-marker",
        html: `
            <div style="position:relative;width:40px;height:40px;display:flex;items-center;justify-center;">
                <!-- Círculo de fondo con pulso usando el color del tipo -->
                <div style="
                    position:absolute;width:40px;height:40px;
                    background:${color}33;border-radius:50%;
                    animation:pulse 2s infinite;
                "></div>
                <!-- La flecha/puntero con el color del tipo -->
                <div style="
                    position:absolute;
                    width:30px;height:30px;
                    background:${color};
                    border-radius:12px 12px 12px 0;
                    transform:rotate(-45deg);
                    display:flex;align-items:center;justify-center;
                    box-shadow:0 4px 12px ${color}66;
                    animation:bounce 1s infinite;
                    z-index:2;
                    border:2px solid white;
                ">
                    <div style="transform:rotate(45deg); display:flex; align-items:center; justify-content:center; width:100%; height:100%;">
                        ${getTypeIconSVG(type, "white")}
                    </div>
                </div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20], // Punta de la flecha al centro del contenedor (donde termina el triángulo)
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminMap() {
    const { token } = useAuth();
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterActive, setFilterActive] = useState("all");
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingPoint, setEditingPoint] = useState(null);
    const [placingMode, setPlacingMode] = useState(false); // click en mapa para colocar pin
    const [toast, setToast] = useState(null);
    const [collapsedTypes, setCollapsedTypes] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

    // Form state
    const [form, setForm] = useState({
        name: "", type: "recycling", description: "", lat: "", lng: "", active: true, imagen: ""
    });

    // ─── Fetch API ──────────────────────────────────────────────────────────
    const fetchPoints = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch("https://backend-production-1e6e.up.railway.app/api/admin/map/points", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                // Adaptamos el esquema del backend (español) al frontend (inglés)
                const mapped = data.puntos.map(p => ({
                    id: p._id,
                    name: p.nombre,
                    type: p.tipo,
                    lat: p.lat,
                    lng: p.lng,
                    description: p.descripcion,
                    imagen: p.imagen,
                    active: p.activo,
                    createdAt: p.createdAt
                }));
                setPoints(mapped);
                
                setSelectedPoint(prev => {
                    if (!prev) return prev;
                    const updatedPoint = mapped.find(p => p.id === prev.id);
                    return updatedPoint ? updatedPoint : prev;
                });
            }
        } catch (error) {
            console.error("Error al cargar puntos:", error);
            showToast("Error al cargar puntos", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchPoints();
    }, [token]);

    // ─── Filtrado ──────────────────────────────────────────────────────────
    const filtered = points.filter((p) => {
        const q = search.toLowerCase();
        const matchSearch = p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
        const matchType = filterType === "all" || p.type === filterType;
        const matchActive = filterActive === "all" || String(p.active) === filterActive;
        return matchSearch && matchType && matchActive;
    });

    // ─── Toast helper ──────────────────────────────────────────────────────
    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ─── CRUD ──────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!token || isSaving) return;
        const lat = parseFloat(form.lat);
        const lng = parseFloat(form.lng);
        if (!form.name.trim()) return showToast("El nombre es requerido", "error");
        if (isNaN(lat) || isNaN(lng)) return showToast("Coordenadas inválidas", "error");

        setIsSaving(true);
        const body = {
            nombre: form.name,
            tipo: form.type,
            lat,
            lng,
            descripcion: form.description,
            activo: form.active,
            imagen: form.imagen
        };
        const url = editingPoint
            ? `https://backend-production-1e6e.up.railway.app/api/admin/map/points/${editingPoint.id}`
            : "https://backend-production-1e6e.up.railway.app/api/admin/map/points";
        const method = editingPoint ? "PATCH" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                showToast(editingPoint ? "Punto actualizado" : "Punto creado");
                fetchPoints();
                resetForm();
            }
        } catch (error) {
            showToast("Error al guardar", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id) => {
        if (!token) return;
        setDeleteConfirm({ open: true, id });
    };

    const confirmDeletePoint = async () => {
        const id = deleteConfirm.id;
        setDeleteConfirm({ open: false, id: null });
        try {
            const res = await fetch(`https://backend-production-1e6e.up.railway.app/api/admin/map/points/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                showToast("Punto eliminado");
                fetchPoints();
                if (selectedPoint?.id === id) setSelectedPoint(null);
            }
        } catch (error) {
            showToast("Error al eliminar", "error");
        }
    };

    const handleToggleActive = async (id) => {
        if (!token) return;

        try {
            const res = await fetch(`https://backend-production-1e6e.up.railway.app/api/admin/map/points/${id}/toggle`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                const nuevoEstado = data.punto.activo ? "Activado" : "Desactivado";
                showToast(`Punto ${nuevoEstado} con éxito`);
                fetchPoints(); // This updates `points` and `selectedPoint`
            } else {
                showToast("Error al cambiar estado", "error");
            }
        } catch (error) {
            showToast("Error al cambiar estado", "error");
        }
    };

    const openEdit = (point) => {
        setEditingPoint(point);
        setForm({
            name: point.name, type: point.type,
            description: point.description || "",
            imagen: point.imagen || "",
            lat: String(point.lat), lng: String(point.lng),
            active: point.active,
        });
        setShowForm(true);
        setSelectedPoint(point);
    };

    const resetForm = () => {
        setForm({ name: "", type: "recycling", description: "", lat: "", lng: "", active: true, imagen: "" });
        setEditingPoint(null);
        setShowForm(false);
        setPlacingMode(false);
    };

    // Coordenadas desde clic en mapa
    const handleMapClick = useCallback((latlng) => {
        if (!placingMode) return;
        setForm((f) => ({ ...f, lat: latlng.lat.toFixed(6), lng: latlng.lng.toFixed(6) }));
        setPlacingMode(false);
        showToast("Coordenadas capturadas del mapa 📍");
    }, [placingMode]);

    const counts = Object.keys(POINT_TYPES).reduce((acc, t) => {
        acc[t] = points.filter((p) => p.type === t).length;
        return acc;
    }, {});

    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-green-50/80 via-white to-emerald-50/50">

            {/* ── Panel lateral izquierdo ─────────────────────────────────────── */}
            <aside className="w-80 flex-shrink-0 h-full flex flex-col border-r border-green-100 bg-white overflow-hidden">

                {/* Header sidebar */}
                <div className="px-5 pt-6 pb-4 border-b border-green-50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Eco-It Admin</p>
                            <h2 className="text-xl font-bold text-green-950 flex items-center gap-2 mt-0.5">
                                <MapPin className="w-5 h-5 text-green-500" />
                                Mapa de Puntos
                            </h2>
                        </div>
                        <motion.button
                            onClick={fetchPoints}
                            disabled={loading}
                            whileHover={{ rotate: loading ? 0 : 180 }}
                            transition={{ duration: 0.4 }}
                            className={`p-2 rounded-xl bg-green-50 text-green-400 hover:text-green-600 hover:bg-green-100 transition-colors ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </motion.button>
                    </div>

                    {/* Búsqueda */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-300" />
                        <input
                            type="text"
                            placeholder="Buscar punto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-green-100 bg-green-50/50 text-sm text-green-900 placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Filtros */}
                    <div className="flex gap-2 mt-3">
                        <div className="relative flex-1">
                            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-green-300 pointer-events-none" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full pl-7 pr-2 py-2 rounded-xl border border-green-100 bg-green-50/50 text-xs text-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none cursor-pointer"
                            >
                                <option value="all">Todos los tipos</option>
                                {Object.entries(POINT_TYPES).map(([k, v]) => (
                                    <option key={k} value={k}>{v.label}</option>
                                ))}
                            </select>
                        </div>
                        <select
                            value={filterActive}
                            onChange={(e) => setFilterActive(e.target.value)}
                            className="px-3 py-2 rounded-xl border border-green-100 bg-green-50/50 text-xs text-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none cursor-pointer"
                        >
                            <option value="all">Todos</option>
                            <option value="true">Activos</option>
                            <option value="false">Inactivos</option>
                        </select>
                    </div>
                </div>

                {/* Resumen por tipo */}
                <div className="px-5 py-3 border-b border-green-50">
                    <button
                        onClick={() => setCollapsedTypes(!collapsedTypes)}
                        className="flex items-center justify-between w-full text-xs font-bold text-green-400 uppercase tracking-wider mb-2"
                    >
                        Resumen por tipo
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${collapsedTypes ? "-rotate-90" : ""}`} />
                    </button>
                    <AnimatePresence>
                        {!collapsedTypes && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-2 gap-1.5">
                                    {Object.entries(POINT_TYPES).map(([key, cfg]) => {
                                        const Icon = cfg.icon;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setFilterType(filterType === key ? "all" : key)}
                                                className={`flex items-center gap-2 px-2.5 py-2 rounded-xl border text-left transition-all
                                                    ${filterType === key ? `${cfg.bg} ${cfg.border}` : "border-transparent hover:bg-green-50"}`}
                                            >
                                                <div
                                                    className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                                                    style={{ background: cfg.color + "33" }}
                                                >
                                                    <Icon className="w-3 h-3" style={{ color: cfg.color }} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-green-400 leading-none truncate">{cfg.label}</p>
                                                    <p className="text-sm font-bold text-green-900">{counts[key] || 0}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Lista de puntos */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
                    {/* TODO: map sobre filtered → viene de GET /api/admin/map/points */}
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-green-200" />
                            </div>
                            <p className="text-sm text-green-300 font-medium">
                                {points.length === 0 ? "Sin puntos creados aún" : "Sin resultados"}
                            </p>
                            <p className="text-xs text-green-200">
                                {points.length === 0
                                    ? "Conecta la BD o crea el primer punto"
                                    : "Prueba con otro filtro"}
                            </p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filtered.map((point) => (
                                <PointCard
                                    key={point.id}
                                    point={point}
                                    isSelected={selectedPoint?.id === point.id}
                                    onSelect={() => setSelectedPoint(point)}
                                    onEdit={() => openEdit(point)}
                                    onDelete={() => handleDelete(point.id)}
                                    onToggle={() => handleToggleActive(point.id)}
                                />
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Botón crear */}
                <div className="px-4 py-4 border-t border-green-50">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-lime-500 to-green-600 text-white font-semibold text-sm shadow-md hover:shadow-xl transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Punto
                    </motion.button>
                </div>
            </aside>

            {/* ── Mapa ─────────────────────────────────────────────────────────── */}
            <div className="flex-1 relative">
                {/* Badge modo colocación */}
                <AnimatePresence>
                    {placingMode && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 px-5 py-2.5 rounded-full bg-lime-500 text-white text-sm font-semibold shadow-xl"
                        >
                            <LocateFixed className="w-4 h-4 animate-pulse" />
                            Haz clic en el mapa para colocar el punto
                            <button onClick={() => setPlacingMode(false)} className="ml-1 hover:opacity-70">
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mapa */}
                <AdminMapView
                    points={filtered}
                    selectedPoint={selectedPoint}
                    onMarkerClick={setSelectedPoint}
                    onMapClick={handleMapClick}
                    placingMode={placingMode}
                    draftMarker={(showForm && form.lat && form.lng) ? { lat: form.lat, lng: form.lng, type: form.type } : null}
                />

                {/* ── Panel de detalle / formulario ────────────────────────────── */}
                <AnimatePresence>
                    {(showForm || selectedPoint) && (
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute top-24 right-4 bottom-4 w-80 z-[1000] bg-white rounded-2xl shadow-2xl border border-green-100 flex flex-col overflow-hidden"
                        >
                            {showForm ? (
                                <FormPanel
                                    form={form}
                                    setForm={setForm}
                                    editingPoint={editingPoint}
                                    onSave={handleSave}
                                    onCancel={resetForm}
                                    onStartPlacing={() => setPlacingMode(true)}
                                    placingMode={placingMode}
                                    isSaving={isSaving}
                                />
                            ) : selectedPoint ? (
                                <DetailPanel
                                    point={selectedPoint}
                                    onClose={() => setSelectedPoint(null)}
                                    onEdit={() => openEdit(selectedPoint)}
                                    onDelete={() => handleDelete(selectedPoint.id)}
                                    onToggle={() => handleToggleActive(selectedPoint.id)}
                                />
                            ) : null}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Toast */}
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            key="toast"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-[2000] flex items-center gap-2 px-5 py-3 rounded-full shadow-xl text-white text-sm font-semibold
                                ${toast.type === "error"
                                    ? "bg-red-500"
                                    : "bg-gradient-to-r from-green-500 to-emerald-600"}`}
                        >
                            {toast.type === "error"
                                ? <AlertCircle className="w-4 h-4" />
                                : <CheckCircle2 className="w-4 h-4" />}
                            {toast.msg}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modal de confirmación para eliminar */}
            <ConfirmationModal
                isOpen={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, id: null })}
                onConfirm={confirmDeletePoint}
                title="¿Eliminar este punto?"
                message="Esta acción eliminará el punto del mapa de forma permanente. No se puede deshacer."
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                type="danger"
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Mapa con Leaflet
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  [SWAP_MAP_API] - Para cambiar el proveedor de mapa:
//   1. Reemplaza el import de leaflet por el SDK del nuevo proveedor
//   2. Cambia L.map() → new ProviderMap(ref, options)
//   3. Cambia L.tileLayer() → ProviderTileLayer con la nueva URL/key
//   4. Cambia L.marker() → new ProviderMarker()
//   5. Mantén la lógica de efectos (puntos, selección) igual
//
//   Proveedores populares:
//   - Google Maps JS API: https://maps.googleapis.com/maps/api/js?key=TU_KEY
//   - Mapbox GL JS: import mapboxgl from 'mapbox-gl'
//   - HERE Maps: import H from '@here/maps-api-for-javascript'
// ─────────────────────────────────────────────────────────────────────────────
function AdminMapView({ points, selectedPoint, onMarkerClick, onMapClick, placingMode, draftMarker }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const placingRef = useRef(placingMode);
    const onMapClickRef = useRef(onMapClick);

    useEffect(() => { placingRef.current = placingMode; }, [placingMode]);
    useEffect(() => { onMapClickRef.current = onMapClick; }, [onMapClick]);

    // Inicializar mapa
    useEffect(() => {
        if (mapInstanceRef.current) return;

        // Crear un límite geográfico exacto para bloquear la vista de Garzón
        const bounds = L.latLngBounds(
            [2.140, -75.690], // Esquina Sur-Oeste
            [2.240, -75.560]  // Esquina Nor-Este
        );

        mapInstanceRef.current = L.map(mapRef.current, {
            zoomControl: false,
            minZoom: 13, // Bloquea el zoom (alejar) más allá de este nivel
            maxBounds: bounds, // Bloquea el movimiento/paneo fuera de la caja
            maxBoundsViscosity: 1.0, // Rebote sólido al chocar con los bordes
        }).setView([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], 13); // Centrado inicial forzado un poco más cerca

        // [SWAP_MAP_API] → Reemplaza esta URL por la del nuevo proveedor
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
            minZoom: 13,
        }).addTo(mapInstanceRef.current);

        // Controles de zoom personalizados (posición)
        L.control.zoom({ position: "bottomright" }).addTo(mapInstanceRef.current);

        // Clic en mapa para capturar coordenadas
        mapInstanceRef.current.on("click", (e) => {
            if (placingRef.current) {
                onMapClickRef.current?.(e.latlng);
            }
        });

        return () => {
            mapInstanceRef.current?.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Cursor en modo colocación
    useEffect(() => {
        if (!mapInstanceRef.current) return;
        const container = mapInstanceRef.current.getContainer();
        container.style.cursor = placingMode ? "crosshair" : "";
    }, [placingMode]);

    // Renderizar marcadores
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        points.forEach((point) => {
            if (isNaN(point.lat) || isNaN(point.lng)) return;
            const cfg = POINT_TYPES[point.type] || POINT_TYPES.recycling;
            const color = point.active ? cfg.markerColor : "#9ca3af";
            const icon = buildMarkerIcon(color, point.type);

            // [SWAP_MAP_API] → reemplaza L.marker por el marcador del nuevo proveedor
            const marker = L.marker([point.lat, point.lng], { icon })
                .addTo(mapInstanceRef.current);

            marker.bindPopup(`
                <div style="font-family:sans-serif;min-width:160px;display:flex;flex-direction:row;gap:12px;align-items:flex-start;">
                    <div style="flex:1;">
                        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
                            <div style="width:10px;height:10px;border-radius:50%;background:${color}"></div>
                            <strong style="font-size:13px;color:#14532d">${point.name}</strong>
                        </div>
                        <p style="font-size:11px;color:#6b7280;margin:0 0 4px">${cfg.label}</p>
                        ${point.description ? `<p style="font-size:11px;color:#374151;word-break:break-word;">${point.description}</p>` : ""}
                        <p style="font-size:10px;color:${point.active ? '#22c55e' : '#9ca3af'};margin-top:4px;font-weight:600">
                            ${point.active ? "● Activo" : "● Inactivo"}
                        </p>
                    </div>
                    ${point.imagen ? `<div style="flex-shrink:0;"><img src="${getCloudinaryPublicId(point.imagen) ? cld.image(getCloudinaryPublicId(point.imagen)).format('auto').quality('auto').toURL() : point.imagen}" alt="Punto" style="width:80px;height:80px;object-fit:cover;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);" /></div>` : ""}
                </div>
            `, { 
                maxWidth: 300,
                autoPanPadding: [50, 50]
            });

            markersRef.current.push(marker);
        });

        // Renderizar marcador de borrador (Flechita)
        if (draftMarker) {
            const lat = parseFloat(draftMarker.lat);
            const lng = parseFloat(draftMarker.lng);
            if (!isNaN(lat) && !isNaN(lng)) {
                const icon = buildArrowMarkerIcon(draftMarker.type);
                const marker = L.marker([lat, lng], { icon, zIndexOffset: 1000 })
                    .addTo(mapInstanceRef.current);
                markersRef.current.push(marker);
            }
        }

        if (points.length > 0) {
            const valid = points.filter((p) => !isNaN(p.lat) && !isNaN(p.lng));
            if (valid.length > 0) {
                mapInstanceRef.current.fitBounds(
                    L.latLngBounds(valid.map((p) => [p.lat, p.lng])),
                    { padding: [80, 80], maxZoom: 16 }
                );
            }
        }
    }, [points, onMarkerClick]);

    // Centrar en punto seleccionado
    useEffect(() => {
        if (!selectedPoint || !mapInstanceRef.current) return;
        if (isNaN(selectedPoint.lat) || isNaN(selectedPoint.lng)) return;
        mapInstanceRef.current.setView([selectedPoint.lat, selectedPoint.lng], 17, { animate: true });
    }, [selectedPoint]);

    return (
        <div style={{ position: "relative", width: "100%", height: "100%", zIndex: 1 }}>
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
            <style>{`
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
                .leaflet-control-zoom a:hover { background: #f0fdf4 !important; }
                @keyframes pulse {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    50% { transform: scale(1.2); opacity: 0.2; }
                    100% { transform: scale(0.8); opacity: 0.5; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
            `}</style>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Tarjeta de punto en lista
// ─────────────────────────────────────────────────────────────────────────────
function PointCard({ point, isSelected, onSelect, onEdit, onDelete, onToggle }) {
    const cfg = POINT_TYPES[point.type] || POINT_TYPES.recycling;
    const Icon = cfg.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -16 }}
            onClick={onSelect}
            className={`relative flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 group
                ${isSelected
                    ? `${cfg.bg} ${cfg.border} shadow-sm`
                    : "border-transparent hover:bg-green-50 hover:border-green-100"
                }`}
        >
            {/* Icono tipo */}
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: (point.active ? cfg.color : "#9ca3af") + "22" }}
            >
                <Icon className="w-4 h-4" style={{ color: point.active ? cfg.color : "#9ca3af" }} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className={`text-sm font-semibold truncate ${point.active ? "text-green-900" : "text-gray-400"}`}>
                        {point.name}
                    </p>
                    {!point.active && (
                        <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">
                            OFF
                        </span>
                    )}
                </div>
                <p className="text-[10px] text-green-400 mt-0.5">{cfg.label}</p>
                {point.description && (
                    <p className="text-[10px] text-green-400 truncate mt-0.5">{point.description}</p>
                )}
                {point.imagen && (
                    <p className="text-[9px] text-green-500 font-medium mt-0.5 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Con imagen</p>
                )}
                <p className="text-[9px] text-green-300 mt-1">
                    {parseFloat(point.lat).toFixed(4)}, {parseFloat(point.lng).toFixed(4)}
                </p>
            </div>

            {/* Acciones rápidas — visibles en hover/seleccionado */}
            <div className={`flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? "opacity-100" : ""}`}>
                <button
                    onClick={(e) => { e.stopPropagation(); onToggle(); }}
                    className="p-1 rounded-lg hover:bg-white transition-colors"
                    title={point.active ? "Desactivar" : "Activar"}
                >
                    {point.active
                        ? <Eye className="w-3.5 h-3.5 text-green-400" />
                        : <EyeOff className="w-3.5 h-3.5 text-gray-300" />}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="p-1 rounded-lg hover:bg-white transition-colors"
                >
                    <Pencil className="w-3.5 h-3.5 text-green-400" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-1 rounded-lg hover:bg-white transition-colors"
                >
                    <Trash2 className="w-3.5 h-3.5 text-red-300 hover:text-red-500" />
                </button>
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Panel de detalle de punto
// ─────────────────────────────────────────────────────────────────────────────
function DetailPanel({ point, onClose, onEdit, onDelete, onToggle }) {
    const cfg = POINT_TYPES[point.type] || POINT_TYPES.recycling;
    const Icon = cfg.icon;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className={`px-5 py-4 border-b border-green-50 ${cfg.bg}`}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                            style={{ background: cfg.color + "33" }}
                        >
                            <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                        </div>
                        <div>
                            <p className="font-bold text-green-950">{point.name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.pill}`}>{cfg.label}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/60 transition-colors">
                        <X className="w-4 h-4 text-green-400" />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 px-5 py-4 space-y-4 overflow-y-auto">
                <InfoRow label="Estado" value={
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${point.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {point.active ? "Activo" : "Inactivo"}
                    </span>
                } />
                <InfoRow label="Latitud" value={point.lat} />
                <InfoRow label="Longitud" value={point.lng} />
                {point.description && <InfoRow label="Descripción" value={point.description} />}
                {point.imagen && (
                    <div>
                        <p className="text-[10px] font-bold text-green-300 uppercase tracking-wider mb-1.5">Imagen</p>
                        {getCloudinaryPublicId(point.imagen) ? (
                            <AdvancedImage 
                                cldImg={cld.image(getCloudinaryPublicId(point.imagen)).format('auto').quality('auto')} 
                                alt="Punto" 
                                className="w-full h-32 object-cover rounded-xl" 
                            />
                        ) : (
                            <img src={point.imagen} alt="Punto" className="w-full h-32 object-cover rounded-xl" />
                        )}
                    </div>
                )}
                {/* TODO: createdAt → mostrar res.data.createdAt formateado */}
                {point.createdAt && (
                    <InfoRow label="Creado el" value={new Date(point.createdAt).toLocaleDateString("es-CO", {
                        day: "numeric", month: "short", year: "numeric",
                    })} />
                )}
            </div>

            {/* Acciones */}
            <div className="px-4 py-4 border-t border-green-50 space-y-2">
                <button
                    onClick={onToggle}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border
                        ${point.active
                            ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                            : "border-green-200 text-green-600 hover:bg-green-50"}`}
                >
                    {point.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {point.active ? "Desactivar punto" : "Activar punto"}
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-lime-500 to-green-600 text-white text-sm font-semibold shadow hover:shadow-lg transition-all"
                    >
                        <Pencil className="w-4 h-4" /> Editar
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 text-sm font-semibold transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-green-300 uppercase tracking-wider mb-0.5">{label}</p>
            <div className="text-sm text-green-900 font-medium">{value}</div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Formulario crear/editar punto
// ─────────────────────────────────────────────────────────────────────────────
function FormPanel({ form, setForm, editingPoint, onSave, onCancel, onStartPlacing, placingMode, isSaving }) {
    const upd = (key, val) => setForm((f) => ({ ...f, [key]: val }));

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-5 py-4 border-b border-green-50 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-green-400 uppercase tracking-wider">
                            {editingPoint ? "Editando punto" : "Nuevo punto"}
                        </p>
                        <h3 className="font-bold text-green-950 mt-0.5 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-500" />
                            {editingPoint ? editingPoint.name : "Crear punto"}
                        </h3>
                    </div>
                    <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-white/60 transition-colors">
                        <X className="w-4 h-4 text-green-400" />
                    </button>
                </div>
            </div>

            {/* Campos */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

                {/* Nombre */}
                <Field label="Nombre del punto *">
                    <input
                        type="text"
                        placeholder="Ej: Punto reciclaje plaza central"
                        value={form.name}
                        onChange={(e) => upd("name", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-green-100 bg-green-50/50 text-sm text-green-900 placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all"
                    />
                </Field>

                {/* Tipo */}
                <Field label="Tipo de punto *">
                    <div className="grid grid-cols-1 gap-1.5">
                        {Object.entries(POINT_TYPES).map(([key, cfg]) => {
                            const Icon = cfg.icon;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => upd("type", key)}
                                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left
                                        ${form.type === key
                                            ? `${cfg.bg} ${cfg.border} ${cfg.text}`
                                            : "border-green-100 hover:bg-green-50 text-green-600"}`}
                                >
                                    <div
                                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: cfg.color + (form.type === key ? "33" : "18") }}
                                    >
                                        <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                                    </div>
                                    {cfg.label}
                                </button>
                            );
                        })}
                    </div>
                </Field>

                {/* Descripción */}
                <Field label="Descripción">
                    <textarea
                        placeholder="Detalle del punto, horarios, instrucciones..."
                        value={form.description}
                        onChange={(e) => upd("description", e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2.5 rounded-xl border border-green-100 bg-green-50/50 text-sm text-green-900 placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white resize-none transition-all"
                    />
                </Field>

                {/* Imagen */}
                <Field label="Imagen publicitaria/foto">
                    <div className="flex flex-col gap-2">
                        {form.imagen && (
                            <div className="relative w-full h-32 rounded-xl border border-green-100 overflow-hidden group">
                                <img src={form.imagen} alt="Vista previa" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => upd("imagen", "")}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <label className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl border-2 border-dashed border-green-200 bg-green-50/30 text-green-600 text-sm font-medium hover:bg-green-50 transition-colors cursor-pointer">
                            <UploadCloud className="w-4 h-4" />
                            {form.imagen ? 'Cambiar imagen' : 'Subir imagen'}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => upd("imagen", reader.result);
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </label>
                    </div>
                </Field>

                {/* Coordenadas */}
                <Field label="Coordenadas *">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                            type="number"
                            step="any"
                            placeholder="Latitud"
                            value={form.lat}
                            onChange={(e) => upd("lat", e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-green-100 bg-green-50/50 text-sm text-green-900 placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all"
                        />
                        <input
                            type="number"
                            step="any"
                            placeholder="Longitud"
                            value={form.lng}
                            onChange={(e) => upd("lng", e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-green-100 bg-green-50/50 text-sm text-green-900 placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all"
                        />
                    </div>
                    {/* Capturar desde clic en mapa */}
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onStartPlacing}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all
                            ${placingMode
                                ? "bg-lime-500 text-white border-lime-500 shadow"
                                : "border-green-200 text-green-600 hover:bg-green-50"}`}
                    >
                        <LocateFixed className={`w-4 h-4 ${placingMode ? "animate-pulse" : ""}`} />
                        {placingMode ? "Haciendo clic en el mapa..." : "Seleccionar desde el mapa"}
                    </motion.button>
                    {form.lat && form.lng && (
                        <p className="text-[10px] text-green-400 mt-1.5 text-center">
                            📍 {parseFloat(form.lat).toFixed(5)}, {parseFloat(form.lng).toFixed(5)}
                        </p>
                    )}
                </Field>

                {/* Estado activo */}
                <Field label="Estado">
                    <div className="flex items-center gap-3 py-1">
                        <button
                            type="button"
                            onClick={() => upd("active", !form.active)}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-300
                                ${form.active ? "bg-green-500" : "bg-gray-200"}`}
                        >
                            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300
                                ${form.active ? "left-5" : "left-0.5"}`}
                            />
                        </button>
                        <span className={`text-sm font-medium ${form.active ? "text-green-700" : "text-gray-400"}`}>
                            {form.active ? "Activo — visible en la app" : "Inactivo — oculto en la app"}
                        </span>
                    </div>
                </Field>
            </div>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-green-50 flex gap-2">
                <button
                    onClick={onCancel}
                    className="flex-1 py-2.5 rounded-xl border border-green-100 text-green-600 text-sm font-semibold hover:bg-green-50 transition-colors"
                >
                    Cancelar
                </button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSave}
                    disabled={isSaving}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold shadow hover:shadow-lg transition-all
                        ${isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-lime-500 to-green-600"}`}
                >
                    {isSaving ? (
                        <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            {editingPoint ? "Guardar cambios" : "Crear punto"}
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div>
            <label className="text-[10px] font-bold text-green-400 uppercase tracking-wider block mb-1.5">{label}</label>
            {children}
        </div>
    );
}
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAPI } from "../../services/api";
import {
    Gamepad2,
    Plus,
    Pencil,
    Trash2,
    Trophy,
    Star,
    Leaf,
    Recycle,
    TreeDeciduous,
    Droplets,
    ToggleLeft,
    ToggleRight,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    Users,
} from "lucide-react";
import { KpiSkeleton, ListSkeleton } from "./AdminSkeletons";

// Removidos los datos mock (MOCK_MISSIONS, MOCK_LEADERBOARD, GAME_STATS)

const TYPE_CONFIG = {
    recycling: { label: "Reciclaje", icon: Recycle, color: "from-lime-400 to-green-500", bg: "bg-lime-50 text-lime-700" },
    nature: { label: "Naturaleza", icon: TreeDeciduous, color: "from-green-500 to-emerald-600", bg: "bg-green-50 text-green-700" },
    water: { label: "Agua", icon: Droplets, color: "from-teal-400 to-emerald-500", bg: "bg-teal-50 text-teal-700" },
    eco: { label: "Eco General", icon: Leaf, color: "from-emerald-500 to-green-600", bg: "bg-emerald-50 text-emerald-700" },
};

export default function AdminEcojuego() {
    const { token } = useAuth();
    const { showToast } = useToast();
    const [missions, setMissions] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [gameStats, setGameStats] = useState({ totalMissions: 0, activeMissions: 0, totalPlayers: 0, avgPoints: 0 });
    
    const [showForm, setShowForm] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [missionToDelete, setMissionToDelete] = useState(null);

    const initialFormState = { 
        title: "", description: "", type: "eco", points: 50,
        targetMetric: "residuosRecolectados", targetValue: 5 
    };
    const [form, setForm] = useState(initialFormState);

    // Fetch game data from API
    const fetchGameData = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [missionsRes, statsRes] = await Promise.all([
                fetchAPI('/admin/game/missions', { token }),
                fetchAPI('/admin/game/stats', { token })
            ]);
            
            if (missionsRes.success) {
                setMissions(missionsRes.missions);
            }
            if (statsRes.success) {
                setGameStats(statsRes.stats);
                setLeaderboard(statsRes.leaderboard);
            }
        } catch (error) {
            console.error('Error al obtener datos del juego:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchGameData();
    }, [fetchGameData]);

    const handleToggle = async (id, currentActive) => {
        try {
            const res = await fetchAPI(`/admin/game/missions/${id}`, {
                method: 'PATCH',
                token,
                body: JSON.stringify({ active: !currentActive })
            });
            if (res.success) {
                setMissions(prev => prev.map(m => m._id === id ? { ...m, active: !currentActive } : m));
            }
        } catch (error) {
            console.error('Error al togglear misión:', error);
        }
    };

    const confirmDelete = (mission) => {
        setMissionToDelete(mission);
    };

    const handleDelete = async () => {
        if (!missionToDelete) return;
        const id = missionToDelete._id;
        try {
            const res = await fetchAPI(`/admin/game/missions/${id}`, {
                method: 'DELETE',
                token
            });
            if (res.success) {
                setMissions(prev => prev.filter(m => m._id !== id));
                showToast('Misión eliminada correctamente', 'success');
                setMissionToDelete(null);
            }
        } catch (error) {
            console.error('Error al eliminar misión:', error);
            showToast('Error al eliminar misión', 'error');
            setMissionToDelete(null);
        }
    };

    const handleSubmit = async () => {
        try {
            const url = editingId ? `/admin/game/missions/${editingId}` : '/admin/game/missions';
            const method = editingId ? 'PATCH' : 'POST';

            const res = await fetchAPI(url, {
                method,
                token,
                body: JSON.stringify(form)
            });
            
            if (res.success) {
                if (editingId) {
                    setMissions(prev => prev.map(m => m._id === editingId ? res.mission : m));
                    showToast('Misión actualizada correctamente', 'success');
                } else {
                    setMissions([res.mission, ...missions]);
                    showToast('Misión creada correctamente', 'success');
                }
                handleCloseForm();
            }
        } catch (error) {
            console.error('Error al guardar misión:', error);
            showToast('Error al guardar la misión', 'error');
        }
    };

    const handleEdit = (mission) => {
        setForm({
            title: mission.title,
            description: mission.description || "",
            type: mission.type,
            points: mission.points,
            targetMetric: mission.targetMetric,
            targetValue: mission.targetValue
        });
        setEditingId(mission._id);
        setShowForm(true);
        // Scroll al inicio si hay muchas misiones
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(initialFormState);
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-green-50/60 via-white to-emerald-50/40 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pr-24 min-h-[84px]"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
                            <Gamepad2 className="w-7 h-7 text-green-500" />
                            Gestión del Eco-Juego
                        </h1>
                        <p className="text-green-500 mt-1 text-sm">Administra misiones, recompensas y el ranking de jugadores</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <motion.button
                            onClick={fetchGameData}
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.4 }}
                            className={`p-2.5 rounded-xl bg-white border border-green-200 text-green-600 hover:shadow-md transition-all ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                                handleCloseForm(); // Limpiar si había algo editándose
                                setShowForm(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-lime-500 to-green-600 text-white text-sm font-semibold shadow-md hover:shadow-xl transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Nueva Misión
                        </motion.button>
                    </div>
                </motion.div>

                {/* Stats rápidas */}
                {loading ? (
                    <KpiSkeleton />
                ) : (
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
                    >
                        {[
                            { label: "Total Misiones", value: gameStats.totalMissions, icon: Gamepad2, color: "text-green-600" },
                            { label: "Misiones Activas", value: gameStats.activeMissions, icon: Star, color: "text-lime-500" },
                            { label: "Jugadores", value: gameStats.totalPlayers, icon: Users, color: "text-emerald-600" },
                            { label: "Puntos Promedio", value: gameStats.avgPoints, icon: Trophy, color: "text-teal-600" },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <motion.div
                                key={label}
                                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                                className="bg-white rounded-2xl border border-green-100 shadow-sm p-4 flex items-center gap-3"
                            >
                                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                                    <Icon className={`w-5 h-5 ${color}`} />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-green-900">{value}</p>
                                    <p className="text-xs text-green-400">{label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Lista de Misiones */}
                    <div className="lg:col-span-2 space-y-3">
                        <h2 className="text-base font-semibold text-green-800 mb-2">Misiones del Juego</h2>

                        {/* Form crear misión */}
                        <AnimatePresence>
                            {showForm && (
                                <motion.div
                                    initial={{ opacity: 0, y: -12, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                                    className="bg-white rounded-2xl border-2 border-lime-300 shadow-lg p-5 mb-2"
                                >
                                    <h3 className="font-semibold text-green-800 mb-5 flex items-center gap-2">
                                        {editingId ? <Pencil className="w-4 h-4 text-lime-500" /> : <Plus className="w-4 h-4 text-lime-500" />}
                                        {editingId ? "Editar Misión" : "Nueva Misión"}
                                    </h3>

                                    <div className="space-y-4">

                                        {/* Paso 1: Información básica */}
                                        <div className="bg-green-50/60 rounded-xl p-4 space-y-3">
                                            <p className="text-xs font-bold text-green-600 uppercase tracking-wider">① Información básica</p>
                                            <div>
                                                <label className="block text-xs font-medium text-green-700 mb-1">Título de la misión *</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: Primer Reciclaje, Racha Ecológica..."
                                                    value={form.title}
                                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                                    className="w-full px-3 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-green-900 placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-green-700 mb-1">Descripción (opcional)</label>
                                                <textarea
                                                    placeholder="Explica qué debe hacer el jugador para completar esta misión..."
                                                    value={form.description}
                                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                    rows={2}
                                                    className="w-full px-3 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-green-900 placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Paso 2: Categoría y recompensa */}
                                        <div className="bg-lime-50/60 rounded-xl p-4 space-y-3">
                                            <p className="text-xs font-bold text-lime-700 uppercase tracking-wider">② Categoría y recompensa</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-green-700 mb-1">Categoría</label>
                                                    <select
                                                        value={form.type}
                                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                                        className="w-full px-3 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-green-800 focus:outline-none focus:ring-2 focus:ring-green-400"
                                                    >
                                                        {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                                                            <option key={k} value={k}>{v.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-green-700 mb-1">Puntos de recompensa</label>
                                                    <input
                                                        type="number"
                                                        min={10}
                                                        max={5000}
                                                        step={10}
                                                        value={form.points}
                                                        onChange={(e) => setForm({ ...form, points: e.target.value === '' ? '' : parseInt(e.target.value) })}
                                                        className="w-full px-3 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-green-800 focus:outline-none focus:ring-2 focus:ring-green-400"
                                                    />
                                                    <p className="text-xs text-green-400 mt-1">pts que gana el jugador al completarla</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Paso 3: Condición de desbloqueo */}
                                        <div className="bg-emerald-50/60 rounded-xl p-4 space-y-3">
                                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">③ Condición para desbloquear</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-green-700 mb-1">¿Qué debe acumular?</label>
                                                    <select
                                                        value={form.targetMetric}
                                                        onChange={(e) => setForm({ ...form, targetMetric: e.target.value })}
                                                        className="w-full px-3 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-green-800 focus:outline-none focus:ring-2 focus:ring-green-400"
                                                    >
                                                        <option value="residuosRecolectados">Residuos recolectados</option>
                                                        <option value="rachaMaxima">Racha máxima</option>
                                                        <option value="partidasJugadas">Partidas jugadas</option>
                                                        <option value="puntosPartida">Puntos en una partida</option>
                                                        <option value="puntosTemporada">Puntos de temporada</option>
                                                        <option value="partidasPerfectas">Partidas perfectas</option>
                                                        <option value="diasConsecutivos">Días consecutivos</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-green-700 mb-1">¿Cuántos / cuántas?</label>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        step={1}
                                                        value={form.targetValue}
                                                        onChange={(e) => setForm({ ...form, targetValue: e.target.value === '' ? '' : parseInt(e.target.value) })}
                                                        className="w-full px-3 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-green-800 focus:outline-none focus:ring-2 focus:ring-green-400"
                                                    />
                                                    <p className="text-xs text-green-400 mt-1">número objetivo a alcanzar</p>
                                                </div>
                                            </div>
                                            <div className="bg-white/70 rounded-lg px-3 py-2 border border-emerald-100">
                                                <p className="text-xs text-emerald-700">
                                                    <span className="font-semibold">Vista previa:</span> Se desbloquea cuando el jugador acumule <span className="font-bold text-emerald-800">{form.targetValue}</span> {{
                                                        residuosRecolectados: 'residuos recolectados',
                                                        rachaMaxima: 'de racha máxima',
                                                        partidasJugadas: 'partidas jugadas',
                                                        puntosPartida: 'puntos en una sola partida',
                                                        puntosTemporada: 'puntos en la temporada',
                                                        partidasPerfectas: 'partidas perfectas',
                                                        diasConsecutivos: 'días consecutivos jugando',
                                                    }[form.targetMetric]}.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 justify-end pt-1">
                                            <button
                                                onClick={handleCloseForm}
                                                className="px-4 py-2 rounded-xl text-sm text-green-600 hover:bg-green-50 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={!form.title}
                                                className="px-5 py-2 rounded-xl bg-gradient-to-r from-lime-500 to-green-600 text-white text-sm font-semibold disabled:opacity-40 hover:shadow-md transition-all"
                                            >
                                                {editingId ? "Guardar Cambios" : "Crear Misión"}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Lista misiones */}
                        {loading ? (
                            <ListSkeleton rows={3} />
                        ) : missions.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-2xl border border-green-100 shadow-sm p-12 flex flex-col items-center gap-3"
                            >
                                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                                    <Gamepad2 className="w-8 h-8 text-green-200" />
                                </div>
                                <p className="text-green-400 font-medium">No hay misiones creadas</p>
                                <p className="text-green-300 text-sm text-center">
                                    {/* TODO: las misiones se cargarán desde GET /api/admin/game/missions */}
                                    Crea la primera misión o conecta la base de datos
                                </p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-lime-500 to-green-600 text-white text-sm font-semibold shadow hover:shadow-lg transition-all"
                                >
                                    <Plus className="w-4 h-4" /> Crear misión
                                </button>
                            </motion.div>
                        ) : (
                            <AnimatePresence>
                                {missions.map((mission, i) => (
                                    <MissionCard
                                        key={mission._id}
                                        mission={mission}
                                        index={i}
                                        expanded={expandedId === mission._id}
                                        onToggleExpand={() => setExpandedId(expandedId === mission._id ? null : mission._id)}
                                        onToggleActive={() => handleToggle(mission._id, mission.active)}
                                        onEdit={() => handleEdit(mission)}
                                        onDelete={() => confirmDelete(mission)}
                                    />
                                ))}
                            </AnimatePresence>
                        )}
                    </div>

                    {/* Leaderboard */}
                    <div>
                        <h2 className="text-base font-semibold text-green-800 mb-2">Ranking de Jugadores</h2>
                        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5">
                            {leaderboard.length === 0 ? (
                                <div className="flex flex-col items-center py-10 gap-3">
                                    <Trophy className="w-10 h-10 text-green-100" />
                                    <p className="text-sm text-green-300">Sin jugadores aún</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {leaderboard.map((player, i) => {
                                        const medals = ["🥇", "🥈", "🥉"];
                                        return (
                                            <div key={i} className="flex items-center gap-3 py-2 border-b border-green-50 last:border-0">
                                                <span className="text-xl w-7">{medals[i] || `${i + 1}`}</span>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-green-900">{player.name}</p>
                                                    <p className="text-xs text-green-400">{player.missions} misiones completadas</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-lime-600">{player.points}</p>
                                                    <p className="text-xs text-green-300">pts</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Leyenda de tipos */}
                        <div className="mt-4 bg-white rounded-2xl border border-green-100 shadow-sm p-5">
                            <h3 className="text-sm font-semibold text-green-700 mb-3">Tipos de Misión</h3>
                            <div className="space-y-2">
                                {Object.entries(TYPE_CONFIG).map(([key, config]) => {
                                    const Icon = config.icon;
                                    return (
                                        <div key={key} className="flex items-center gap-2">
                                            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                                                <Icon className="w-3 h-3 text-white" />
                                            </div>
                                            <span className="text-xs text-green-600 font-medium">{config.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmación de Eliminación Centrado */}
            <AnimatePresence>
                {missionToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white rounded-3xl shadow-2xl border border-red-100 max-w-sm w-full overflow-hidden"
                        >
                            <div className="bg-red-50 p-6 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                    <Trash2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-red-900 mb-1">Eliminar Misión</h3>
                                <p className="text-sm text-red-700/80 mb-2">
                                    ¿Estás completamente seguro de que deseas eliminar la misión <span className="font-semibold text-red-900">"{missionToDelete.title}"</span>?
                                </p>
                                <p className="text-xs text-red-500 font-medium">
                                    Esta acción no se puede deshacer.
                                </p>
                            </div>
                            <div className="p-4 flex gap-3 bg-gray-50/50">
                                <button
                                    onClick={() => setMissionToDelete(null)}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg transition-all"
                                >
                                    Sí, Eliminar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ─── Mission Card ─────────────────────────────────────────────────────────── */
function MissionCard({ mission, index, expanded, onToggleExpand, onToggleActive, onEdit, onDelete }) {
    const type = TYPE_CONFIG[mission.type] || TYPE_CONFIG.eco;
    const Icon = type.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${mission.active ? "border-green-200" : "border-gray-100 opacity-70"}`}
        >
            <div className="flex items-center gap-3 p-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-green-900 truncate">{mission.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${type.bg}`}>{type.label}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-lime-600 font-semibold flex items-center gap-0.5">
                            <Star className="w-3 h-3" />{mission.points} pts
                        </span>
                        {/* TODO: completions → res.data.completions desde BD */}
                        <span className="text-xs text-green-400">{mission.completions || 0} completadas</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Toggle activo */}
                    <button 
                        onClick={onToggleActive} 
                        className="transition-all p-1"
                        title={mission.active ? "Desactivar misión" : "Activar misión"}
                    >
                        <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ease-in-out shadow-inner ${mission.active ? 'bg-gradient-to-r from-lime-400 to-green-500' : 'bg-gray-200'}`}>
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${mission.active ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                    </button>

                    {/* Editar */}
                    <button 
                        onClick={onEdit} 
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-colors"
                        title="Editar misión"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>

                    {/* Eliminar */}
                    <button 
                        onClick={onDelete} 
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-300 hover:text-red-500 transition-colors"
                        title="Eliminar misión"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Expandir */}
                    <button onClick={onToggleExpand} className="p-1.5 rounded-lg hover:bg-green-50 text-green-400 transition-colors">
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Descripción expandida */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-0 border-t border-green-50">
                            <p className="text-sm text-green-600 mt-3">{mission.description || "Sin descripción."}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
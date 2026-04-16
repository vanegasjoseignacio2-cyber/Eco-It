import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// ─── DATOS DE EJEMPLO ───────────────────────────────────────────────────────
// TODO: GET /api/admin/game/missions → lista de misiones
// { id, title, description, type, points, active, completions, icon }
const MOCK_MISSIONS = [
    // Ejemplo estructura:
    // {
    //   id: "1",
    //   title: "Recicla 5 botellas",
    //   description: "Lleva 5 botellas al punto de reciclaje más cercano.",
    //   type: "recycling",
    //   points: 50,
    //   active: true,
    //   completions: 134,
    // },
];

// TODO: GET /api/admin/game/leaderboard?limit=5 → top jugadores
const MOCK_LEADERBOARD = [
    // { name: "Nombre", points: 980, rank: 1, missions: 12 },
];

// TODO: GET /api/admin/game/stats → { totalMissions, activeMissions, totalPlayers, avgPoints }
const GAME_STATS = {
    totalMissions: 0,
    activeMissions: 0,
    totalPlayers: 0,
    avgPoints: 0,
};

const TYPE_CONFIG = {
    recycling: { label: "Reciclaje", icon: Recycle, color: "from-lime-400 to-green-500", bg: "bg-lime-50 text-lime-700" },
    nature: { label: "Naturaleza", icon: TreeDeciduous, color: "from-green-500 to-emerald-600", bg: "bg-green-50 text-green-700" },
    water: { label: "Agua", icon: Droplets, color: "from-teal-400 to-emerald-500", bg: "bg-teal-50 text-teal-700" },
    eco: { label: "Eco General", icon: Leaf, color: "from-emerald-500 to-green-600", bg: "bg-emerald-50 text-emerald-700" },
};

export default function AdminEcojuego() {
    const [missions, setMissions] = useState(MOCK_MISSIONS);
    const [showForm, setShowForm] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(false);

    // TODO: form state conectar con POST /api/admin/game/missions para crear
    const [form, setForm] = useState({ title: "", description: "", type: "recycling", points: 50 });

    // Fetch game data from API (will use real endpoint when available)
    const fetchGameData = useCallback(async () => {
        setLoading(true);
        try {
            // TODO: Replace with real API calls:
            // const [missionsRes, leaderboardRes, statsRes] = await Promise.all([
            //   fetch('/api/admin/game/missions', { headers: { Authorization: `Bearer ${token}` } }),
            //   fetch('/api/admin/game/leaderboard?limit=5', { headers: { Authorization: `Bearer ${token}` } }),
            //   fetch('/api/admin/game/stats', { headers: { Authorization: `Bearer ${token}` } }),
            // ]);

            // Simulated refresh: reset to source data
            await new Promise((resolve) => setTimeout(resolve, 600));
            setMissions([...MOCK_MISSIONS]);
        } catch (error) {
            console.error('Error al obtener datos del juego:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchGameData();
    }, [fetchGameData]);

    const handleToggle = (id) => {
        // TODO: PATCH /api/admin/game/missions/:id/toggle → activa o desactiva misión en BD
        setMissions((prev) =>
            prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
        );
    };

    const handleDelete = (id) => {
        // TODO: DELETE /api/admin/game/missions/:id con confirmación modal
        setMissions((prev) => prev.filter((m) => m.id !== id));
    };

    const handleCreate = () => {
        // TODO: POST /api/admin/game/missions → { title, description, type, points }
        // y luego refetch o agregar al estado local
        setShowForm(false);
        setForm({ title: "", description: "", type: "recycling", points: 50 });
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-green-50/60 via-white to-emerald-50/40 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
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
                            // TODO: refetch real missions y leaderboard desde BD
                            className={`p-2.5 rounded-xl bg-white border border-green-200 text-green-600 hover:shadow-md transition-all ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-lime-500 to-green-600 text-white text-sm font-semibold shadow-md hover:shadow-xl transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Nueva Misión
                        </motion.button>
                    </div>
                </motion.div>

                {/* Stats rápidas */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: "Total Misiones", value: GAME_STATS.totalMissions, icon: Gamepad2, color: "text-green-600" },
                        { label: "Misiones Activas", value: GAME_STATS.activeMissions, icon: Star, color: "text-lime-500" },
                        { label: "Jugadores", value: GAME_STATS.totalPlayers, icon: Users, color: "text-emerald-600" },
                        { label: "Puntos Promedio", value: GAME_STATS.avgPoints, icon: Trophy, color: "text-teal-600" },
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
                                    <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                                        <Plus className="w-4 h-4 text-lime-500" />
                                        Nueva Misión
                                    </h3>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Título de la misión"
                                            value={form.title}
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                            className="w-full px-3 py-2.5 rounded-xl border border-green-200 text-sm text-green-900 placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                                        />
                                        <textarea
                                            placeholder="Descripción de la misión..."
                                            value={form.description}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            rows={2}
                                            className="w-full px-3 py-2.5 rounded-xl border border-green-200 text-sm text-green-900 placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                                        />
                                        <div className="flex gap-3">
                                            <select
                                                value={form.type}
                                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                                className="flex-1 px-3 py-2.5 rounded-xl border border-green-200 text-sm text-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none"
                                            >
                                                {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                                                    <option key={k} value={k}>{v.label}</option>
                                                ))}
                                            </select>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min={10}
                                                    max={500}
                                                    value={form.points}
                                                    onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                                                    className="w-28 px-3 py-2.5 rounded-xl border border-green-200 text-sm text-green-800 focus:outline-none focus:ring-2 focus:ring-green-400"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-400">pts</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => setShowForm(false)}
                                                className="px-4 py-2 rounded-xl text-sm text-green-600 hover:bg-green-50 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleCreate}
                                                disabled={!form.title}
                                                className="px-5 py-2 rounded-xl bg-gradient-to-r from-lime-500 to-green-600 text-white text-sm font-semibold disabled:opacity-40 hover:shadow-md transition-all"
                                            >
                                                Crear Misión
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Lista misiones */}
                        {missions.length === 0 ? (
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
                                        key={mission.id}
                                        mission={mission}
                                        index={i}
                                        expanded={expandedId === mission.id}
                                        onToggleExpand={() => setExpandedId(expandedId === mission.id ? null : mission.id)}
                                        onToggleActive={() => handleToggle(mission.id)}
                                        onDelete={() => handleDelete(mission.id)}
                                    />
                                ))}
                            </AnimatePresence>
                        )}
                    </div>

                    {/* Leaderboard */}
                    <div>
                        <h2 className="text-base font-semibold text-green-800 mb-2">Ranking de Jugadores</h2>
                        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5">
                            {/* TODO: map sobre MOCK_LEADERBOARD → GET /api/admin/game/leaderboard?limit=5 */}
                            {MOCK_LEADERBOARD.length === 0 ? (
                                <div className="flex flex-col items-center py-10 gap-3">
                                    <Trophy className="w-10 h-10 text-green-100" />
                                    <p className="text-sm text-green-300">Sin jugadores aún</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {MOCK_LEADERBOARD.map((player, i) => {
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
        </div>
    );
}

/* ─── Mission Card ─────────────────────────────────────────────────────────── */
function MissionCard({ mission, index, expanded, onToggleExpand, onToggleActive, onDelete }) {
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
                    <button onClick={onToggleActive} className="transition-colors">
                        {mission.active
                            ? <ToggleRight className="w-6 h-6 text-green-500" />
                            : <ToggleLeft className="w-6 h-6 text-gray-300" />
                        }
                    </button>

                    {/* Editar */}
                    {/* TODO: onClick → abrir modal de edición con los datos de la misión + PATCH /api/admin/game/missions/:id */}
                    <button className="p-1.5 rounded-lg hover:bg-green-50 text-green-400 hover:text-green-600 transition-colors">
                        <Pencil className="w-4 h-4" />
                    </button>

                    {/* Eliminar */}
                    <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-green-300 hover:text-red-400 transition-colors">
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
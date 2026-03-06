import { motion } from "framer-motion";
import {
    Users,
    Gamepad2,
    TrendingUp,
    Leaf,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Globe,
    Sparkles,
    RefreshCw,
} from "lucide-react";

// ─── DATOS DE EJEMPLO ───────────────────────────────────────────────────────
// TODO: Reemplazar con fetch real a la BD
// GET /api/admin/dashboard/stats → devuelve { users, activeSessions, queries, recyclePoints }
const kpis = [
    {
        id: "users",
        label: "Usuarios Totales",
        // TODO: value → res.data.users.total
        value: "0",
        // TODO: change → res.data.users.growthPercent (positivo = subida, negativo = bajada)
        change: "+0%",
        up: true,
        icon: Users,
        color: "from-green-500 to-emerald-600",
        bg: "from-green-50 to-emerald-50",
        border: "border-green-200",
    },
    {
        id: "active",
        label: "Sesiones Activas",
        // TODO: value → res.data.activeSessions
        value: "0",
        change: "+0%",
        up: true,
        icon: Activity,
        color: "from-lime-500 to-green-500",
        bg: "from-lime-50 to-green-50",
        border: "border-lime-200",
    },
    {
        id: "queries",
        label: "Consultas IA Hoy",
        // TODO: value → res.data.queries.today
        value: "0",
        change: "+0%",
        up: true,
        icon: Sparkles,
        color: "from-teal-500 to-emerald-600",
        bg: "from-teal-50 to-emerald-50",
        border: "border-teal-200",
    },
    {
        id: "points",
        label: "Puntos Reciclaje",
        // TODO: value → res.data.recyclePoints.total
        value: "0",
        change: "+0%",
        up: false,
        icon: Globe,
        color: "from-emerald-500 to-green-600",
        bg: "from-emerald-50 to-green-50",
        border: "border-emerald-200",
    },
];

// TODO: GET /api/admin/dashboard/recent-activity → últimas 5 acciones del sistema
const recentActivity = [
    // { user: "Nombre", action: "Se registró", time: "hace 2 min", type: "register" },
    // { user: "Nombre", action: "Completó misión", time: "hace 5 min", type: "game" },
];

// TODO: GET /api/admin/dashboard/top-users?limit=5 → usuarios más activos
const topUsers = [
    // { name: "Nombre", points: 1200, rank: 1 },
];

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function AdminHero() {
    const now = new Date().toLocaleDateString("es-CO", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    return (
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-green-50/60 via-white to-emerald-50/40 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-start justify-between mb-10"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Leaf className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-green-600 font-medium capitalize">{now}</span>
                        </div>
                        <h1 className="text-4xl font-bold text-green-900">
                            Panel de Control
                        </h1>
                        <p className="text-green-600 mt-1">Bienvenido al admin de Eco-It 🌿</p>
                    </div>

                    <motion.button
                        whileHover={{ y: -5, scale: 1.05}}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-green-200 text-green-700 text-sm font-medium shadow-sm hover:shadow-md hover:border-green-400 transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Actualizar
                    </motion.button>
                </motion.div>

                {/* KPI Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10"
                >
                    {kpis.map((kpi) => {
                        const Icon = kpi.icon;
                        return (
                            <motion.div
                                key={kpi.id}
                                variants={cardVariants}
                                whileHover={{ y: -4, shadow: "xl" }}
                                className={`relative bg-gradient-to-br ${kpi.bg} border ${kpi.border} rounded-2xl p-5 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300`}
                            >
                                {/* Fondo decorativo */}
                                <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${kpi.color} opacity-10`} />

                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-md`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
                                        ${kpi.up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                        {kpi.up
                                            ? <ArrowUpRight className="w-3 h-3" />
                                            : <ArrowDownRight className="w-3 h-3" />}
                                        {kpi.change}
                                    </div>
                                </div>

                                <p className="text-3xl font-bold text-green-900 mb-1">{kpi.value}</p>
                                <p className="text-sm text-green-600 font-medium">{kpi.label}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Lower Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Actividad reciente */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="lg:col-span-3 bg-white rounded-2xl border border-green-100 shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-green-900 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-green-500" />
                                Actividad Reciente
                            </h2>
                            {/* TODO: botón "Ver todo" → navega a sección usuarios o logs */}
                            <button className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors">
                                Ver todo
                            </button>
                        </div>

                        {/* TODO: map sobre recentActivity → GET /api/admin/dashboard/recent-activity */}
                        {recentActivity.length === 0 ? (
                            <EmptyState icon={Activity} message="No hay actividad reciente aún." />
                        ) : (
                            <div className="space-y-3">
                                {recentActivity.map((act, i) => (
                                    <ActivityRow key={i} {...act} />
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Top usuarios */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="lg:col-span-2 bg-white rounded-2xl border border-green-100 shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-green-900 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-lime-500" />
                                Top Usuarios
                            </h2>
                        </div>

                        {/* TODO: map sobre topUsers → GET /api/admin/dashboard/top-users?limit=5 */}
                        {topUsers.length === 0 ? (
                            <EmptyState icon={Users} message="Sin datos de ranking aún." />
                        ) : (
                            <div className="space-y-3">
                                {topUsers.map((u, i) => (
                                    <TopUserRow key={i} {...u} index={i} />
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-6 bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Gamepad2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white font-semibold">Eco-Juego activo</p>
                            {/* TODO: misiones activas → GET /api/admin/game/active-missions-count */}
                            <p className="text-green-200 text-sm">0 misiones disponibles ahora mismo</p>
                        </div>
                    </div>
                    {/* TODO: navegar a sección ecojuego */}
                    <button className="px-5 py-2.5 rounded-full bg-white text-green-700 font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all">
                        Administrar Juego
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

/* ─── Sub-componentes ──────────────────────────────────────────────────────── */

function EmptyState({ icon: Icon, message }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <Icon className="w-6 h-6 text-green-300" />
            </div>
            <p className="text-sm text-green-400">{message}</p>
        </div>
    );
}

function ActivityRow({ user, action, time, type }) {
    const colors = {
        register: "bg-lime-100 text-lime-700",
        game: "bg-emerald-100 text-emerald-700",
        query: "bg-teal-100 text-teal-700",
    };
    return (
        <div className="flex items-center gap-3 py-2 border-b border-green-50 last:border-0">
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${colors[type] || "bg-gray-100 text-gray-600"}`}>
                {type}
            </div>
            <div className="flex-1">
                <span className="text-sm font-medium text-green-900">{user}</span>
                <span className="text-sm text-green-500"> · {action}</span>
            </div>
            <span className="text-xs text-green-400">{time}</span>
        </div>
    );
}

function TopUserRow({ name, points, index }) {
    const medals = ["🥇", "🥈", "🥉"];
    return (
        <div className="flex items-center gap-3 py-2 border-b border-green-50 last:border-0">
            <span className="text-lg">{medals[index] || `#${index + 1}`}</span>
            <div className="flex-1">
                <p className="text-sm font-semibold text-green-900">{name}</p>
                <p className="text-xs text-green-500">{points} puntos</p>
            </div>
            <div className="w-16 h-1.5 rounded-full bg-green-100 overflow-hidden">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-lime-400 to-green-500"
                    style={{ width: `${Math.min((points / 1500) * 100, 100)}%` }}
                />
            </div>
        </div>
    );
}
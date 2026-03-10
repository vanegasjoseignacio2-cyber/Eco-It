import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BarChart3,
    TrendingUp,
    Users,
    Sparkles,
    Leaf,
    ArrowUpRight,
    ArrowDownRight,
    Award,
    Target,
    Activity,
    Zap,
    RefreshCw,
    ChevronRight,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// TODO: GET /api/admin/stats/overview?period=week|month|year
// Respuesta esperada: { kpis: [...], chartData: {...}, breakdown: [...] }
// ─────────────────────────────────────────────────────────────

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

// TODO: traer desde BD según período seleccionado
const DATA = {
    users:     MONTHS.map((m) => ({ label: m, value: 0 })),
    queries:   MONTHS.map((m) => ({ label: m, value: 0 })),
    recycling: MONTHS.map((m) => ({ label: m, value: 0 })),
};

// TODO: GET /api/admin/stats/kpis → { value, change, up }[]
const KPI_LIST = [
    {
        id: "users",
        label: "Usuarios Totales",
        value: "0",      // TODO: res.data.kpis.users.total
        change: "0%",    // TODO: res.data.kpis.users.change
        up: true,
        icon: Users,
        accent: "#22c55e",
        pill: "bg-green-100 text-green-700",
    },
    {
        id: "retention",
        label: "Tasa de Retención",
        value: "0%",     // TODO: res.data.kpis.retention
        change: "0%",
        up: true,
        icon: Target,
        accent: "#84cc16",
        pill: "bg-lime-100 text-lime-700",
    },
    {
        id: "queries",
        label: "Consultas IA",
        value: "0",      // TODO: res.data.kpis.queries.total
        change: "0%",
        up: false,
        icon: Sparkles,
        accent: "#10b981",
        pill: "bg-emerald-100 text-emerald-700",
    },
    {
        id: "avg_points",
        label: "Puntos Promedio",
        value: "0",      // TODO: res.data.kpis.avgPoints
        change: "0%",
        up: true,
        icon: Award,
        accent: "#14b8a6",
        pill: "bg-teal-100 text-teal-700",
    },
];

// TODO: GET /api/admin/stats/activity-breakdown → { label, pct, color }[]
const BREAKDOWN = [
    { label: "Consultas a la IA",             pct: 0, color: "#22c55e" },
    { label: "Puntos de Reciclaje visitados", pct: 0, color: "#84cc16" },
    { label: "Misiones del Eco-Juego",        pct: 0, color: "#10b981" },
    { label: "Nuevos registros",              pct: 0, color: "#14b8a6" },
];

const CHART_TABS = [
    { id: "users",     label: "Usuarios",   icon: Users,    color: "#22c55e" },
    { id: "queries",   label: "IA Queries", icon: Sparkles, color: "#84cc16" },
    { id: "recycling", label: "Reciclaje",  icon: Leaf,     color: "#10b981" },
];

const PERIODS = [
    { id: "week",  label: "7 días" },
    { id: "month", label: "30 días" },
    { id: "year",  label: "Este año" },
];

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function AdminEstadisticas() {
    const [activeChart, setActiveChart] = useState("users");
    const [period, setPeriod] = useState("year");

    const tab    = CHART_TABS.find((c) => c.id === activeChart);
    const bars   = DATA[activeChart] || [];
    const maxVal = Math.max(...bars.map((d) => d.value), 1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50/80 via-white to-emerald-50/50">
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div>
                        <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-1">Panel de análisis</p>
                        <h1 className="text-3xl font-bold text-green-950 flex items-center gap-2.5">
                            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </span>
                            Estadísticas
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* TODO: onChange → refetch según período desde BD */}
                        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-green-100 shadow-sm">
                            {PERIODS.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setPeriod(p.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                                        ${period === p.id
                                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow"
                                            : "text-green-500 hover:text-green-700 hover:bg-green-50"
                                        }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.4 }}
                            className="p-2.5 rounded-xl bg-white border border-green-100 text-green-400 hover:text-green-600 shadow-sm hover:shadow-md transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </motion.button>
                    </div>
                </motion.div>

                {/* KPI Cards */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 xl:grid-cols-4 gap-4"
                >
                    {KPI_LIST.map((kpi) => {
                        const Icon = kpi.icon;
                        return (
                            <motion.div
                                key={kpi.id}
                                variants={fadeUp}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="relative bg-white rounded-2xl border border-green-100 shadow-sm p-5 overflow-hidden group cursor-default"
                            >
                                {/* Línea superior de acento */}
                                <div
                                    className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ background: `linear-gradient(to right, ${kpi.accent}, ${kpi.accent}55)` }}
                                />
                                {/* Blob decorativo */}
                                <div
                                    className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full opacity-10"
                                    style={{ background: kpi.accent }}
                                />

                                <div className="flex items-start justify-between mb-5">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow"
                                        style={{ background: `linear-gradient(135deg, ${kpi.accent}bb, ${kpi.accent})` }}
                                    >
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${kpi.pill}`}>
                                        {kpi.up
                                            ? <ArrowUpRight className="w-3 h-3" />
                                            : <ArrowDownRight className="w-3 h-3" />}
                                        {kpi.change}
                                    </span>
                                </div>

                                <p className="text-3xl font-black text-green-950 tracking-tight mb-1">{kpi.value}</p>
                                <p className="text-xs text-green-400 font-medium">{kpi.label}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Chart + Panel lateral */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Gráfica */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.2 }}
                        className="lg:col-span-2 bg-white rounded-2xl border border-green-100 shadow-sm p-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                            <div>
                                <p className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-0.5">Tendencia</p>
                                <h2 className="text-lg font-bold text-green-950">{tab.label}</h2>
                            </div>

                            <div className="flex items-center gap-1 bg-green-50 rounded-xl p-1">
                                {CHART_TABS.map((t) => {
                                    const TIcon = t.icon;
                                    const active = activeChart === t.id;
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => setActiveChart(t.id)}
                                            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                                                ${active ? "text-white" : "text-green-500 hover:text-green-700"}`}
                                        >
                                            {active && (
                                                <motion.div
                                                    layoutId="chartTab"
                                                    className="absolute inset-0 rounded-lg shadow"
                                                    style={{ background: `linear-gradient(135deg, ${t.color}bb, ${t.color})` }}
                                                />
                                            )}
                                            <span className="relative z-10 flex items-center gap-1.5">
                                                <TIcon className="w-3.5 h-3.5" />
                                                {t.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeChart}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="relative"
                            >
                                {/* Líneas guía */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pl-7">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-full h-px border-t border-dashed border-green-100" />
                                    ))}
                                </div>

                                {/* Barras */}
                                <div className="flex items-end gap-1.5 h-56 pb-8 pl-7 pt-2">
                                    {bars.map((bar, i) => {
                                        const pct = maxVal > 0 ? (bar.value / maxVal) * 100 : 0;
                                        return (
                                            <div key={bar.label} className="flex-1 flex flex-col items-center gap-1 group">
                                                <div className="h-5 flex items-end">
                                                    <span className="text-[10px] font-bold text-green-700 opacity-0 group-hover:opacity-100 transition-all bg-green-50 rounded px-1">
                                                        {bar.value}
                                                    </span>
                                                </div>
                                                <div className="w-full flex-1 flex items-end">
                                                    <motion.div
                                                        initial={{ scaleY: 0 }}
                                                        animate={{ scaleY: 1 }}
                                                        transition={{ duration: 0.5, delay: i * 0.035, ease: [0.34, 1.1, 0.64, 1] }}
                                                        className="w-full rounded-t-md overflow-hidden cursor-default"
                                                        style={{
                                                            height: `${Math.max(pct, 3)}%`,
                                                            background: pct < 1 ? "#f0fdf4" : `linear-gradient(to top, ${tab.color}55, ${tab.color})`,
                                                            transformOrigin: "bottom",
                                                        }}
                                                    >
                                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                                                    </motion.div>
                                                </div>
                                                <span className="text-[9px] text-green-300 font-medium mt-1">{bar.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {maxVal <= 1 && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pb-8 gap-2">
                                        <Activity className="w-8 h-8 text-green-100" />
                                        <p className="text-sm text-green-300 font-medium">Sin datos aún</p>
                                        <p className="text-xs text-green-200">Conecta la BD para ver métricas</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-4 pt-4 border-t border-green-50 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-green-400">
                                <div className="w-3 h-3 rounded-sm" style={{ background: tab.color }} />
                                {tab.label} · {PERIODS.find((p) => p.id === period)?.label}
                            </div>
                            {/* TODO: res.data.percentChange */}
                            <div className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                                <TrendingUp className="w-3.5 h-3.5" />
                                +0% vs período anterior
                            </div>
                        </div>
                    </motion.div>

                    {/* Panel derecho */}
                    <div className="flex flex-col gap-5">

                        {/* Métricas clave */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            className="bg-white rounded-2xl border border-green-100 shadow-sm p-5"
                        >
                            <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-3">Métricas clave</p>
                            {/* TODO: GET /api/admin/stats/key-metrics */}
                            {[
                                { label: "Mejor mes",   value: "—", icon: Award,    color: "text-lime-500" },
                                { label: "Pico diario", value: "0", icon: Zap,      color: "text-green-500" },
                                { label: "Nuevos hoy",  value: "0", icon: Users,    color: "text-emerald-500" },
                            ].map(({ label, value, icon: Icon, color }) => (
                                <div key={label} className="flex items-center justify-between py-2.5 border-b border-green-50 last:border-0">
                                    <div className="flex items-center gap-2">
                                        <Icon className={`w-4 h-4 ${color}`} />
                                        <span className="text-sm text-green-700">{label}</span>
                                    </div>
                                    <span className="text-sm font-bold text-green-950">{value}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* Distribución */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.32 }}
                            className="flex-1 bg-white rounded-2xl border border-green-100 shadow-sm p-5"
                        >
                            <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-4">Distribución</p>
                            {/* TODO: GET /api/admin/stats/activity-breakdown */}
                            <div className="space-y-4">
                                {BREAKDOWN.map((row, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-xs text-green-700 font-medium truncate pr-2">{row.label}</span>
                                            <span className="text-xs font-bold text-green-400 flex-shrink-0">{row.pct}%</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-green-50 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${row.pct || 0}%` }}
                                                transition={{ duration: 0.9, delay: i * 0.1, ease: "easeOut" }}
                                                className="h-full rounded-full"
                                                style={{
                                                    background: `linear-gradient(to right, ${row.color}77, ${row.color})`,
                                                    minWidth: row.pct > 0 ? "4px" : "0",
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] text-green-200 mt-5 text-center">
                                Datos disponibles al conectar la BD
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Tabla eventos recientes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.38 }}
                    className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden"
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-green-50">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-green-500" />
                            <h2 className="text-base font-bold text-green-950">Eventos recientes</h2>
                        </div>
                        {/* TODO: navegar a logs completos */}
                        <button className="flex items-center gap-1 text-xs text-green-400 hover:text-green-600 font-semibold transition-colors">
                            Ver todos <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-12 gap-2 px-6 py-2.5 bg-green-50/60 text-[10px] font-bold text-green-400 uppercase tracking-wider">
                        <div className="col-span-4">Evento</div>
                        <div className="col-span-3">Usuario</div>
                        <div className="col-span-3">Categoría</div>
                        <div className="col-span-2 text-right">Hace</div>
                    </div>

                    {/* TODO: GET /api/admin/stats/recent-events?limit=8 */}
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Activity className="w-8 h-8 text-green-100" />
                        <p className="text-sm text-green-300 font-medium">Sin eventos registrados aún</p>
                        <p className="text-xs text-green-200">Los eventos aparecerán aquí al conectar la BD</p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
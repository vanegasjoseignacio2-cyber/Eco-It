import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
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

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const CHART_TABS = [
    { id: "users", label: "Usuarios", icon: Users, color: "#22c55e" },
    { id: "queries", label: "IA Queries", icon: Sparkles, color: "#84cc16" },
    
];

const PERIODS = [
    { id: "week", label: "7 días" },
    { id: "month", label: "30 días" },
    { id: "year", label: "Este año" },
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
    const { token } = useAuth();
    const { usuariosOnline } = useSocket();
    const [stats, setStats] = useState({
        totalUsuarios: "0",
        usuariosOnline: "0",
        consultasHoy: 0,
        mejorMes: "—",
        picoDiario: 0,
        nuevosHoy: 0,
        chartData: null,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/admin/stats", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                console.log("Respuesta API:", data);
                if (data.success) {
                    setStats({
                        totalUsuarios: data.totalUsuarios?.toString() || "0",
                        usuariosOnline: data.usuariosOnline?.toString() || "0",
                        consultasHoy: data.consultasHoy || 0,
                        mejorMes: data.mejorMes || "—",
                        picoDiario: data.picoDiario || 0,
                        nuevosHoy: data.nuevosHoy || 0,
                        chartData: data.chartData || null,
                    });
                }
            } catch (error) {
                console.error("Error al obtener estadísticas:", error);
            }
        };
        if (token) fetchStats();
    }, [token]);

    const [activeChart, setActiveChart] = useState("users");
    const [period, setPeriod] = useState("year");

    const tab = CHART_TABS.find((c) => c.id === activeChart);

    // Base vacía mientras carga
    const baseChart = {
        users: MONTHS.map((m) => ({ label: m, value: 0 })),
        queries: MONTHS.map((m) => ({ label: m, value: 0 })),
    };

    // Si viene data del servidor la usamos, si no la base en cero
    const chartSource = stats.chartData ? stats.chartData : baseChart;

    // Si por alguna razón las queries vinieran con campo "date" en lugar de ya agrupadas,
    // las agrupamos por mes aquí en el frontend
    let chartDataForBars = {
        ...baseChart,
        ...chartSource,
    };
    if (
        activeChart === "queries" &&
        chartSource.queries &&
        chartSource.queries.length > 0 &&
        chartSource.queries[0].date
    ) {
        const monthlyByLabel = {};
        chartSource.queries.forEach((item) => {
            const date = new Date(item.date);
            const monthLabel = MONTHS[date.getMonth()];
            const value = Number(item.value) || 0;
            monthlyByLabel[monthLabel] = (monthlyByLabel[monthLabel] || 0) + value;
        });
        const aggregatedQueries = MONTHS.map((m) => ({ label: m, value: monthlyByLabel[m] || 0 }));
        chartDataForBars = { ...chartDataForBars, queries: aggregatedQueries };
    }

    const bars = chartDataForBars[activeChart] || baseChart.users;

    // Máximo valor real para saber si el gráfico está en cero absoluto
    const actualMax = Math.max(...bars.map((d) => d.value));
    const allZero = actualMax === 0;

    // La escala para usuarios se basa en el total en BD; para el resto, en el máximo real
    const totalUsuariosNum = parseInt(stats.totalUsuarios, 10) || 1;
    const maxVal =
        activeChart === "users"
            ? Math.max(totalUsuariosNum, actualMax, 1)
            : Math.max(actualMax, 1);

    // KPI dinámicos
    const dynamicCards = [
        {
            id: "users",
            label: "Usuarios Totales",
            value: stats.totalUsuarios,
            change: "0%",
            up: true,
            icon: Users,
            accent: "#22c55e",
            pill: "bg-green-100 text-green-700",
        },
        {
            id: "retention",
            label: "Tasa de Retención",
            value: "100%",
            change: "0%",
            up: true,
            icon: Target,
            accent: "#84cc16",
            pill: "bg-lime-100 text-lime-700",
        },
        {
            id: "queries",
            label: "Consultas IA (Hoy)",
            value: stats.consultasHoy.toString(),
            change: "0%",
            up: true,
            icon: Sparkles,
            accent: "#10b981",
            pill: "bg-emerald-100 text-emerald-700",
        },
        {
            id: "avg_points",
            label: "Puntos Promedio",
            value: "0",
            change: "0%",
            up: true,
            icon: Award,
            accent: "#14b8a6",
            pill: "bg-teal-100 text-teal-700",
        },
    ];

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
                    {dynamicCards.map((kpi) => {
                        const Icon = kpi.icon;
                        const displayValue = kpi.value;
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

                                <p className="text-3xl font-black text-green-950 tracking-tight mb-1">{displayValue}</p>
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
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-bold text-green-950">{tab.label}</h2>
                                    {activeChart === "users" && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200"
                                        >
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                                            </span>
                                            <span className="text-xs font-bold text-green-700">{usuariosOnline}</span>
                                            <span className="text-xs text-green-500">en línea</span>
                                        </motion.div>
                                    )}
                                </div>
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
                                {/* Eje Y: etiquetas de porcentaje + líneas guía */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-2">
                                    {[100, 75, 50, 25, 0].map((pctLabel) => (
                                        <div key={pctLabel} className="flex items-center gap-1">
                                            <span className="w-7 text-right text-[9px] font-semibold text-green-300 shrink-0">
                                                {pctLabel}%
                                            </span>
                                            <div className="flex-1 h-px border-t border-dashed border-green-100" />
                                        </div>
                                    ))}
                                </div>

                                {/* Barras */}
                                <div className="flex items-stretch gap-1.5 h-56 pb-8 pl-7 pt-2">
                                    {bars.map((bar, i) => {
                                        const pct = maxVal > 0 ? (bar.value / maxVal) * 100 : 0;
                                        const barPct = bar.value > 0 ? Math.max(pct, 4) : 3;
                                        return (
                                            <div key={bar.label} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                                                {/* Tooltip valor */}
                                                {bar.value > 0 && (
                                                    <span className="absolute top-0 text-[10px] font-bold text-green-700 opacity-0 group-hover:opacity-100 transition-all bg-green-50 rounded px-1 z-10 whitespace-nowrap">
                                                        {bar.value}
                                                    </span>
                                                )}
                                                {/* Barra */}
                                                <motion.div
                                                    initial={{ scaleY: 0 }}
                                                    animate={{ scaleY: 1 }}
                                                    transition={{ duration: 0.5, delay: i * 0.035, ease: [0.34, 1.1, 0.64, 1] }}
                                                    className="w-full rounded-t-md cursor-default"
                                                    style={{
                                                        height: `${barPct}%`,
                                                        background: bar.value < 1
                                                            ? "#f0fdf4"
                                                            : `linear-gradient(to top, ${tab.color}55, ${tab.color})`,
                                                        transformOrigin: "bottom",
                                                    }}
                                                />
                                                {/* Label mes */}
                                                <span className="text-[9px] text-green-300 font-medium absolute -bottom-6">{bar.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {allZero && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pb-8 gap-2">
                                        <Activity className="w-8 h-8 text-green-100" />
                                        <p className="text-sm text-green-300 font-medium">Sin datos aún</p>
                                        <p className="text-xs text-green-200">Esperando actividad para generar la gráfica...</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-4 pt-4 border-t border-green-50 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-green-400">
                                <div className="w-3 h-3 rounded-sm" style={{ background: tab.color }} />
                                {activeChart === "users"
                                    ? `Usuarios activos · ${PERIODS.find((p) => p.id === period)?.label}`
                                    : `${tab.label} · ${PERIODS.find((p) => p.id === period)?.label}`
                                }
                            </div>
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
                            {[
                                { label: "Mejor mes", value: stats.mejorMes, icon: Award, color: "text-lime-500" },
                                { label: "Pico diario", value: stats.picoDiario, icon: Zap, color: "text-green-500" },
                                { label: "Nuevos hoy", value: stats.nuevosHoy, icon: Users, color: "text-emerald-500" },
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
                    </div>
                </div>

                

            </div>
        </div>
    );
}
import { useSocket } from "../../context/SocketContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useState, useEffect } from "react";
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
    UserPlus, Trash2, Ban, CheckCircle, Image as ImageIcon, Key, Settings, ClipboardList
} from "lucide-react";
import { KpiSkeleton, TableSkeleton } from "./AdminSkeletons";
import AuditModal from "./AuditModal";


const kpis = [
    {
        id: "users",
        label: "Usuarios Totales",
        value: "0",
        change: "+0%",
        up: true,
        icon: Users,
        color: "from-green-500 to-emerald-600",
        bg: "from-green-50 to-emerald-50",
        border: "border-green-200",
    },
    {
        id: "active",
        label: "Usuarios en Línea",
        value: null,
        change: "En vivo",
        up: true,
        icon: Activity,
        color: "from-lime-500 to-green-500",
        bg: "from-lime-50 to-green-50",
        border: "border-lime-200",
    },
    {
        id: "queries",
        label: "Consultas IA Hoy",
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
        value: "0",
        change: "+0%",
        up: false,
        icon: Globe,
        color: "from-emerald-500 to-green-600",
        bg: "from-emerald-50 to-green-50",
        border: "border-emerald-200",
    },
];

const topUsers = [];

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
};
const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function AdminHero() {
    const { usuariosOnline, socket } = useSocket();
    const { token, usuario } = useAuth();
    const storageKey = `audit_hidden_${usuario?._id || usuario?.id || 'unknown'}`;
    const [totalUsuarios, setTotalUsuarios] = useState(0);
    const [consultasHoy, setConsultasHoy] = useState(0);
    const [totalPuntos, setTotalPuntos] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [allLogs, setAllLogs] = useState([]);
    const [showAudit, setShowAudit] = useState(false);

    // Estado de ocultos compartido entre panel y modal
    const [hiddenIds, setHiddenIds] = useState(() => {
        try {
            const saved = localStorage.getItem(`audit_hidden_${usuario?._id || usuario?.id || 'unknown'}`);
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch { return new Set(); }
    });

    // recentActivity derivado reactivamente
    const recentActivity = allLogs
        .filter(l => !hiddenIds.has(String(l._id)))
        .slice(0, 5)
        .map(log => ({
            _id: log._id,
            user: log.user,
            action: log.details,
            time: new Date(log.createdAt).toLocaleDateString() + ' ' + new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            type: log.type
        }));

    // Callback para que el modal actualice el estado compartido
    const handleHideChange = (newHiddenSet) => {
        setHiddenIds(new Set(newHiddenSet));
    };

    const fetchStats = async () => {
        if (!token) return;
        setRefreshing(true);
        try {
            const [resStats, resAudit] = await Promise.all([
                fetch('http://localhost:3000/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch('http://localhost:3000/api/admin/audit', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const [data, dataAudit] = await Promise.all([
                resStats.json(),
                resAudit.json()
            ]);

            if (data.success) {
                setTotalUsuarios(data.totalUsuarios);
                setConsultasHoy(data.consultasHoy || 0);
                setTotalPuntos(data.totalPuntos || 0);
            }

            if (dataAudit.success) {
                setAllLogs(dataAudit.logs);
            }

        } catch (error) {
            console.error('Error al obtener stats:', error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (token) fetchStats();
    }, [token]);

    useEffect(() => {
        if (!socket) return;
        
        // Refrescar automáticamente cuando llega un nuevo log
        socket.on('admin:audit_update', () => {
            console.log('🔄 Nuevo evento de auditoría detectado');
            fetchStats();
        });

        return () => {
            socket.off('admin:audit_update');
        };
    }, [socket]);

    const now = new Date().toLocaleDateString("es-CO", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    return (
        <>
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-green-50/60 via-white to-emerald-50/40 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pr-24 min-h-[84px]"
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
                        whileHover={{ y: -5, scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        onClick={fetchStats}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-green-200 text-green-700 text-sm font-medium shadow-sm hover:shadow-md hover:border-green-400 transition-all disabled:opacity-60"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Actualizando...' : 'Actualizar'}
                    </motion.button>
                </motion.div>

                {/* KPI Cards */}
                {refreshing ? (
                    <KpiSkeleton />
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10"
                    >
                        {kpis.map((kpi) => {
                            const Icon = kpi.icon;
                            const displayValue = kpi.id === 'active'
                                ? usuariosOnline
                                : kpi.id === 'users'
                                    ? totalUsuarios
                                    : kpi.id === 'queries'
                                        ? consultasHoy
                                        : kpi.id === 'points'
                                            ? totalPuntos
                                            : kpi.value;
                            const isLive = kpi.id === 'active';

                            return (
                                <motion.div
                                    key={kpi.id}
                                    variants={cardVariants}
                                    whileHover={{ y: -4 }}
                                    className={`relative bg-gradient-to-br ${kpi.bg} border ${kpi.border} rounded-2xl p-5 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300`}
                                >
                                    <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${kpi.color} opacity-10`} />

                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-md`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
                                            ${isLive
                                                ? 'bg-lime-100 text-lime-700'
                                                : kpi.up
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-600'
                                            }`}>
                                            {isLive ? (
                                                <>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                                                    En vivo
                                                </>
                                            ) : kpi.up ? (
                                                <><ArrowUpRight className="w-3 h-3" />{kpi.change}</>
                                            ) : (
                                                <><ArrowDownRight className="w-3 h-3" />{kpi.change}</>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-3xl font-bold text-green-900 mb-1">{displayValue}</p>
                                    <p className="text-sm text-green-600 font-medium">{kpi.label}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {/* Lower Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="lg:col-span-3 bg-white rounded-2xl border border-green-100 shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-green-900 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-green-500" />
                                Actividad Reciente
                            </h2>
                            <button
                                onClick={() => setShowAudit(true)}
                                className="text-sm text-green-600 hover:text-green-800 font-semibold transition-colors flex items-center gap-1"
                            >
                                Ver todo
                            </button>
                        </div>
                        {refreshing ? (
                            <TableSkeleton rows={4} />
                        ) : recentActivity.length === 0 ? (
                            <EmptyState icon={Activity} message="No hay actividad reciente aún." />
                        ) : (
                            <div className="space-y-3">
                                {recentActivity.map((act, i) => (
                                    <ActivityRow key={i} {...act} />
                                ))}
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="lg:col-span-2 bg-white rounded-2xl border border-green-100 shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-green-900 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-lime-500" />
                                Top Usuarios
                            </h2>
                        </div>
                        {refreshing ? (
                            <TableSkeleton rows={4} />
                        ) : topUsers.length === 0 ? (
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
                    transition={{ duration: 0.4 }}
                    className="mt-6 bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Gamepad2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white font-semibold">Eco-Juego activo</p>
                            <p className="text-green-200 text-sm">0 misiones disponibles ahora mismo</p>
                        </div>
                    </div>
                    <button className="px-5 py-2.5 rounded-full bg-white text-green-700 font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all">
                        Administrar Juego
                    </button>
                </motion.div>
            </div>
        </div>

        {/* Audit Modal */}
        {showAudit && (
            <AuditModal
                logs={allLogs}
                hiddenIds={hiddenIds}
                onClose={() => setShowAudit(false)}
                onRefresh={fetchStats}
                onHideChange={handleHideChange}
            />
        )}
    </>
    );
}

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
    const TYPE_CONFIG = {
        register:    { label: "Registro",     cls: "bg-lime-100 text-lime-700",     icon: UserPlus },
        delete:      { label: "Eliminación",  cls: "bg-red-100 text-red-600",       icon: Trash2 },
        ban:         { label: "Ban",          cls: "bg-orange-100 text-orange-700", icon: Ban },
        unban:       { label: "Desban",       cls: "bg-sky-100 text-sky-700",       icon: CheckCircle },
        slide:       { label: "Slide",        cls: "bg-green-100 text-green-700",   icon: ImageIcon },
        role_change: { label: "Rol",          cls: "bg-purple-100 text-purple-700", icon: Key },
        system:      { label: "Sistema",      cls: "bg-gray-100 text-gray-600",     icon: Settings },
    };
    const cfg = TYPE_CONFIG[type] || { label: type, cls: "bg-gray-100 text-gray-500", icon: ClipboardList };
    const IconComp = cfg.icon;

    return (
        <div className="flex items-center gap-3 py-2.5 border-b border-green-50 last:border-0">
            <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${cfg.cls}`}>
                <IconComp className="w-3.5 h-3.5" />
                {cfg.label}
            </span>
            <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-green-900">{user}</span>
                <span className="text-sm text-green-500 ml-1">· {action}</span>
            </div>
            <span className="text-xs text-green-400 shrink-0">{time}</span>
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
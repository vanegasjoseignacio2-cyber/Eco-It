import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import Toast from "../ui/Toast";
import {
    Users, Search, Filter, MoreVertical,
    UserCheck, UserX, Trash2, RefreshCw,
    Mail, ShieldCheck, ShieldOff, Zap, AlertTriangle,
} from "lucide-react";

/* ─── Estilos badge ───────────────────────────────────────────────────────── */
const STATUS_STYLES = {
    active:   { label: "Activo",   cls: "bg-emerald-100 text-emerald-700 border border-emerald-200/80" },
    inactive: { label: "Inactivo", cls: "bg-gray-100 text-gray-500 border border-gray-200/80" },
    banned:   { label: "Baneado",  cls: "bg-red-100 text-red-600 border border-red-200/80" },
};
const ROLE_STYLES = {
    superadmin: { label: "Super Admin", cls: "bg-teal-100 text-teal-700 border border-teal-200/80 font-semibold" },
    admin: { label: "Admin",   cls: "bg-lime-100 text-lime-700 border border-lime-200/80 font-semibold" },
    user:  { label: "Usuario", cls: "bg-teal-50 text-teal-600 border border-teal-100" },
};
const AVATAR_GRADIENTS = [
    "from-lime-400 to-green-500",
    "from-teal-400 to-emerald-500",
    "from-green-400 to-cyan-500",
    "from-emerald-400 to-teal-600",
    "from-lime-300 to-green-600",
];

/* ─── Modal de confirmación / input reutilizable ──────────────────────────── */
function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Confirmar", danger = false, children }) {
    if (!isOpen) return null;
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/20 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 12 }}
                    transition={{ type: "spring", stiffness: 340, damping: 28 }}
                    className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4"
                    style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.14), 0 0 0 1px rgba(74,222,128,0.12)" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3 className="font-bold text-green-900 text-base mb-1.5 flex items-center gap-2">
                        {danger
                            ? <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            : <Zap className="w-4 h-4 text-lime-500 flex-shrink-0" />}
                        {title}
                    </h3>
                    {message && <p className="text-sm text-green-600/80 mb-4 leading-relaxed">{message}</p>}
                    {children}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={onConfirm}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                danger
                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                    : "bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white"
                            }`}
                        >
                            {confirmLabel}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-green-50 hover:bg-green-100 text-green-700 transition-all"
                        >
                            Cancelar
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/* ─── Componente principal ────────────────────────────────────────────────── */
export default function AdminUsers() {
    const { token, usuario: currentUser } = useAuth();
    const { socket }                      = useSocket();
    const [users, setUsers]               = useState([]);
    const [loading, setLoading]           = useState(true);
    const [search, setSearch]             = useState("");
    const [filterRole, setFilterRole]     = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [openMenu, setOpenMenu]         = useState(null);
    const [toast, setToast]               = useState({ message: "", type: "success" });

    /* Modales */
    const [deleteModal, setDeleteModal] = useState({ open: false, userId: null, nombre: "" });
    const [banModal, setBanModal]       = useState({ open: false, userId: null, nombre: "" });
    const [banDias, setBanDias]         = useState("7");

    const showToast  = (message, type = "success") => setToast({ message, type });
    const closeToast = () => setToast({ message: "", type: "success" });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res  = await fetch("http://localhost:3000/api/admin/usuarios", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) setUsers(data.usuarios);
        } catch {
            showToast("No se pudo cargar la lista de usuarios", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        if (token) fetchUsers(); 
    }, [token]);

    useEffect(() => {
        if (!socket) return;
        const handleStatus = ({ userId, isOnline }) => {
            setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isOnline } : u)));
        };
        socket.on("usuario:estado", handleStatus);
        return () => socket.off("usuario:estado", handleStatus);
    }, [socket]);

    /* Cerrar dropdown al click fuera */
    useEffect(() => {
        const handler = () => setOpenMenu(null);
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    /* ── Acciones ── */
    const confirmDelete = async () => {
        const { userId, nombre } = deleteModal;
        setDeleteModal({ open: false, userId: null, nombre: "" });
        try {
            const res  = await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setUsers((prev) => prev.filter((u) => u._id !== userId));
                showToast(`${nombre} fue eliminado correctamente`, "success");
            } else {
                showToast(data.mensaje || "Error al eliminar usuario", "error");
            }
        } catch {
            showToast("Ocurrió un error al eliminar.", "error");
        }
    };

    const confirmBan = async () => {
        const { userId, nombre } = banModal;
        const dias = parseInt(banDias);
        setBanModal({ open: false, userId: null, nombre: "" });
        if (!dias || dias < 1) return;
        try {
            const res  = await fetch(`http://localhost:3000/api/admin/users/${userId}/ban`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ dias }),
            });
            const data = await res.json();
            if (data.success) {
                setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, status: "banned", banHasta: data.usuario.banHasta } : u));
                showToast(`${nombre} baneado por ${dias} días`, "warning");
            } else {
                showToast(data.mensaje || "Error al banear", "error");
            }
        } catch {
            showToast("Error al intentar banear.", "error");
        }
    };

    const handleUnbanUser = async (userId, nombre) => {
        try {
            const res  = await fetch(`http://localhost:3000/api/admin/users/${userId}/unban`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, status: "active", banHasta: null } : u));
                showToast(`${nombre} fue desbaneado correctamente`, "success");
            } else {
                showToast(data.mensaje || "Error al desbanear", "error");
            }
        } catch {
            showToast("Error al intentar desbanear.", "error");
        }
    };

    const handleToggleAdmin = async (userId, nombre, rolActual) => {
        const nuevoRol = rolActual === "admin" ? "user" : "admin";
        try {
            const res  = await fetch(`http://localhost:3000/api/admin/users/${userId}/role`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ rol: nuevoRol }),
            });
            const data = await res.json();
            if (data.success) {
                setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, rol: nuevoRol } : u));
                showToast(
                    nuevoRol === "admin"
                        ? `${nombre} ahora es Administrador`
                        : `${nombre} dejó de ser Administrador`,
                    "info"
                );
            } else {
                showToast(data.mensaje || "Error al cambiar rol", "error");
            }
        } catch {
            showToast("Error al cambiar el rol.", "error");
        }
    };


    const filtered = users.filter((u) => {
        const fullName    = `${u.nombre || ""} ${u.apellido || ""}`.toLowerCase();
        const email       = (u.email || "").toLowerCase();
        const matchSearch = fullName.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
        const matchRole   = filterRole   === "all" || u.rol === filterRole;
        const computedStatus = u.status === "banned" ? "banned" : (u.isOnline ? "active" : "inactive");
        const matchStatus = filterStatus === "all" || computedStatus === filterStatus;
        return matchSearch && matchRole && matchStatus;
    });

    return (
        <>
            <style>{`
                .users-scroll::-webkit-scrollbar { width: 5px; }
                .users-scroll::-webkit-scrollbar-track { background: transparent; }
                .users-scroll::-webkit-scrollbar-thumb { background: rgba(74,222,128,0.3); border-radius: 99px; }
                .users-scroll::-webkit-scrollbar-thumb:hover { background: rgba(74,222,128,0.55); }
                .user-row { transition: background 0.15s ease, box-shadow 0.15s ease; }
                .user-row:hover { background: linear-gradient(90deg,rgba(240,253,244,0.95),rgba(236,253,245,0.5)); box-shadow: inset 3px 0 0 #4ade80; }
                .filter-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2322c55e' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px !important; }
            `}</style>

            {/* Toast global */}
            <Toast message={toast.message} type={toast.type} onClose={closeToast} />

            {/* Modal eliminar */}
            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, userId: null, nombre: "" })}
                onConfirm={confirmDelete}
                title="Eliminar usuario"
                message={`¿Seguro que deseas eliminar a ${deleteModal.nombre}? Esta acción es permanente y no se puede deshacer.`}
                confirmLabel="Sí, eliminar"
                danger
            />

            {/* Modal banear */}
            <ConfirmModal
                isOpen={banModal.open}
                onClose={() => setBanModal({ open: false, userId: null, nombre: "" })}
                onConfirm={confirmBan}
                title={`Banear a ${banModal.nombre}`}
                confirmLabel="Aplicar ban"
            >
                <div>
                    <label className="text-xs font-semibold text-green-700 uppercase tracking-wide block mb-1.5">
                        Duración del ban (días)
                    </label>
                    <input
                        type="number" min="1" max="365"
                        value={banDias}
                        onChange={(e) => setBanDias(e.target.value)}
                        className="w-full border border-green-200 rounded-xl px-3 py-2.5 text-sm text-green-900 focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition-all"
                    />
                </div>
            </ConfirmModal>

            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-green-50/60 via-white to-emerald-50/40 min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-8">

                    {/* ── Header ── */}
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
                    >
                        <div>
                            <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center shadow-sm">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                Gestión de Usuarios
                            </h1>
                            <p className="text-green-500 mt-1 text-sm pl-0.5">
                                {loading ? "Cargando usuarios..." : users.length === 0
                                    ? "Sin usuarios registrados aún"
                                    : <><span className="font-semibold text-green-700">{filtered.length}</span> de {users.length} usuarios</>}
                            </p>
                        </div>
                        <motion.button
                            onClick={fetchUsers}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-green-200 text-green-700 text-sm font-medium hover:shadow-md hover:border-green-300 transition-all"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                            Actualizar
                        </motion.button>
                    </motion.div>

                    {/* ── Filtros ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="flex flex-col sm:flex-row gap-3 mb-5"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-green-200 bg-white text-green-900 text-sm placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition-all shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400 pointer-events-none" />
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="filter-select pl-10 py-2.5 rounded-xl border border-green-200 bg-white text-green-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/40 cursor-pointer shadow-sm"
                            >
                                <option value="all">Todos los roles</option>
                                <option value="user">Usuario</option>
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super admin</option>
                            </select>
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="filter-select px-4 py-2.5 rounded-xl border border-green-200 bg-white text-green-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/40 cursor-pointer shadow-sm"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="active">Activo</option>
                            <option value="inactive">Inactivo</option>
                            <option value="banned">Baneado</option>
                        </select>
                    </motion.div>

                    {/* ── Tabla ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-2xl border border-green-100 overflow-hidden"
                        style={{ boxShadow: "0 4px 28px rgba(74,222,128,0.09), 0 1px 4px rgba(0,0,0,0.04)" }}
                    >
                        {/* Cabecera fija */}
                        <div className="grid grid-cols-12 gap-2 px-6 py-3.5 bg-gradient-to-r from-green-50 to-emerald-50/50 border-b border-green-100 text-xs font-semibold text-green-600 uppercase tracking-wider">
                            <div className="col-span-4">Usuario</div>
                            <div className="col-span-2">Rol</div>
                            <div className="col-span-2">Estado</div>
                            <div className="col-span-2">Puntos</div>
                            <div className="col-span-1">Registro</div>
                            <div className="col-span-1 text-right">Acc.</div>
                        </div>

                        {/* Lista scrollable */}
                        <div className="users-scroll overflow-y-auto" style={{ maxHeight: "500px" }}>
                            {loading ? (
                                <div className="py-20 flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin" />
                                    <p className="text-green-500 font-medium text-sm">Cargando usuarios...</p>
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-3">
                                    <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
                                        <Users className="w-7 h-7 text-green-200" />
                                    </div>
                                    <p className="text-green-400 font-medium text-sm">No hay usuarios para mostrar</p>
                                    <p className="text-green-300 text-xs">Intenta ajustar los filtros</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {filtered.map((user, i) => (
                                        <UserRow
                                            key={user._id}
                                            user={user}
                                            index={i}
                                            isOpen={openMenu === user._id}
                                            onToggleMenu={(e) => {
                                                e.stopPropagation();
                                                setOpenMenu(openMenu === user._id ? null : user._id);
                                            }}
                                            onCloseMenu={() => setOpenMenu(null)}
                                            onBan={() => {
                                                setBanDias("7");
                                                setBanModal({ open: true, userId: user._id, nombre: `${user.nombre || ""} ${user.apellido || ""}`.trim() });
                                            }}
                                            onUnban={() => handleUnbanUser(user._id, `${user.nombre || ""} ${user.apellido || ""}`.trim())}
                                            onDelete={() => setDeleteModal({ open: true, userId: user._id, nombre: `${user.nombre || ""} ${user.apellido || ""}`.trim() })}
                                            onToggleAdmin={() => handleToggleAdmin(user._id, `${user.nombre || ""} ${user.apellido || ""}`.trim(), user.rol)}
                                            currentUserRole={currentUser?.rol}
                                            currentUserId={currentUser?._id}
                                        />
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer */}
                        {!loading && filtered.length > 0 && (
                            <div className="px-6 py-2.5 border-t border-green-50/80 bg-green-50/30 flex items-center justify-between">
                                <p className="text-xs text-green-400 flex items-center gap-1.5">
                                    <Zap className="w-3 h-3" />
                                    {filtered.length} {filtered.length === 1 ? "usuario" : "usuarios"} mostrados
                                </p>
                                <p className="text-xs text-green-300">↕ Scroll para ver más</p>
                            </div>
                        )}
                    </motion.div>

                </div>
            </div>
        </>
    );
}

/* ─── Fila de usuario ─────────────────────────────────────────────────────── */
function UserRow({ user, index, isOpen, onToggleMenu, onCloseMenu, onDelete, onBan, onUnban, onToggleAdmin, currentUserRole, currentUserId }) {
    const btnRef             = useRef(null);
    const [menuPos, setMenuPos] = useState({});

    const userStatus     = user.status === "banned" ? "banned" : (user.isOnline ? "active" : "inactive");
    const status         = STATUS_STYLES[userStatus] || STATUS_STYLES.inactive;
    const role           = ROLE_STYLES[user.rol]     || ROLE_STYLES.user;
    const nombreCompleto = `${user.nombre || ""} ${user.apellido || ""}`.trim() || "Usuario";
    const initials       = nombreCompleto.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??";
    const colorIdx       = nombreCompleto.charCodeAt(0) % AVATAR_GRADIENTS.length;

    const isSelf = currentUserId === user._id;
    const canDelete = !isSelf && user.rol !== "superadmin" && !(currentUserRole === "admin" && user.rol === "admin");
    const canBan = !isSelf && user.rol !== "superadmin" && user.rol !== "admin";

    /* Calcular posición del menú usando coordenadas absolutas del botón */
    useEffect(() => {
        if (isOpen && btnRef.current) {
            const r          = btnRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - r.bottom;
            const left       = Math.min(r.right - 192, window.innerWidth - 208);
            setMenuPos(spaceBelow > 170
                ? { top: r.bottom + 6, left }
                : { bottom: window.innerHeight - r.top + 6, left });
        }
    }, [isOpen]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ delay: Math.min(index * 0.04, 0.35) }}
            className="user-row relative grid grid-cols-12 gap-2 px-6 py-3.5 border-b border-green-50/80 last:border-0 items-center"
        >
            {/* Avatar + nombre */}
            <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${AVATAR_GRADIENTS[colorIdx]} flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0`}>
                    {user.avatar
                        ? <img src={user.avatar} alt={nombreCompleto} className="w-full h-full rounded-xl object-cover" />
                        : initials}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-green-900 truncate leading-tight">{nombreCompleto}</p>
                    <p className="text-xs text-green-400 truncate flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                    </p>
                </div>
            </div>

            {/* Rol */}
            <div className="col-span-2">
                <span className={`text-xs px-2.5 py-1 rounded-lg ${role.cls}`}>{role.label}</span>
            </div>

            {/* Estado */}
            <div className="col-span-2">
                <span className={`text-xs px-2.5 py-1 rounded-lg ${status.cls}`}>{status.label}</span>
            </div>

            {/* Puntos */}
            <div className="col-span-2">
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-green-100 overflow-hidden max-w-14">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(((user.puntos || 0) / 1000) * 100, 100)}%` }}
                            transition={{ delay: Math.min(index * 0.04, 0.35) + 0.3, duration: 0.7, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-lime-400 to-green-500"
                        />
                    </div>
                    <span className="text-xs text-green-700 font-semibold tabular-nums">{user.puntos || 0}</span>
                </div>
            </div>

            {/* Fecha */}
            <div className="col-span-1">
                <span className="text-xs text-green-400 tabular-nums">
                    {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("es-CO", { month: "short", day: "numeric" })
                        : "—"}
                </span>
            </div>

            {/* Botón menú */}
            <div className="col-span-1 flex justify-end">
                <button
                    ref={btnRef}
                    onClick={onToggleMenu}
                    className="p-1.5 rounded-lg hover:bg-green-100 text-green-500 transition-colors"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>


            </div>

            {/* Dropdown con posición fixed — siempre visible sobre el scroll */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: -6 }}
                        transition={{ duration: 0.14, ease: "easeOut" }}
                        className="fixed z-[9999] bg-white rounded-2xl py-1.5 min-w-48 overflow-hidden"
                        style={{
                            ...menuPos,
                            boxShadow: "0 8px 40px rgba(0,0,0,0.13), 0 2px 8px rgba(74,222,128,0.1), 0 0 0 1px rgba(74,222,128,0.14)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Mini header */}
                        <div className="px-4 py-2.5 border-b border-green-50 mb-1 flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${AVATAR_GRADIENTS[colorIdx]} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-green-900 truncate leading-tight">{nombreCompleto}</p>
                                <p className="text-[10px] text-green-400 truncate">{user.email}</p>
                            </div>
                        </div>

                        {currentUserRole === 'superadmin' && user.rol !== 'superadmin' && (
                            <MenuBtn
                                icon={user.rol === "admin" ? ShieldOff : ShieldCheck}
                                label={user.rol === "admin" ? "Quitar admin" : "Hacer admin"}
                                color="text-lime-700"
                                hoverBg="hover:bg-lime-50"
                                onClick={() => { onCloseMenu(); onToggleAdmin(); }}
                            />
                        )}

                        {canBan && (
                            userStatus === "banned" ? (
                                <MenuBtn
                                    icon={UserCheck}
                                    label="Desbanear usuario"
                                    color="text-amber-600"
                                    hoverBg="hover:bg-amber-50"
                                    onClick={() => { onCloseMenu(); onUnban(); }}
                                />
                            ) : (
                                <MenuBtn
                                    icon={UserX}
                                    label="Banear usuario"
                                    color="text-amber-600"
                                    hoverBg="hover:bg-amber-50"
                                    onClick={() => { onCloseMenu(); onBan(); }}
                                />
                            )
                        )}

                        {canDelete && (
                            <>
                                <div className="mx-3 my-1 border-t border-green-50" />
                                <MenuBtn
                                    icon={Trash2}
                                    label="Eliminar usuario"
                                    color="text-red-500"
                                    hoverBg="hover:bg-red-50"
                                    onClick={() => { onCloseMenu(); onDelete(); }}
                                />
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ─── Botón del menú ──────────────────────────────────────────────────────── */
function MenuBtn({ icon: Icon, label, color, hoverBg = "hover:bg-green-50", onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium ${color} ${hoverBg} transition-colors`}
        >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
        </button>
    );
}
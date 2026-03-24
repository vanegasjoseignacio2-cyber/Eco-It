import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    UserCheck,
    UserX,
    Trash2,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Download,
    Mail,
    ShieldCheck,
    ShieldOff,
    Eye,
} from "lucide-react";

const STATUS_STYLES = {
    active: { label: "Activo", cls: "bg-green-100 text-green-700" },
    inactive: { label: "Inactivo", cls: "bg-gray-100 text-gray-500" },
    banned: { label: "Baneado", cls: "bg-red-100 text-red-600" },
};

const ROLE_STYLES = {
    admin: { label: "Admin", cls: "bg-lime-100 text-lime-700 font-semibold" },
    user: { label: "Usuario", cls: "bg-emerald-50 text-emerald-600" },
};

export default function AdminUsers() {
    const { token, usuario: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [openMenu, setOpenMenu] = useState(null);
    const [page, setPage] = useState(1);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/admin/usuarios', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setUsers(data.usuarios);
            }
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario de manera permanente?")) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            });
            const data = await res.json();

            if (data.success) {
                setUsers((prevUsers) => prevUsers.filter(user => user._id !== userId));
                alert("Usuario eliminado correctamente");
            } else {
                alert(data.mensaje || "Error al eliminar usuario");
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert("Ocurrió un error al intentar eliminar al usuario.");
        }
    };

    const handleBanUser = async (userId) => {
        const diasDelBaneo = window.prompt("¿Por cuántos días deseas banear a este usuario?", "7");
        if (!diasDelBaneo) return;

        try {
            const res = await fetch(`http://localhost:3000/api/admin/users/${userId}/ban`, {
                method: 'PATCH',
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dias: parseInt(diasDelBaneo) })
            });
            const data = await res.json();

            if (data.success) {
                setUsers((prev) => prev.map(u => u._id === userId ? { ...u, status: 'banned', banHasta: data.usuario.banHasta } : u));
                alert(`Usuario baneado por ${diasDelBaneo} días.`);
            } else {
                alert(data.mensaje || "Error al banear usuario");
            }
        } catch (error) {
            console.error('Error al banear:', error);
            alert("Ocurrió un error al intentar banear al usuario.");
        }
    };

    const handleUnbanUser = async (userId) => {
        if (!window.confirm("¿Seguro que deseas desbanear a este usuario?")) return;

        try {
            const res = await fetch(`http://localhost:3000/api/admin/users/${userId}/unban`, {
                method: 'PATCH',
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            });
            const data = await res.json();

            if (data.success) {
                setUsers((prev) => prev.map(u => u._id === userId ? { ...u, status: 'active', banHasta: null } : u));
                alert("Usuario desbaneado correctamente.");
            } else {
                alert(data.mensaje || "Error al desbanear usuario");
            }
        } catch (error) {
            console.error('Error al desbanear:', error);
            alert("Ocurrió un error al intentar desbanear al usuario.");
        }
    };

    const handleChangeRole = async (userId, currentRole) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        if (!window.confirm(`¿Seguro que deseas cambiar el rol a ${newRole}?`)) return;

        try {
            const res = await fetch(`http://localhost:3000/api/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rol: newRole })
            });
            const data = await res.json();

            if (data.success) {
                setUsers((prev) => prev.map(u => u._id === userId ? { ...u, rol: newRole } : u));
                alert(`Rol actualizado a ${newRole} exitosamente.`);
            } else {
                alert(data.mensaje || "Error al cambiar de rol");
            }
        } catch (error) {
            console.error('Error al cambiar rol:', error);
            alert("Ocurrió un error al intentar cambiar el rol del usuario.");
        }
    };

    // Filtrado local (eliminar cuando haya BD real)
    const filtered = users.filter((u) => {
        const fullName = `${u.nombre || ''} ${u.apellido || ''}`.toLowerCase();
        const email = (u.email || '').toLowerCase();
        const matchSearch =
            fullName.includes(search.toLowerCase()) ||
            email.includes(search.toLowerCase());
        const matchRole = filterRole === "all" || u.rol === filterRole;
        const matchStatus = filterStatus === "all" || (u.status || 'active') === filterStatus;
        return matchSearch && matchRole && matchStatus;
    });

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
                            <Users className="w-7 h-7 text-green-500" />
                            Gestión de Usuarios
                        </h1>
                            <p className="text-green-500 mt-1 text-sm">
                                {loading ? "Cargando usuarios..." : users.length === 0 ? "Sin usuarios registrados aún" : `${users.length} usuarios en total`}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <motion.button
                                onClick={fetchUsers}
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.4 }}
                                className="p-2.5 rounded-xl bg-white border border-green-200 text-green-600 hover:shadow-md transition-all"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </motion.button>

                        {/* TODO: onClick → exportar CSV de usuarios desde GET /api/admin/users/export */}
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-green-200 text-green-700 text-sm font-medium hover:shadow-md transition-all">
                            <Download className="w-4 h-4" />
                            Exportar
                        </button>
                    </div>
                </motion.div>

                {/* Filtros */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex flex-col sm:flex-row gap-3 mb-6"
                >
                    {/* Búsqueda */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-green-200 bg-white text-green-900 text-sm placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Filtro Rol */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400 pointer-events-none" />
                        <select
                            value={filterRole}
                            onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
                            className="pl-9 pr-4 py-2.5 rounded-xl border border-green-200 bg-white text-green-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none cursor-pointer"
                        >
                            <option value="all">Todos los roles</option>
                            <option value="user">Usuario</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Filtro Status */}
                    <select
                        value={filterStatus}
                        onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                        className="px-4 py-2.5 rounded-xl border border-green-200 bg-white text-green-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none cursor-pointer"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                        <option value="banned">Baneado</option>
                    </select>
                </motion.div>

                {/* Tabla */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden"
                >
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 text-xs font-semibold text-green-600 uppercase tracking-wide">
                        <div className="col-span-4">Usuario</div>
                        <div className="col-span-2">Rol</div>
                        <div className="col-span-2">Estado</div>
                        <div className="col-span-2">Puntos</div>
                        <div className="col-span-1">Registro</div>
                        <div className="col-span-1 text-right">Acc.</div>
                    </div>
                        {/* Rows */}
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                                    <p className="text-green-500 font-medium">Cargando usuarios...</p>
                                </div>
                            ) : filtered.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-20 gap-3"
                                >
                                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                                        <Users className="w-8 h-8 text-green-200" />
                                    </div>
                                    <p className="text-green-400 font-medium">No hay usuarios para mostrar</p>
                                    <p className="text-green-300 text-sm">
                                        Intenta ajustar los filtros de búsqueda
                                    </p>
                                </motion.div>
                            ) : (
                                filtered.map((user, i) => (
                                    <UserRow
                                        key={user._id}
                                        user={user}
                                        index={i}
                                        isOpen={openMenu === user._id}
                                        onToggleMenu={() => setOpenMenu(openMenu === user._id ? null : user._id)}
                                        onCloseMenu={() => setOpenMenu(null)}
                                        onBan={() => handleBanUser(user._id)}
                                        onUnban={() => handleUnbanUser(user._id)}
                                        onDelete={() => handleDeleteUser(user._id)}
                                        onChangeRole={() => handleChangeRole(user._id, user.rol)}
                                        currentUserRole={currentUser?.rol}
                                    />
                                ))
                            )}
                        </AnimatePresence>
                </motion.div>

                {/* Paginación */}
                {/* TODO: totalPages → res.data.pages desde BD */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-between mt-5 px-1"
                >
                    <p className="text-sm text-green-500">
                        {/* TODO: mostrando X - Y de TOTAL */}
                        Página {page} de 1
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="p-2 rounded-lg border border-green-200 text-green-600 disabled:opacity-30 hover:bg-green-50 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            disabled /* TODO: disabled={page >= totalPages} */
                            onClick={() => setPage((p) => p + 1)}
                            className="p-2 rounded-lg border border-green-200 text-green-600 disabled:opacity-30 hover:bg-green-50 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

/* ─── Sub-componente fila de usuario ──────────────────────────────────────── */
function UserRow({ user, index, isOpen, onToggleMenu, onCloseMenu, onDelete, onBan, onUnban, onChangeRole, currentUserRole }) {
    const userStatus = user.status || 'active';
    const status = STATUS_STYLES[userStatus];
    const role = ROLE_STYLES[user.rol] || ROLE_STYLES.user;
    const nombreCompleto = `${user.nombre || ''} ${user.apellido || ''}`.trim() || "Usuario";

    const initials = nombreCompleto
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "??";

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative grid grid-cols-12 gap-2 px-6 py-4 border-b border-green-50 last:border-0 hover:bg-green-50/40 transition-colors items-center"
        >
            {/* Avatar + nombre */}
                <div className="col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                        {user.avatar
                            ? <img src={user.avatar} alt={nombreCompleto} className="w-full h-full rounded-full object-cover" />
                            : initials
                        }
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-green-900 truncate">{nombreCompleto}</p>
                        <p className="text-xs text-green-400 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {user.email}
                        </p>
                    </div>
                </div>

            {/* Rol */}
            <div className="col-span-2">
                <span className={`text-xs px-2.5 py-1 rounded-full ${role.cls}`}>{role.label}</span>
            </div>

            {/* Estado */}
            <div className="col-span-2">
                <span className={`text-xs px-2.5 py-1 rounded-full ${status.cls}`}>{status.label}</span>
            </div>

                {/* Puntos */}
                <div className="col-span-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full bg-green-100 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-lime-400 to-green-500"
                                style={{ width: `${Math.min(((user.puntos || 0) / 1000) * 100, 100)}%` }}
                            />
                        </div>
                        <span className="text-xs text-green-700 font-medium">{user.puntos || 0}</span>
                    </div>
                </div>

                {/* Fecha */}
                <div className="col-span-1">
                    <span className="text-xs text-green-400">
                        {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("es-CO", { month: "short", day: "numeric" })
                            : "—"}
                    </span>
                </div>

            {/* Acciones */}
            <div className="col-span-1 flex justify-end">
                <button
                    onClick={onToggleMenu}
                    className="p-1.5 rounded-lg hover:bg-green-100 text-green-500 transition-colors"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -8 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-6 top-12 z-30 bg-white rounded-xl shadow-xl border border-green-100 py-1.5 min-w-40 overflow-hidden"
                        >
                            {/* TODO: onClick → GET /api/admin/users/:id para ver detalle */}
                                <MenuBtn icon={Eye} label="Ver perfil" color="text-green-700" onClick={onCloseMenu} />
                                
                                {currentUserRole === 'superadmin' && user.rol !== 'superadmin' && (
                                    <MenuBtn 
                                        icon={user.rol === "admin" ? ShieldOff : ShieldCheck} 
                                        label={user.rol === "admin" ? "Quitar admin" : "Hacer admin"} 
                                        color="text-lime-700" 
                                        onClick={() => { onCloseMenu(); onChangeRole(); }} 
                                    />
                                )}
                                
                                {userStatus === "banned" ? (
                                    <MenuBtn 
                                        icon={UserCheck} 
                                        label="Desbanear" 
                                        color="text-amber-600" 
                                        onClick={() => { onCloseMenu(); onUnban(); }} 
                                    />
                                ) : (
                                    <MenuBtn 
                                        icon={UserX} 
                                        label="Banear usuario" 
                                        color="text-amber-600" 
                                        onClick={() => { onCloseMenu(); onBan(); }} 
                                    />
                                )}
                                
                                <div className="my-1 border-t border-green-50" />
                            {/* TODO: onClick → DELETE /api/admin/users/:id con confirmación */}
                            <MenuBtn 
                                icon={Trash2} 
                                label="Eliminar" 
                                color="text-red-500" 
                                onClick={() => {
                                    onCloseMenu();
                                    onDelete();
                                }} 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

function MenuBtn({ icon: Icon, label, color, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm ${color} hover:bg-green-50 transition-colors`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );
}
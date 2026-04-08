import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Restringe el acceso a rutas públicas para administradores.
 * Si el usuario es admin, es redirigido forzosamente al panel /admin.
 */
export default function AdminRestrictionGuard({ children }) {
    const { usuario, loading } = useAuth();

    if (loading) return null;

    // Si es administrador, no puede salir del panel
    if (usuario && (usuario.rol === "admin" || usuario.rol === "superadmin")) {
        return <Navigate to="/admin" replace />;
    }

    return children;
}

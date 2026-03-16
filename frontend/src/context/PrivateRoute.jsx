// src/router/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

/**
 * Protege una ruta verificando autenticación y rol.
 * @param {string} rolRequerido - "admin" | "user" | undefined (solo autenticado)
 */
export default function PrivateRoute({ children, rolRequerido }) {
    const { usuario, loading } = useAuth();

    // Mientras el login está procesando, no redirige
    if (loading) return null;

    // No autenticado → redirige al login
    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

     // Perfil incompleto
    if (!usuario.perfilCompleto && location.pathname !== "/completar-perfil") {
        return <Navigate to="/completar-perfil" replace />;
    }
    // Si YA tiene perfil completo → impedir volver a esa ruta
    if (usuario.perfilCompleto && location.pathname === "/completar-perfil") {
        return <Navigate to="/" replace />;
    }
    

    // Rol incorrecto → redirige al inicio
    if (rolRequerido && usuario.rol !== rolRequerido) {
        return <Navigate to="/" replace />;
    }

    return children;
}
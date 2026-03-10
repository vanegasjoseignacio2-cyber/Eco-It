// src/router/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; 

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

    // Rol incorrecto → redirige al inicio
    if (rolRequerido && usuario.rol !== rolRequerido) {
        return <Navigate to="/" replace />;
    }

    return children;
}
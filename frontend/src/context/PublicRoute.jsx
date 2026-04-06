import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PublicRoute({ children }) {
    const { usuario, loading } = useAuth();

    if (loading) return null;

    if (usuario) {
        return <Navigate to="/" replace />;
    }

    return children;
}
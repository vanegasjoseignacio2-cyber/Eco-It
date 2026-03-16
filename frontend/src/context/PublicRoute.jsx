import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
    const token = localStorage.getItem("token"); // o tu método de auth

    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
}
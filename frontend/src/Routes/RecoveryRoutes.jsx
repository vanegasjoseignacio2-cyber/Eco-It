import { Navigate } from "react-router-dom";

export default function RecoveryRoute({ children }) {
    const email = localStorage.getItem("recovery_email");

    if (!email) {
        return <Navigate to="/recuperar" replace />;
    }

    return children;
}
import { useState } from "react";
import AdminSidebar from "../Admin/adminSlidebar";
import AdminHero from "../Admin/adminHero";
import AdminUsers from "../Admin/adminUsers";
import AdminEstadisticas from "../Admin/adminestadistics";
import AdminEcojuego from "../Admin/adminecojuego";
import AdminMap from "../Admin/AdminMap";
import AdminImages from "../Admin/AdminImages";
import AdminSessionTracker from "../Admin/AdminSessionTracker";
import { useToast } from "../../context/ToastContext";
import { useEffect } from "react";

export default function AdminLayout() {
    const [activeSection, setActiveSection] = useState("dashboard");

    const { showToast } = useToast();

    useEffect(() => {
        // Mostrar aviso de seguridad al entrar al panel
        showToast(
            "Seguridad Activa: Sesión protegida (cierre al salir del navegador), inactividad de 5 min detectada y navegación restringida al panel.",
            "info",
            12000
        );
    }, [showToast]);

    const SECTIONS = {
        dashboard: <AdminHero />,
        users: <AdminUsers />,
        estadisticas: <AdminEstadisticas />,
        ecojuego: <AdminEcojuego />,
        maps: <AdminMap/>,
        images: <AdminImages/>
    };

    return (
        <div className="flex h-screen overflow-hidden bg-green-50">
            <AdminSessionTracker />
            <AdminSidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />
            <main className="flex-1 overflow-y-auto">
                {SECTIONS[activeSection] || <AdminHero />}
            </main>
        </div>
    );
}
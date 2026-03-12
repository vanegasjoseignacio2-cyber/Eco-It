import { useState } from "react";
import AdminSidebar from "../Admin/adminSlidebar";
import AdminHero from "../Admin/adminHero";
import AdminUsers from "../Admin/adminUsers";
import AdminEstadisticas from "../Admin/adminestadistics";
import AdminEcojuego from "../Admin/adminecojuego";
import AdminMap from "../Admin/AdminMap";

export default function AdminLayout() {
    const [activeSection, setActiveSection] = useState("dashboard");

    const SECTIONS = {
        dashboard: <AdminHero />,
        users: <AdminUsers />,
        estadisticas: <AdminEstadisticas />,
        ecojuego: <AdminEcojuego />,
        maps: <AdminMap/>
    };

    return (
        <div className="flex h-screen overflow-hidden bg-green-50">
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
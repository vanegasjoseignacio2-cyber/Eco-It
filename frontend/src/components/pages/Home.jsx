// Home.jsx
import { useState, useEffect } from "react";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import LoadingScreen from "../Layout/Animation";
import Index from "../Home/Index";
import Ecogame from "../Home/Game";
import Section from "../Home/Section";

export default function Home() {
    const [loading, setLoading] = useState(() => {
        // Solo mostrar loading si no se ha visto antes en esta sesión
        return !sessionStorage.getItem('hasSeenLoading');
    });

    useEffect(() => {
        if (loading) {
            // Marcar que ya se vio la animación
            sessionStorage.setItem('hasSeenLoading', 'true');
        }
    }, [loading]);

    if (loading) {
        return <LoadingScreen onComplete={() => setLoading(false)} />;
    }

    return (
        <>
            <Navbar/>
            <Index/>
            <Ecogame/>
            <Section/>
            <Footer />
        </>
    );
}
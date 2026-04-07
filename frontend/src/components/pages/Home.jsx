// Home.jsx
import { useState, useEffect } from "react";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import LoadingScreen from "../Layout/Animation";
import Index from "../Home/Index";
import Ecogame from "../Home/Game";
import Section from "../Home/Section";
import { useCookieConsent } from "../../context/Cookieconsentcontext";
import EcoCarousel from "../Home/carrusel";

export default function Home() {
    const [loading, setLoading] = useState(() => {
        return !sessionStorage.getItem('hasSeenLoading');
    });

    const { checkAndShow } = useCookieConsent();

    useEffect(() => {
        if (loading) {
            sessionStorage.setItem('hasSeenLoading', 'true');
        }
    }, [loading]);

    const handleAnimationComplete = () => {
        setLoading(false);
        // El banner de cookies aparece DESPUÉS de que termina la animación
        checkAndShow();
    };

    if (loading) {
        return <LoadingScreen onComplete={handleAnimationComplete} />;
    }

    return (
        <>
            <Navbar />
            <Index />
            <EcoCarousel />
            <Ecogame />
            <Section />
            <Footer />
        </>
    );
}
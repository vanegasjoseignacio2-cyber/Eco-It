import { useEffect } from 'react';
import Navbar from "../Layout/Navbar";
import RegisterHero from "../Auth/RegisterHero";
import RegisterForm from "../Auth/RegisterForm";
import Footer from "../Layout/Footer";
import EfectoEcoOndas from "../animations/FondoRegister";
import { useToast } from '../../context/ToastContext';
import { useCookieConsent } from '../../context/Cookieconsentcontext';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
    const { showToast } = useToast();
    const { openBanner, getCookie } = useCookieConsent();
    const { estaAutenticado } = useAuth();

    useEffect(() => {
        // No mostrar si ya está autenticado
        if (estaAutenticado) return;

        const consent = getCookie('cookie_consent');

        if (consent !== 'accepted') {
            showToast(
                '⚠️ Debes aceptar las cookies para poder registrarte.',
                'warning',
                0,
                { label: 'Aceptar cookies', onClick: openBanner }
            );
        }
    }, [estaAutenticado, showToast, openBanner, getCookie]);

    return (
        <>
            {/* Background animado de fondo */}
            <div className="fixed inset-0 -z-10">
                <EfectoEcoOndas />
            </div>

            <Navbar />
            <div className="max-w-7xl mx-auto mt-28 mb-20 px-4 py-8 xl:flex xl:items-start xl:gap-12">
                <div className="flex-1 mt-24 xl:pl-8 2xl:pl">
                    <RegisterHero />
                </div>
                <div className="flex-none shrink-0">
                    <RegisterForm />
                </div>
            </div>

            <Footer />
        </>
    );
}
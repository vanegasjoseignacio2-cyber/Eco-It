import { useEffect } from 'react';
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import LoginHero from "../Auth/LoginHero";
import LoginForm from "../Auth/LoginForm";
import { useToast } from '../../context/ToastContext';
import { useCookieConsent } from '../../context/Cookieconsentcontext';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const { showToast } = useToast();
    const { openBanner, getCookie } = useCookieConsent();
    const { estaAutenticado } = useAuth();

    useEffect(() => {
        // No mostrar si ya está autenticado
        if (estaAutenticado) return;

        const consent = getCookie('cookie_consent');

        if (consent !== 'accepted') {
            showToast(
                '⚠️ Debes aceptar las cookies para poder iniciar sesión.',
                'warning',
                0,
                { label: 'Aceptar cookies', onClick: openBanner }
            );
        }
    }, [estaAutenticado, showToast, openBanner, getCookie]);

    return (
        <div className="min-h-screen flex flex-col nature-bg">
            <Navbar />

            <main className="bg-gradient-to-br from-emerald-100 to-green-100 flex-1 flex items-center justify-center px-4 pt-24 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 max-w-7xl w-full">
                    <div className="lg:col-span-2">
                        <LoginHero />
                    </div>
                    <div className="lg:col-span-2">
                        <LoginForm />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
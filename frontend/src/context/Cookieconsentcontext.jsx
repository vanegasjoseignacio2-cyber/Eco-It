/**
 * CookieConsentContext
 * ---------------------
 * Gestiona la visibilidad del banner de cookies de forma global.
 * - checkAndShow()  → llámalo cuando la animación de carga termine (Home.jsx)
 * - openBanner()    → llámalo desde Login/Register si la cookie fue rechazada
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from './ToastContext';

const CookieConsentContext = createContext();

export function useCookieConsent() {
    const ctx = useContext(CookieConsentContext);
    if (!ctx) throw new Error('useCookieConsent debe usarse dentro de CookieConsentProvider');
    return ctx;
}

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

export function CookieConsentProvider({ children }) {
    const { showToast } = useToast();
    const [bannerVisible, setBannerVisible] = useState(false);
    const [isAccepted, setIsAccepted] = useState(() => {
        return getCookie('cookie_consent') === 'accepted';
    });

    /** Abre el banner solo si todavía no hay consentimiento guardado */
    const checkAndShow = useCallback(() => {
        const consent = getCookie('cookie_consent');
        if (!consent) {
            setBannerVisible(true);
        }
    }, []);

    /** Fuerza la apertura del banner (para el botón "Volver y aceptar") */
    const openBanner = useCallback(() => {
        setBannerVisible(true);
    }, []);

    const closeBanner = useCallback(() => {
        setBannerVisible(false);
    }, []);

    /** Actualiza el estado de aceptación */
    const updateConsentState = useCallback(() => {
        setIsAccepted(getCookie('cookie_consent') === 'accepted');
    }, []);

    /** Muestra la notificación de que se requieren cookies y abre el banner */
    const showConsentRequiredToast = useCallback(() => {
        showToast(
            '⚠️ Debes aceptar las cookies para poder continuar.',
            'warning',
            0,
            { label: 'Aceptar cookies', onClick: openBanner }
        );
        openBanner();
    }, [showToast, openBanner]);

    return (
        <CookieConsentContext.Provider value={{ 
            bannerVisible, 
            isAccepted, 
            checkAndShow, 
            openBanner, 
            closeBanner, 
            updateConsentState,
            showConsentRequiredToast,
            getCookie 
        }}>
            {children}
        </CookieConsentContext.Provider>
    );
}
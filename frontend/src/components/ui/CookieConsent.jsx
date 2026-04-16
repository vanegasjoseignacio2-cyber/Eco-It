import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import { useCookieConsent } from '../../context/Cookieconsentcontext';

function setCookie(name, value, days = 365) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Strict`;
}

export default function CookieConsent() {
  const { bannerVisible, closeBanner, openBanner, updateConsentState } = useCookieConsent();
  const { showToast } = useToast();

  const handleAccept = () => {
    setCookie('cookie_consent', 'accepted');
    updateConsentState();
    closeBanner();
    showToast('¡Cookies aceptadas! Todas las funciones están habilitadas.', 'success', 3000);
  };

  const handleReject = () => {
    setCookie('cookie_consent', 'rejected');
    updateConsentState();
    closeBanner();
    // duration=0 → no se cierra automáticamente; action → botón dentro del toast
    showToast(
      '⚠️ Sin cookies no podrás iniciar sesión ni usar tu cuenta.',
      'warning',
      0,
      { label: 'Volver y aceptar', onClick: openBanner }
    );
  };

  return (
    <AnimatePresence>
      {bannerVisible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4 sm:bottom-6 sm:px-6"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        >
          <div className="mx-auto max-w-4xl bg-white border border-green-200 shadow-2xl rounded-2xl p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🍪</span>
              <h4 className="text-xl font-bold text-gray-900">Uso de cookies</h4>
            </div>

            {/* Descripción */}
            <p className="text-gray-600 text-base leading-relaxed mb-3">
              Usamos cookies esenciales para el funcionamiento seguro de la plataforma,
              incluyendo la autenticación y gestión de tu sesión.
            </p>

            {/* Advertencia de consecuencias */}
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6">
              <span className="text-amber-500 mt-0.5 text-base">⚠️</span>
              <p className="text-amber-700 text-sm font-medium">
                Si no aceptas las cookies, <strong>no podrás iniciar sesión</strong> ni
                acceder a las funciones de tu cuenta.
              </p>
            </div>

            {/* Botones — apilados en móvil, en fila en escritorio */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={handleReject}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors text-base"
              >
                Rechazar
              </button>
              <button
                onClick={handleAccept}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-base shadow-md"
              >
                Aceptar cookies
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
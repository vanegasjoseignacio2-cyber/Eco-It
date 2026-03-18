import React, { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function setCookie(name, value, days = 365) {
  const maxAge = days * 24 * 60 * 60; // seconds
  // SameSite=Strict para reducir riesgo CSRF
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Strict`; 
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const consent = getCookie('cookie_consent');
    if (!consent) {
      // show banner
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie('cookie_consent', 'accepted');
    setVisible(false);
    showToast('Gracias por aceptar las cookies. Algunas funciones se habilitarán.', 'success');

    // Nota: para almacenar tokens de forma segura (HttpOnly) el backend debe establecer
    // la cookie HttpOnly después del login. Si quieres puedo implementar el endpoint en backend.
  };

  const handleReject = () => {
    setCookie('cookie_consent', 'rejected');
    setVisible(false);
    showToast('Has rechazado las cookies. Algunas funcionalidades pueden no estar disponibles.', 'info');
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] max-w-3xl w-full px-4">
      <div className="bg-white border border-green-100 shadow-lg rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">Uso de cookies</h4>
          <p className="text-gray-600 text-sm">Usamos cookies para mejorar la experiencia. Acepta para habilitar funcionalidades esenciales y seguridad.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReject} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700">Rechazar</button>
          <button onClick={handleAccept} className="px-4 py-2 rounded-lg bg-green-600 text-white">Aceptar</button>
        </div>
      </div>
    </div>
  );
}

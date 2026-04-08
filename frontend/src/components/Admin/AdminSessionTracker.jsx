import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutos en milisegundos

const AdminSessionTracker = () => {
    const { logout, usuario } = useAuth();
    const { showToast } = useToast();
    const timeoutRef = useRef(null);

    const handleLogout = useCallback(() => {
        showToast("Sesión cerrada por inactividad.", "warning", 5000);
        logout();
    }, [logout, showToast]);

    const resetTimer = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(handleLogout, INACTIVITY_LIMIT);
    }, [handleLogout]);

    useEffect(() => {
        // Solo rastrear si es admin
        if (!usuario || (usuario.rol !== 'admin' && usuario.rol !== 'superadmin')) {
            return;
        }

        // Eventos a monitorear
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'click'
        ];

        // Inicializar timer
        resetTimer();

        // Agregar listeners
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Cleanup al desmontar
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [usuario, resetTimer]);

    return null; // Este componente no renderiza nada
};

export default AdminSessionTracker;

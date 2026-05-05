import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from './ToastContext';
import { AUTH_EXPIRED_EVENT, obtenerPerfil } from '../services/api';

const AuthContext = createContext();

const AUTH_CHANGE_EVENT = 'auth-change';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  // renombrado a 'loading' para que coincida con consumidores (PrivateRoute)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    cargarUsuario();

    const handleAuthChange = () => {
      cargarUsuario();
    };

    const handleAuthExpired = () => {
      console.warn('Sesión expirada - Redirigiendo a login');
      logout();
      showToast('Su sesión ha expirado. Por favor, inicie sesión nuevamente.', 'error', 5000);
      navigate('/login', { replace: true });
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
  }, []);

  const cargarUsuario = useCallback(async () => {
    // Si no hay indicador de sesión, evitamos la petición (y el 401 en consola)
    if (!localStorage.getItem('sesionActiva')) {
      setLoading(false);
      return;
    }
    try {
      const response = await obtenerPerfil({ skipAuthError: true });
      if (response && response.data) {
        setToken(true); // Solo usamos 'true' como flag visual, el token real está en la cookie
        setUsuario(response.data);
      } else {
        localStorage.removeItem('sesionActiva');
        setToken(null);
        setUsuario(null);
      }
    } catch (error) {
      // Token expirado o inválido — limpiar el flag
      localStorage.removeItem('sesionActiva');
      setToken(null);
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * login(tokenNuevo, usuarioNuevo, redirectOverride?)
   *
   * redirectOverride: ruta opcional para forzar una redirección específica.
   * Si no se pasa, redirige según el rol:
   *   - admin → /admin
   *   - usuario normal → /
   *
   * Úsalo desde GoogleSuccess para el caso perfilCompleto:
   *   login(token, usuario, '/completar-perfil')
   */
  const login = useCallback((tokenNuevo, usuarioNuevo, redirectOverride = null) => {
    const isAdmin = usuarioNuevo.rol === "admin" || usuarioNuevo.rol === "superadmin";

    // Marcar sesión activa para que cargarUsuario haga la petición al recargar
    localStorage.setItem('sesionActiva', '1');

    // actualizar estado primero
    setToken(true); // Flag de autenticado
    setUsuario(usuarioNuevo);

    // permitir que React aplique el setState antes de navegar
    setTimeout(() => {
      if (redirectOverride) {
        navigate(redirectOverride, { replace: true });
      } else if (isAdmin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

      // notificar otros listeners
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    }, 0);
  }, [navigate]);

  const logout = useCallback(async () => {
    console.log('Logout - Limpiando sesión');

    try {
      // Usar ruta relativa en dev (proxy de Vite) o URL absoluta en prod
      const logoutUrl = import.meta.env.VITE_BACKEND_URL
        ? `${import.meta.env.VITE_BACKEND_URL.replace('/api', '')}/api/auth/logout`
        : '/api/auth/logout';
      await fetch(logoutUrl, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error al hacer logout en el servidor:', error);
    }

    setToken(null);
    setUsuario(null);
    localStorage.removeItem('sesionActiva');
  }, []);

  const actualizarUsuario = useCallback((usuarioActualizado) => {
    setUsuario(usuarioActualizado);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }, []);

  const value = {
    usuario,
    token,
    loading,
    login,
    logout,
    actualizarUsuario,
    estaAutenticado: !!token,
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 60%, #ecfdf5 100%)',
        zIndex: 9999,
        gap: '1rem',
      }}>
        {/* Emoji + nombre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>🌿</span>
          <span style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#15803d',
            letterSpacing: '-0.02em',
            fontFamily: 'system-ui, sans-serif',
          }}>
            Eco-It
          </span>
        </div>

        {/* Spinner */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '4px solid #bbf7d0',
          borderTopColor: '#16a34a',
          animation: 'eco-spin 0.8s linear infinite',
        }} />

        <style>{`
          @keyframes eco-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
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
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banInfo, setBanInfo] = useState(null);
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

    const handleUserBanned = (e) => {
      setBanInfo(e.detail);
      setBanModalOpen(true);
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    window.addEventListener('USER_BANNED', handleUserBanned);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
      window.removeEventListener('USER_BANNED', handleUserBanned);
    };
  }, []);

  const cargarUsuario = useCallback(async () => {
    // Si no hay token, evitamos la petición (y el 401 en consola)
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    try {
      const response = await obtenerPerfil({ skipAuthError: true });
      if (response && response.data) {
        setToken(storedToken);
        setUsuario(response.data);
      } else {
        localStorage.removeItem('token');
        setToken(null);
        setUsuario(null);
      }
    } catch (error) {
      // Token expirado o inválido — limpiar el token
      localStorage.removeItem('token');
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

    // Guardar token en localStorage
    localStorage.setItem('token', tokenNuevo);

    // actualizar estado primero
    setToken(tokenNuevo);
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
        // credentials: 'include' // Ya no se necesitan cookies
      });
    } catch (error) {
      console.error('Error al hacer logout en el servidor:', error);
    }

    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
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

  return (
    <AuthContext.Provider value={value}>
      {children}
      {banModalOpen && banInfo && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '24rem',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '9999px',
              backgroundColor: '#fee2e2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>!</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>Cuenta Suspendida</h3>
            <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Tu acceso a la plataforma ha sido restringido temporalmente.
            </p>
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>Motivo de la suspensión:</p>
              <p style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: 500 }}>{banInfo.banReason || 'Incumplimiento de las normas'}</p>
              {banInfo.banHasta && (
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  Restricción válida hasta: {new Date(banInfo.banHasta).toLocaleDateString('es-CO')}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setBanModalOpen(false);
                setBanInfo(null);
                logout();
                navigate('/login', { replace: true });
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};
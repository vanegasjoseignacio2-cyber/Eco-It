import { createContext, useContext, useState, useEffect } from 'react';
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

  const cargarUsuario = async () => {
    try {
      const response = await obtenerPerfil();
      if (response && response.data) {
        setToken(true); // Solo usamos 'true' como flag visual, el token real está en la cookie
        setUsuario(response.data);
      } else {
        setToken(null);
        setUsuario(null);
      }
    } catch (error) {
      console.log('No hay sesión activa o token expirado');
      setToken(null);
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

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
  const login = (tokenNuevo, usuarioNuevo, redirectOverride = null) => {
    const isAdmin = usuarioNuevo.rol === "admin" || usuarioNuevo.rol === "superadmin";

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
  };

  const logout = async () => {
    console.log('Logout - Limpiando sesión');

    try {
      // Llamar al backend para eliminar la cookie HttpOnly
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error al hacer logout en el servidor:', error);
    }

    setToken(null);
    setUsuario(null);
    localStorage.removeItem('sesionActiva');

    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  };

  const actualizarUsuario = (usuarioActualizado) => {
    setUsuario(usuarioActualizado);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  };

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
    return <div>Cargando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
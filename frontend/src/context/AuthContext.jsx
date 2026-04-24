import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from './ToastContext';
import { AUTH_EXPIRED_EVENT } from '../services/api';

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

  const cargarUsuario = () => {
    // Intentar cargar de sessionStorage primero (sesiones volátiles / admins)
    let tokenGuardado = sessionStorage.getItem('token');
    let usuarioGuardado = sessionStorage.getItem('usuario');

    // Si no está en sessionStorage, buscar en localStorage (usuarios con 'Recordarme')
    if (!tokenGuardado) {
      tokenGuardado = localStorage.getItem('token');
      usuarioGuardado = localStorage.getItem('usuario');
    }

    if (tokenGuardado && usuarioGuardado) {
      try {
        const usuarioParsed = JSON.parse(usuarioGuardado);
        setToken(tokenGuardado);
        setUsuario(usuarioParsed);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('usuario');
        setToken(null);
        setUsuario(null);
      }
    } else {
      setToken(null);
      setUsuario(null);
    }
    setLoading(false);
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
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    // Si es admin o no marcó 'Recordarme', usamos sessionStorage
    const storage = (isAdmin || !rememberMe) ? sessionStorage : localStorage;

    localStorage.setItem("sesionActiva", "true");
    storage.setItem('token', tokenNuevo);
    storage.setItem('usuario', JSON.stringify(usuarioNuevo));

    // Limpiar el otro storage para evitar inconsistencias
    if (storage === sessionStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    } else {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('usuario');
    }

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
  };

  const logout = () => {
    console.log('Logout - Limpiando sesión');

    setToken(null);
    setUsuario(null);

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('sesionActiva');

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');

    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  };

  const actualizarUsuario = (usuarioActualizado) => {
    setUsuario(usuarioActualizado);
    
    // Verificar en qué storage está la sesión actual y actualizar el correspondiente
    if (sessionStorage.getItem('token')) {
      sessionStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    } else if (localStorage.getItem('token')) {
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    }

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
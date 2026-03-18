import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

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

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    };
  }, []);

  const cargarUsuario = () => {
    const tokenGuardado = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (tokenGuardado && usuarioGuardado) {
      try {
        const usuarioParsed = JSON.parse(usuarioGuardado);
        setToken(tokenGuardado);
        setUsuario(usuarioParsed);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
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
    localStorage.setItem("sesionActiva", "true");
    localStorage.setItem('token', tokenNuevo);
    localStorage.setItem('usuario', JSON.stringify(usuarioNuevo));

    // actualizar estado primero
    setToken(tokenNuevo);
    setUsuario(usuarioNuevo);

    // permitir que React aplique el setState antes de navegar
    setTimeout(() => {
      if (redirectOverride) {
        navigate(redirectOverride, { replace: true });
      } else if (usuarioNuevo.rol === "admin") {
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

    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  };

  const actualizarUsuario = (usuarioActualizado) => {
    setUsuario(usuarioActualizado);
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

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
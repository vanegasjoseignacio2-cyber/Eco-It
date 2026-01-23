import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Evento personalizado para sincronización
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
  const [cargando, setCargando] = useState(true);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    cargarUsuario();

    // Listener para detectar cambios de autenticación
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
    setCargando(false);
  };

  // Función para hacer login
  const login = (tokenNuevo, usuarioNuevo) => {
    console.log('Login - Guardando usuario:', usuarioNuevo);
    
    // Actualizar estado
    setToken(tokenNuevo);
    setUsuario(usuarioNuevo);
    
    // Guardar en localStorage
    localStorage.setItem('token', tokenNuevo);
    localStorage.setItem('usuario', JSON.stringify(usuarioNuevo));
    
    // Disparar evento de cambio
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  };

  // Función para hacer logout
  const logout = () => {
    console.log('Logout - Limpiando sesión');
    
    // Limpiar estado
    setToken(null);
    setUsuario(null);
    
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rememberMe');
    
    // Disparar evento de cambio
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  };

  // Función para actualizar usuario
  const actualizarUsuario = (usuarioActualizado) => {
    setUsuario(usuarioActualizado);
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    
    // Disparar evento de cambio
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  };

  const value = {
    usuario,
    token,
    cargando,
    login,
    logout,
    actualizarUsuario,
    estaAutenticado: !!token,
  };

  if (cargando) {
    return <div>Cargando...</div>; // O un spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
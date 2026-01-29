const API_URL = 'http://localhost:3000/api';

// Función auxiliar para hacer peticiones
const fetchAPI = async (endpoint, options = {}) => {
  try {
    // Configurar opciones de fetch
    const fetchOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Agregar body solo si existe
    if (options.body) {
      fetchOptions.body = options.body;
    }

    const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensaje || 'Error en la petición');
    }

    return data;
  } catch (error) {
    console.error('Error en fetchAPI:', error);
    throw error;
  }
};

// ============= AUTENTICACIÓN =============

export const registrarUsuario = async (datosUsuario) => {
  return fetchAPI('/auth/registro', {
    method: 'POST',
    body: JSON.stringify(datosUsuario),
  });
};

export const iniciarSesion = async (credenciales) => {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credenciales),
  });
};

// ============= USUARIO =============

export const obtenerPerfil = async (token) => {
  return fetchAPI('/user/perfil', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const actualizarPerfil = async (token, datosActualizados) => {
  return fetchAPI('/user/perfil', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(datosActualizados),
  });
};

export const cambiarPassword = async (token, passwords) => {
  return fetchAPI('/user/cambiar-password', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(passwords),
  });
};

export const recuperarPassword = async (email) => {
  return fetchAPI('/user/recuperar-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const verificarCodigo = async (email, codigo) => {
  return fetchAPI('/user/verificar-codigo', {
    method: 'POST',
    body: JSON.stringify({ email, codigo }),
  });
};

export const restablecerPassword = async (email, codigo, password) => {
  return fetchAPI('/user/restablecer-password', {
    method: 'POST',
    body: JSON.stringify({ email, codigo, password }),
  });
};

// ============= IA =============

export const consultarIA = async (token, pregunta) => {
  return fetchAPI('/ai/consultar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ pregunta }),
  });
};

export const analizarImagen = async (token, imagen, contexto = '') => {
  return fetchAPI('/ai/analizar-imagen', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ imagen, contexto }),
  });
};

export const obtenerSugerencias = async (token) => {
  return fetchAPI('/ai/sugerencias', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};
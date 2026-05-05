// Dev: VITE_BACKEND_URL está vacío → usa '/api' → el proxy de Vite redirige a localhost:3000
// Prod: VITE_BACKEND_URL = 'https://backend-production-1e6e.up.railway.app/api'
const BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api';

export const AUTH_EXPIRED_EVENT = 'auth-expired';

// Función auxiliar para hacer peticiones
export const fetchAPI = async (endpoint, options = {}) => {
  try {
    // Configurar opciones de fetch
    const fetchOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Agregar token si existe en localStorage
    const token = localStorage.getItem('token');
    if (token) {
      fetchOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    // Agregar body solo si existe
    if (options.body) {
      fetchOptions.body = options.body;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && !options.skipAuthError) {
        window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
      }
      const error = new Error(data.message || data.mensaje || data.error || 'Error en la petición');
      error.data = data;
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    // Si es un 401 esperado (verificación de sesión al arrancar), no lo mostramos como error
    if (options.skipAuthError && error.status === 401) {
      // silencio intencional — no hay sesión activa
    } else {
      console.error('Error en fetchAPI:', error);
    }
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

// Alias para compatibilidad con RegisterForm
export const registerUser = registrarUsuario;


export const iniciarSesion = async (credenciales) => {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credenciales),
  });
};

// ============= USUARIO =============

export const obtenerPerfil = async (options = {}) => {
  return fetchAPI('/user/perfil', {
    method: 'GET',
    ...options
  });
};

export const actualizarPerfil = async (datosActualizados) => {
  return fetchAPI('/user/perfil', {
    method: 'PUT',
    body: JSON.stringify(datosActualizados),
  });
};

export const cambiarPassword = async (passwords) => {
  return fetchAPI('/user/cambiar-password', {
    method: 'PUT',
    body: JSON.stringify(passwords),
  });
};

export const eliminarPerfil = async () => {
  return fetchAPI('/user/perfil', {
    method: 'DELETE',
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

export const reenviarCodigo = async (email) => {
  return fetchAPI('/user/reenviar-codigo', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const restablecerPassword = async (email, codigo, password) => {
  return fetchAPI('/user/restablecer-password', {
    method: 'POST',
    body: JSON.stringify({ email, codigo, password }),
  });
};

// ============= IA =============

export const consultarIA = async (pregunta, chatId, onChunk, signal) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/ai/consultar`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ pregunta, chatId }),
    signal,
  });

  if (!response.ok) {
    const data = await response.json();
    if (response.status === 401) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    const error = new Error(data.message || data.mensaje || data.error || 'Error en la petición');
    error.data = data;
    error.status = response.status;
    throw error;
  }

  // Leer stream chunk a chunk
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    const lines = text.split('\n').filter(line => line.startsWith('data: '));

    for (const line of lines) {
      const data = line.replace('data: ', '').trim();
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data);
        if (parsed.content) onChunk(parsed.content, null); 
        if (parsed.chatId) onChunk(null, parsed.chatId);
      } catch { }
    }
  }
};

export const analizarImagen = async (imagen, contexto = '', chatId = null, signal) => {
  return fetchAPI('/ai/analizar-imagen', {
    method: 'POST',
    body: JSON.stringify({ imagen, contexto, chatId }),
    signal,
  });
};

export const obtenerChats = async () => {
  return fetchAPI('/ai/chats', {
    method: 'GET',
  });
};

export const obtenerChat = async (id) => {
  return fetchAPI(`/ai/chats/${id}`, {
    method: 'GET',
  });
};

export const eliminarChat = async (id) => {
  return fetchAPI(`/ai/chats/${id}`, {
    method: 'DELETE',
  });
};

export const eliminarTodosLosChats = async () => {
  return fetchAPI('/ai/chats', {
    method: 'DELETE',
  });
};

export const obtenerSugerencias = async () => {
  return fetchAPI('/ai/sugerencias', {
    method: 'GET',
  });
};

// ============= CARRUSEL =============

export const obtenerSlidesPublicos = async () => {
  return fetchAPI('/carousel');
};

export const obtenerSlidesAdmin = async () => {
  return fetchAPI('/carousel/admin', {
    method: 'GET',
  });
};

export const crearSlide = async (datosSlide) => {
  return fetchAPI('/carousel', {
    method: 'POST',
    body: JSON.stringify(datosSlide),
  });
};

export const actualizarSlide = async (id, datosActualizados) => {
  return fetchAPI(`/carousel/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datosActualizados),
  });
};

export const eliminarSlide = async (id) => {
  return fetchAPI(`/carousel/${id}`, {
    method: 'DELETE',
  });
};

export const reordenarSlides = async (ids) => {
  return fetchAPI('/carousel/reorder', {
    method: 'PATCH',
    body: JSON.stringify({ slides: ids }),
  });
};
const BASE_URL = 'http://localhost:3000/api';

export const AUTH_EXPIRED_EVENT = 'auth-expired';

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

    const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
      }
      throw new Error(data.message || data.mensaje || 'Error en la petición');
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

// Alias para compatibilidad con RegisterForm
export const registerUser = registrarUsuario;


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

export const eliminarPerfil = async (token) => {
  return fetchAPI('/user/perfil', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
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

export const consultarIA = async (token, pregunta, chatId, onChunk, signal) => {
  const response = await fetch(`${BASE_URL}/ai/consultar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ pregunta, chatId }),
    signal,
  });

  if (!response.ok) {
    const data = await response.json();
    if (response.status === 401) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    throw new Error(data.message || data.mensaje || 'Error en la petición');
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

export const analizarImagen = async (token, imagen, contexto = '', chatId = null, signal) => {
  return fetchAPI('/ai/analizar-imagen', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ imagen, contexto, chatId }),
    signal,
  });
};

export const obtenerChats = async (token) => {
  return fetchAPI('/ai/chats', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const obtenerChat = async (token, id) => {
  return fetchAPI(`/ai/chats/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const eliminarChat = async (token, id) => {
  return fetchAPI(`/ai/chats/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const eliminarTodosLosChats = async (token) => {
  return fetchAPI('/ai/chats', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
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

// ============= CARRUSEL =============

export const obtenerSlidesPublicos = async () => {
  return fetchAPI('/carousel');
};

export const obtenerSlidesAdmin = async (token) => {
  return fetchAPI('/carousel/admin', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const crearSlide = async (token, datosSlide) => {
  return fetchAPI('/carousel', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(datosSlide),
  });
};

export const actualizarSlide = async (token, id, datosActualizados) => {
  return fetchAPI(`/carousel/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(datosActualizados),
  });
};

export const eliminarSlide = async (token, id) => {
  return fetchAPI(`/carousel/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const reordenarSlides = async (token, ids) => {
  return fetchAPI('/carousel/reorder', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ slides: ids }),
  });
};